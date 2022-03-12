package main

import (
	"context"
	"encoding/json"
	"log"
	"os"
	"os/signal"
	"syscall"

	"github.com/gorilla/websocket"
)

type Trade struct {
	Exchange  string  `json:"exchange"`
	Base      string  `json:"base"`
	Quote     string  `json:"quote"`
	Direction string  `json:"direction"`
	Price     float64 `json:"price"`
	Volume    int64   `json:"volume"`
	Timestamp int64   `json:"timestamp"`
	PriceUsd  float64 `json:"priceUsd"`
}

func main() {
	var ws, _, err = websocket.DefaultDialer.Dial("wss://ws.coincap.io/trades/binance", nil)
	if err != nil {
		panic(err)
	}

	log.Println("connected")

	sigs := make(chan os.Signal, 1)
	signal.Notify(sigs, syscall.SIGINT, syscall.SIGTERM)

	done := make(chan bool, 1)
	ctx := context.WithValue(context.Background(), "EXIT", done)

	msg_channel := read_data(ctx, ws)
	msg_channel = with_pair(ctx, msg_channel, "ethereum", "tether")

	is_run := true
	for is_run {
		select {
		case trade_data := <-msg_channel:
			{
				log.Println(trade_data)
			}
		case <-sigs:
			{
				log.Println("SIGINT: closed")
				ws.Close()
				close(done)
				is_run = false
				break
			}
		}
	}
}

func read_data(ctx context.Context, ws *websocket.Conn) chan Trade {
	var msg_channel = make(chan Trade)
	exit_channel := ctx.Value("EXIT").(chan bool)
	is_run := true
	go func() {
		<-exit_channel
		is_run = false
		close(msg_channel)
	}()

	go func() {
		for is_run {
			var _, data, err = ws.ReadMessage()
			if err != nil {
				break
			}
			var trade Trade
			json.Unmarshal(data, &trade)
			msg_channel <- trade
		}
	}()

	return msg_channel
}

func with_pair(ctx context.Context, msg_channel chan Trade, base string, qoute string) chan Trade {
	filtered_channel := make(chan Trade)
	exit_channel := ctx.Value("EXIT").(chan bool)
	go func() {
		<-exit_channel
		close(filtered_channel)
	}()

	go func() {
		for v := range msg_channel {
			if v.Base == base && v.Quote == qoute {
				filtered_channel <- v
			}
		}
	}()

	return filtered_channel
}

package main

import (
	"context"
	"fmt"
	"io"
	"net/http"
	"os"
	"os/signal"
	"sync"
	"syscall"
	"time"

	"golang.org/x/sync/errgroup"
)

func main() {
	var wg sync.WaitGroup
	wg.Add(3)

	ctx, cancel := context.WithCancel(context.Background())

	eg, egCtx := errgroup.WithContext(context.Background())
	eg.Go(createHTTPServer(ctx, "hello world", ":7000", helloWorldHandler, &wg))
	eg.Go(createHTTPServer(ctx, "hello name", ":8000", helloNameHandler, &wg))
	eg.Go(createHTTPServer(ctx, "echo", ":9000", echoHandler, &wg))

	go func() {
		<-egCtx.Done()
		cancel()
	}()

	go func() {
		signals := make(chan os.Signal, 1)
		signal.Notify(signals, syscall.SIGINT, syscall.SIGTERM)
		<-signals
		cancel()
	}()

	if err := eg.Wait(); err != nil {
		fmt.Printf("error in the server goroutines: %s\n", err)
		os.Exit(1)
	}
	fmt.Println("everything closed successfully")
}

func createHTTPServer(
	ctx context.Context,
	name, addr string,
	handler http.HandlerFunc,
	wg *sync.WaitGroup,
) func() error {
	return func() error {
		mux := http.NewServeMux()
		mux.HandleFunc("/", handler)
		server := &http.Server{Addr: addr, Handler: mux}
		errChan := make(chan error, 1)

		go func() {
			<-ctx.Done()
			shutCtx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
			defer cancel()
			if err := server.Shutdown(shutCtx); err != nil {
				errChan <- fmt.Errorf("error shutting down the %s server: %w", name, err)
			}
			fmt.Printf("the %s server is closed\n", name)
			close(errChan)
			wg.Done()
		}()

		fmt.Printf("the %s server is starting\n", name)
		if err := server.ListenAndServe(); err != http.ErrServerClosed {
			return fmt.Errorf("error starting the %s server: %w", name, err)
		}
		fmt.Printf("the %s server is closing\n", name)
		err := <-errChan
		wg.Wait()
		return err
	}
}

func helloWorldHandler(w http.ResponseWriter, r *http.Request) {
	w.WriteHeader(http.StatusOK)
	w.Write([]byte(`Hello, world!`))
}

func helloNameHandler(w http.ResponseWriter, r *http.Request) {
	params := r.URL.Query()
	name := params.Get("name")

	w.WriteHeader(http.StatusOK)
	w.Write([]byte(fmt.Sprintf("Hello, %s!", name)))
}

func echoHandler(w http.ResponseWriter, r *http.Request) {
	w.WriteHeader(http.StatusOK)
	io.Copy(w, r.Body)
}

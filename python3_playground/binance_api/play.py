import os
import math
import time
from dotenv import load_dotenv
from binance.client import Client
import pandas as pd
import matplotlib.pyplot as plt

load_dotenv()

ONE_HOUR_IN_MS = 60 * 60 * 1000


def fetch_price(client: Client, pair: str, from_unix_time: int, to_unix_time: int, interval=Client.KLINE_INTERVAL_1MINUTE):
    data = client.get_historical_klines(
        pair, interval, from_unix_time, to_unix_time)

    df = pd.DataFrame(data, columns=["open_time", "open", "high", "low", "close_price",
                      "volume", "close_time", "volume", "trades", "ignore_1", "ignore_2", "ignore_3"])

    df = df.loc[:, ["close_time", "close_price"]]
    df["close_time"] = pd.to_datetime(df["close_time"], unit="ms")
    df["close_price"] = pd.to_numeric(df["close_price"])

    return df


def get_client():
    api_key = os.environ['BINANCE_API_KEY']
    api_secret = os.environ['BINANCE_SECRET']
    return Client(api_key, api_secret)


def main():
    client = get_client()
    now = math.floor(time.time() * 1000)

    df = fetch_price(client, "MATICUSDT", now - 36 * ONE_HOUR_IN_MS, now)

    print(df)
    print("MinTimestamp: ", df["close_time"].min().timestamp()*1000)
    print("MaxTimestamp: ", df["close_time"].max().timestamp()*1000)

    df.to_pickle("./out/pair_MATICUSDT.pkl")
    plt.plot(df["close_time"], df["close_price"])
    plt.show()


if __name__ == "__main__":
    main()

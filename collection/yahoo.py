import pandas as pd
import datetime
from yfinance import Ticker as si


def stock_price(ticker: str, start_date: str, end_date: str, output_name: str):
    """
    type: in

    Imports stock prices from the Yahoo Finance API.

    Parameters:
    - ticker (str): the stock ticker symbol.
    - start_date (str): the start date in 'YYYY-MM-DD' format
    - end_date (str): the end date in 'YYYY-MM-DD' format
    - output_name (str): the name of the file to save the output data in csv format
    """
    # since yahoo API retrieval end date is exclusive, need to add one day to the date
    end_date = (datetime.date.fromisoformat(end_date) +
                datetime.timedelta(days=1)).strftime("%Y-%m-%d")
    df = si(ticker).history(start=start_date, end=end_date)
    df['Date'] = pd.to_datetime(df.index).strftime("%Y-%m-%d")
    df['Date'] = pd.to_datetime(df['Date'])
    df.set_index(['Date'], drop=True, inplace=True)

   # date_col = df.pop('Date')
    #df.insert(0, 'Date', date_col)

    df.to_csv(f"{output_name}")

    return df

import requests
import time
from datetime import datetime
from nltk import download
from nltk.sentiment.vader import SentimentIntensityAnalyzer
import pandas as pd

API_KEY = 'ckpiehhr01qkitmj28a0ckpiehhr01qkitmj28ag'


def retrieve_news(ticker: str, start_date: str, end_date: str, output_name: str):
    """
    type: in

    Retrieves financial news stories related to the specified stock from FinnHub and aggregates them per day

    Parameters:
    - ticker (str): stock code
    - start_date (str): string in yyyy-mm-dd format representing the start of the range to retrieve news stories from
    - end_date (str): string in yyyy-mm-dd format representing the end of the range to retrieve news stories from
    - output_name (str): name of the output csv to be written 

    Returns:
    - pd.DataFrame: a two column dataframe containing the date and a list of headlines as strings
    """

    df = pd.DataFrame(columns=['Date', 'Headlines'])

    # creating a date range separated 3 days apart
    dates = pd.date_range(start_date, end_date, freq='3D')
    dates = [date.strftime('%Y-%m-%d') for date in dates]
    # adding any leftover dates caused by a non-multiple of 3
    leftover_dates = pd.date_range(dates[-1], end_date)
    leftover_dates = [date.strftime('%Y-%m-%d') for date in leftover_dates]
    dates = dates + leftover_dates[1:]

    # API is rate limited to 60 calls per minute
    # Program times out for 20 seconds each time the API refuses data retrieval
    i = 0
    j = len(dates) - 1
    while i < j:
        request = requests.get('https://finnhub.io/api/v1/company-news?symbol=' + ticker + '&from=' +
                               dates[i] + '&to=' + dates[i+1] + '&token=' + API_KEY)
        request_json = request.json()

        #check for API timeout
        if (str(request_json).startswith("{'error': 'API limit reached.")):
            print("API limit exceeded. Waiting 20 seconds")
            time.sleep(20)
            print("Resuming...")
            continue
        else:
            i += 1

        # extract date in UTC from timestamp and headline and add to dataframe
        for item in request_json:
            #TODO: Standardise timezone to be used
            date = datetime.utcfromtimestamp(
                item['datetime']).strftime('%Y-%m-%d')
            headline = item['headline']
            new_row = {'Date': date, 'Headlines': headline}
            df = pd.concat([df, pd.DataFrame([new_row])], ignore_index=True)

    # some of the data comes tagged with strange dates
    # any earlier than the specified start date are dropped
    df = df[df['Date'] >= start_date]
    df['Date'] = pd.to_datetime(df['Date'])

    # collapse the dataframe into one row per year
    df = df.groupby('Date').agg(lambda x: x)

    download('vader_lexicon')
    analyser = SentimentIntensityAnalyzer()

    def sentiment_analysis(x):
        scores = [ analyser.polarity_scores(headline)['compound'] for headline in x['Headlines'] ]
        x['Sentiment'] = round(sum(scores) / len(scores), 3)
        return x

    df = df.apply(sentiment_analysis, axis=1)
    df = df.drop(['Headlines'], axis=1)

    df.to_csv(f"{output_name}")

    return df

# # example usage
# news_df = retrieve_news('AAPL', "2023-01-01", "2023-01-15", "test.csv")
# with pd.option_context('display.max_rows', None,
#                        'display.max_columns', None,
#                        'display.precision', 3,
#                        'max_colwidth', 125,
#                        ):
#     print(news_df)

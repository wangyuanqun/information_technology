from statsmodels.tsa.arima.model import ARIMA
from pandas.tseries.holiday import USFederalHolidayCalendar
from pandas.tseries.offsets import CustomBusinessDay
import pandas as pd


# Function to create our own forecasting dataset 
def forecasting_data_prep(data: str, output_col: str, lag_range: int, output_name: str):
    """
    type: proc

    returns a new dataframe with a given time lag on the specified data

    Parameters:
    - data (string): name of input dataframe to be read
    - output_col (string): name of column to be targeted
    - lag_range (int): final value in range starting from 1 to be used for time lag
    - output_name (string): name of the output csv to be written

    Returns:
    - pd.DataFrame: a processed dataframe as per the specified values
    """
    data = pd.read_csv(f"{data}", index_col=0)
    df = data[[output_col]].copy()

    # Add lag features
    for i in range(1, lag_range):  
        df.loc[:, f'lag_{i}'] = df['Close'].shift(i)
    
    df.dropna(inplace=True)
    
    df.to_csv(f"{output_name}")

    return df



def fit_arma(data: str, target_column: str, output_name: str, p: int, q: int, forecast_steps:int=10, pred_start_date:str='2022-12-23', pred_end_date:str='2023-01-05'):
    """
    type: proc

    Fit an ARMA(p,q) model to the data.
    
    Parameters:
    - data (str): name of dataframe containing time series data.
    - target_column (str): name of column to be used for prediction
    - output_name (str): name for output csv to be written to
    - p (int): Order of the AR part.
    - q (int): Order of the MA part.
    - forecast_steps (int): number of previous days to forecast based upon
    - pred_start_date (str): start date for forecast prediction
    - pred_end_date (str): end date for forecast prediction
    
    Returns:
    - results (ARIMAResults object): Fitted ARMA model results.
    """
      
    # Ref: https://github.com/statsmodels/statsmodels/issues/6462  
    data = pd.read_csv(f"{data}",
        index_col=0,
        parse_dates=True,
        dayfirst=True,
        squeeze=True)
    data = data[target_column]

    # Create a custom business day frequency excluding US federal holidays
    us_bd = CustomBusinessDay(calendar=USFederalHolidayCalendar())

    # If data is a pd.Series with a datetime index, set a custom business day frequency if not already present
    if isinstance(data, pd.Series) and isinstance(data.index, pd.DatetimeIndex) and data.index.freq is None:
        data.index = data.index.tz_localize(None)  # Convert timezone-aware datetime to naive datetime
        data = data.asfreq(us_bd)
    
    model = ARIMA(data, order=(p, 0, q))
    results = model.fit()
    
    # Forecasting the next "forecast_steps" data points beyond the end of training data
    forecast = results.forecast(steps=forecast_steps)

    yhat = results.predict(pred_start_date, pred_end_date)

    yhat.to_csv(f"{output_name}")

    return yhat, forecast


# train_data = tickerDf["Close"]
# rese, forecast = fit_arma(train_data, 2, 2)
# print(rese)
# print(forecast)

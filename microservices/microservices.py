# Additional microservices

import pandas as pd
import plotly.graph_objects as go
import numpy as np

def drop_columns(input_file: str, columns_to_drop: list[str], output_file: str):
    """
    type: proc

    Microservice to drop columns from a dataframe.

    Parameters:
    - input_file (str): name of input dataframe to be read
    - columns_to_drop (list): list of columns to be dropped
    - output_file (str): name of the output file

    Returns:
    - pd.DataFrame: a processed dataframe with the required columns dropped.
    """

    df = pd.read_csv(f"{input_file}", index_col=0)

    updated_df = df.drop(columns_to_drop, axis=1, errors='ignore')

    updated_df.to_csv(f"{output_file}")

    return updated_df


def gauge_visualisation(input_file: str, date_str: str, output_file: str):

    """
    type: out

    Microservice to visualise the sentiment value.

    Parameters:
    - input_file (str): name of input dataframe to be read
    - date_str (str): date for the sentiment
    - output_file (str): name of output csv to be written

    Returns:
    - pd.DataFrame: a processed html file with the required visualisation data
    """
    df = pd.read_csv(f"{input_file}", index_col=0)

    val = df.loc[date_str, 'Sentiment'] * 500

    pos = df.index.get_loc(date_str)
    previous_date = df.index[pos - 1] if pos > 0 else date_str

    ref_val = df.loc[previous_date, 'Sentiment'] * 500

    fig = go.Figure(go.Indicator(
        mode = "gauge+number+delta",
        value = val,
        domain = {'x': [0, 1], 'y': [0, 1]},
        title = {'text': "Sentiment Value", 'font': {'size': 24}},
        delta = {'reference': ref_val, 'increasing': {'color': "green"}},
        gauge = {
            'axis': {'range': [None, 500], 'tickwidth': 1, 'tickcolor': "darkblue"},
            'bar': {'color': "darkblue"},
            'bgcolor': "white",
            'borderwidth': 2,
            'bordercolor': "gray"
            }))

    fig.update_layout(paper_bgcolor = "lavender", font = {'color': "darkblue", 'family': "Arial"})

    # fig.show()
    fig.write_html(f"{output_file}")

    return None

# # Create 5 dates as a DateTimeIndex
# dates = pd.date_range(start='2023-01-01', periods=5, freq='D')

# # Create 5 random values between 0 and 1
# values = np.random.rand(5)

# # Create the DataFrame
# df = pd.DataFrame({'Value': values}, index=dates)

# print(df)

# gauge_visualisation(df, '2023-01-04', 'out.html')

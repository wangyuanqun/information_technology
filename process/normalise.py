import pandas as pd

def normalise_data(df: str, output_name: str, exclude_cols: list[str] = None, p: int = -1, q: int = 1):
    """
    type: proc

    Microservice to normalise columns of data in a dataframe between a specified range

    Parameters:
    - df (str): name of input dataframe to be read
    - output_name (str): name of output csv to be written
    - exclude_cols (list[str]): list of columns to exclude from normalisation
    - p (int): first value in range. Default is -1
    - q (int): last value in range. Default is 1

    Returns:
    - pd.DataFrame: a processed dataframe containing normalised data within the specified columns
    """

    df = pd.read_csv(f"{df}", index_col=0)
    
    if exclude_cols is None:
        exclude_cols = []

    normalised_df = df.copy()
    for column in df.columns:
        if column not in exclude_cols:
            min_val = df[column].min()
            max_val = df[column].max()
            normalised_df[column] = p + (df[column] - min_val) / (max_val - min_val) * (q - p)

    normalised_df.to_csv(f"{output_name}")

    return normalised_df


# norm_data = normalise_data(tickerDf, ['Date', 'Close'])
# print(norm_data)

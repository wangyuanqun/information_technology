import pandas as pd


def merge(df1: str, df2: str,  output_name: str, merge_cols: list = ['Date']):
    """
    type: proc

    Merges two datasets on a provided list of common columns.

    Parameters:
    - df1 (str): the pathname of the first csv file
    - df2 (str): the pathname of the second csv file
    - output_name (str): the name of the file to save the output data in csv format
    - merge_cols (list): the column names to merge on (must be present in both input files)
    """

    df1 = pd.read_csv(f"{df1}", index_col=0)
    df2 = pd.read_csv(f"{df2}", index_col=0)
    df = pd.merge(df1, df2, how='inner', on=merge_cols)
    df.to_csv(f"{output_name}")

    return df


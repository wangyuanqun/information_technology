import pandas as pd
import numpy as np
from sklearn.impute import KNNImputer

def drop_na(df: pd.DataFrame, how: str = 'any'):
    if 'any' == how:
        return df.dropna(how = 'any')
    else:
        return df.dropna(how = 'all')

def drop_and_fill(df: pd.DataFrame, column: str, method: str = 'mean'):
    df = df.dropna(how = 'all')
    
    if 'min' == method:
        return df.replace(np.nan, df[column].min())
    elif 'max' == method:
        return df.replace(np.nan, df[column].max())
    
    return df.replace(np.nan, df[column].mean())

def replace_na(df: pd.DataFrame, value = ''):
    return df.fillna(value)


def replace_mean(df: pd.DataFrame, column: str, method: str = 'mean'):
    if 'min' == method:
        return df.replace(np.nan, df[column].min())
    elif 'max' == method:
        return df.replace(np.nan, df[column].max())
    
    return df.replace(np.nan, df[column].mean())

def fill_missing_with_median(df, exclude_cols=[]):
    # Function to fill the missings in a dataset by using the 
    # median value of the column 
    for col in df.columns:
        if col not in exclude_cols:
            df[col].fillna(df[col].median(), inplace=True)
    return df

def fill_missing_with_mean(df, exclude_cols=[]):
    # Function to fill the missings in a dataset by using the 
    # mean value of the column
    for col in df.columns:
        if col not in exclude_cols:
            df[col].fillna(df[col].mean(), inplace=True)
    return df

def fill_missing_with_knn(df, n_neighbors=5, exclude_cols=[]):
    # Function to fill the missings in a dataset by using the 
    # k-nearest neighbours (kNN) algorithm
    
    imputer = KNNImputer(n_neighbors=n_neighbors)
    imputed_data = imputer.fit_transform(df.drop(columns=exclude_cols))
    df_imputed = pd.DataFrame(imputed_data, columns=df.drop(columns=exclude_cols).columns, index=df.index)

    for col in exclude_cols:
        df_imputed[col] = df[col]

    return df_imputed

def main_missing_imputation(df: str, output_name: str, method: str="median", exclude_cols: list[str]=[], n_neighbors: int=5):
    """
    type: proc

    Main function for missing value imputation.

    Parameters:
    - df (string): Name of input DataFrame with missing values.
    - output_name (str): Name of the output csv to be written
    - method (str): Method of imputation. Either "median", "mean" or "knn".
    - exclude_cols (list): List of columns to exclude from imputation.
    - n_neighbors (int): Number of neighbors to use for kNN imputation. Only relevant if method="knn".

    Returns:
    - pd.DataFrame: DataFrame with missing values imputed.
    """

    df = pd.read_csv(f"{df}", index_col=0)

    if method == "median":
        df = fill_missing_with_median(df, exclude_cols)
        df.to_csv(f"{output_name}")
        return df
    elif method == "knn":
        df = fill_missing_with_knn(df, n_neighbors, exclude_cols)
        df.to_csv(f"{output_name}")
        return df
    elif method == "mean":
        df = fill_missing_with_mean(df, exclude_cols)
        df.to_csv(f"{output_name}")
        return df
    else:
        raise ValueError("Invalid imputation method. Choose either 'median', 'knn', or 'mean'.")
        return None

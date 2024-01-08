import pandas as pd
from sklearn.preprocessing import LabelEncoder


def categorical_encoding(df: str, output_name: str, cat_columns:list[str]=[]):

    """
    type: proc

    Microservice to categorical encode columns

    Parameters:
    - df (str): name of input dataframe to be read
    - output_name (str): name of output csv to be written
    - cat_columns (list[str]): list of columns to perform categorical encoding

    Returns:
    - pd.DataFrame: a processed dataframe containing categorical columns added to the end
    """

    data = pd.read_csv(f"{df}", index_col=0)
    
    # Create a LabelEncoder object
    le = LabelEncoder()

    for i in cat_columns:

        # create a name for the new column
        new_name = i+'_label'

        # Fit and transform the categorical data
        data[new_name] = le.fit_transform(data[i])

    data.to_csv(f"{output_name}")

    return data

# categorical_encoding(input_df.csv, output_df.csv, cat_columns=['color'])
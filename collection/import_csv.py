import pandas as pd


def csv_importer(pathname: str, output_name: str):
    """
    type: in

    Imports a custom csv file.

    Parameters:
    - pathname (str): the pathname of the csv file to import
    - output_name (str): the path to save the resulting csv file
    """

    if pathname == "":
        raise FileNotFoundError("Filename can not be empty.")

    df = pd.read_csv(f"{pathname}",
        index_col=0,
        parse_dates=True,
        dayfirst=True,
        squeeze=True)
    df.to_csv(f"{output_name}")

    return df

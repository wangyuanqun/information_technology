import pandas as pd

def drop_duplicates(df: str, output_name: str, subset: list[str] = None, keep = 'first'):
    """
    type: proc

    modifies the input dataframe to remove any duplicate entries

    Parameters:
    - df (str): name of input dataframe to be read
    - output_name (str): name of the output csv to be written
    - subset (list[str]): list of columns as strings to remove duplicates from 
    - keep (str): determines which duplicates to keep (if any)

    Returns:
    - pd.DataFrame: processed dataframe without any duplicates
    """
    df = pd.read_csv(f"{df}", index_col=0)
    if isinstance(keep, bool) or keep in ('first', 'last'):
        # Valid 'keep' argument, proceed with dropping duplicates
        df = df.drop_duplicates(subset=subset, keep=keep)
        df.to_csv(f"{output_name}")
        return df
    else:
        # Invalid 'keep' argument, raise an error or handle it as needed
        raise ValueError("Invalid 'keep' argument. It should be False or one of ['first', 'last']")

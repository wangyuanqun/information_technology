import pandas as pd

def train_test_split(data: str, train_name: str, test_name: str, test_size: float=0.25):
    """
    Split the pandas DataFrame into train and test sets.

    :param data: string containing the name of the input dataframe
    :param train_name: string containing name of the output training csv to be written
    :param test_name: string containing name of the output test csv to be written
    :param test_size: fraction of the dataset to be included in the test split (default 0.25)
    :return: two DataFrames - training data and test data
    """

    data = pd.read_csv(f"{data}", index_col=0)
    
    if not 0 < test_size < 1:
        raise ValueError("test_size should be a float in the (0, 1) range")

    # Shuffle the DataFrame
    shuffled_data = data.sample(frac=1).reset_index(drop=False)
    
    # Determine the split index
    split_idx = int(len(data) * (1 - test_size))
    
    # Split the data
    train_data = shuffled_data.iloc[:split_idx]
    test_data = shuffled_data.iloc[split_idx:]

    train_data.set_index(['Date'], inplace=True, drop=True)
    test_data.set_index(['Date'], inplace=True, drop=True)

    train_data.to_csv(f"{train_name}")
    test_data.to_csv(f"{test_name}")

    return train_data, test_data
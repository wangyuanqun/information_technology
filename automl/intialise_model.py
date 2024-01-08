import pandas as pd
from tpot import TPOTRegressor
from sklearn.metrics import mean_squared_error


def initialise_model(train: str, test: str, output_name: str, target_column: str, profile: str):
    """
    Train a model using TPOT AutoML to predict stock closing prices.

    :param train: string containing the name of the csv to be used as training input
    :param test: string containing the name of the csv to be used as test input
    :output_name: name of output csv to be written
    :param target_column: name of the column with the closing prices
    :param profile: option from "demo", "speed", "balanced", or "accuracy" which effects model training 

    :return: trained TPOT model
    """

    train = pd.read_csv(f"{train}", index_col=0)
    test = pd.read_csv(f"{test}", index_col=0)
    
    # Ensure the target_column exists
    if target_column not in train.columns or target_column not in test.columns:
        raise ValueError(
            f"The dataset should contain a '{target_column}' column")

    # Split the data into features and target for both train and test sets
    X_train = train.drop(target_column, axis=1)
    y_train = train[target_column]

    X_test = test.drop(target_column, axis=1)
    y_test = test[target_column]

    # Set profile
    match profile:
        case 'demo':
            tpot_settings = [5, 25, 4, None]
        case 'speed':
            tpot_settings = [25, 50, 2, None]
        case 'accuracy':
            tpot_settings = [None, 100, 2, 180]
        case _:
            if profile != 'balanced':
                # print("Profile not recognised, using balanced profile")
                raise ValueError("Profile not recognised, using following profiles: demo, speed, balanced, accuracy")
            tpot_settings = [100, 100, 2, None]

    # Create and train the TPOT regressor
    tpot = TPOTRegressor(generations=tpot_settings[0], population_size=tpot_settings[1], 
        verbosity=tpot_settings[2], max_time_mins=tpot_settings[3], early_stop=100, n_jobs=-1)
    tpot.fit(X_train, y_train)
    # Print the testing score
    print(f"Test R^2 Score: {tpot.score(X_test, y_test):.5f}")

    # Predict using the test set
    y_pred = tpot.predict(X_test)

    # Calculate and print the RMSE
    rmse = mean_squared_error(y_test, y_pred, squared=False)
    print(f"Test RMSE: {rmse:.5f}")

    # Combine y_test and y_pred into a single DataFrame
    results_df = pd.DataFrame(
        {'Open Price': X_test['Open'], 'Close Actual': y_test, 'Close Predicted': y_pred})

    results_df = pd.DataFrame({'Date': X_test.index, 'Close Actual': y_test, 'Close Predicted': y_pred}).drop(['Date'], axis=1)
    
    results_df_final = results_df.sort_values('Date', ascending=True)
    
    results_df_final.to_csv(f"{output_name}")
    
    return tpot, results_df_final

# Example usage:
# model, results_df = auto_ml(df_train, df_test, 'Close')

# print(results_df)

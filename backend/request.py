import requests

"""
This file is used to test server locally with customized values.

"""

# uvicorn server:app --reload --port 8080

# print(requests.get("http://127.0.0.1:8080/").json())
data = [
    # {
    #     "ID": "n0",
    #     "module_function": "collection.yahoo.stock_price",
    #     "inputs": [],
    #     "params": ['AAPL', '2010-01-01', '2023-01-01', 'yahoo_test.csv']
    # },
    {
        "ID": "n0",
        "module_function": "automl.intialise_model.initialise_model",
        "inputs": [],
        "params": ['test_for_train.csv', 'yahoo_test.csv', 'asml', 'not ture', 'not sute']
    },
    # {
    #     "ID": "n1",
    #     "module_function": "process.handle_duplicates.drop_duplicates",
    #     "inputs": [],
    #     "params": ['train.csv', 'output.csv', None, 'no correct']
    # },
    # {
    #     "ID": "n1",
    #     "module_function": "automl.forecasting_ml.fit_arma",
    #     "inputs": ["n0"],
    #     "params": ['yahoo_test.csv', 'Close', 'fit.csv', 3, 4,10, '2022-12-23','2023-01-05']
    # },
    # {
    #     "ID": "n2",
    #     "module_function": "collection.yahoo.stock_price",
    #     "inputs": [],
    #     "params": ['AAPL', '2010-01-01', '2023-01-01', 'test1.csv']
    # },
    # {
    #     "ID": "n1",
    #     "module_function": "process.handle_missing.main_missing_imputation",
    #     "inputs": ["n0"],
    #     "params": ["knn", [], 5]
    # },
    # {
    #     "ID": "n2",
    #     "module_function": "process.split_dataset.train_test_split",
    #     "inputs": ["n1"],
    #     "params": [0.25]
    # },
    # {
    #     "ID": "n3",
    #     "module_function": "automl.intialise_model.initialise_model",
    #     "inputs": ["n2"],
    #     "params": ["Close", "demo"]
    # },
]
# print(requests.post("http://127.0.0.1:5005/pipeline", json=data,).json())
# print(requests.get("http://127.0.0.1:5005/get_generations?folder=folder2").json())
# print(requests.get("http://127.0.0.1:5005/file_information").json())
# print(requests.delete("http://127.0.0.1:5005/delete_csv").json())
# print(requests.delete("http://127.0.0.1:5005/delete_service").json())
# print(requests.post("http://127.0.0.1:5005/uploadMS").json())
# print(requests.post("http://127.0.0.1:5005/uploadfile?filename=test.csv").json())
print(requests.get("http://127.0.0.1:5005/all_services").json())
# print(requests.get("http://127.0.0.1:5005/csv_information").json())

# response = requests.get("http://127.0.0.1:5005/download_model?name=index.html")
# if response.status_code == 200:
#     # File is found and will be downloaded
#     print(response.content)
#     print(f"File downloaded successfully.")

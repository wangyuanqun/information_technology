# API Request and Response format
## General Response
Success
```
{
  "status": "success",
  "data": []
}
```
Fail
```
{
  "status": "fail",
  "msg": "Wrong file format"
}
```

# API Calls

# Files
## Upload Files (POST: /uploadfile)
* Header: Content-Type: multipart/form-data

Request (FormData)
```
file: {File}
```
Response
```
{
  "status": "success",
  "data": {
    "filename": "data.csv"
  }
}
```
Description: upload csv file

## Obtain all csv file information (GET: /csv_information)
Request

`nil`

Response
```
{
  "status": "success",
  "data": [
    {
      "filename": "data.csv",
      "size": "15410 bytes"
    },
    ...
  ]
}
```
Description: get all csv files and metadata from the server

## Remove all csv files (DELETE: /delete_csv)
Request

`nil`

Response
```
{
  "status": "success",
  "data": {}
}
```
Description: remove all csv files from the server

# Microservices
## Import Microservices (POST: /uploadMS)
* Header: Content-Type: multipart/form-data

Request
```
FormData: file: File
```
Response
```
{
  "status": "success",
  "data": {}
}
```
Description: The uploaded file will be decoded from base64 and saved in backend with `name`. Response data returns the *FULL SET* of the microservices (built-in + uploaded).

## Get all available microservices (GET: /all_services)

Request

`nil`

Response
```
{
  "status": "success",
  "data": {
    "in": [
      {
        "id": 1,
        "type": "in|proc|out",
        "fnname": "{MODULE_NAME}.{FUNCTION_NAME}",
        "display": ""
        "params": [
          {
            "pid": 1,
            "name": "{PARAM_NAME}",
            "displayname": "{DISPLAY_NAME}",
            "type": "str|list|int|float|bool"
          }
        ]
      },
      ...
    ]
  }  
}
```
Description: Obtain all microservices available in the backend

## Obtain all microservices file information (GET: /service_information)
Request

`nil`

Response
```
{
  "status": "success",
  "data": [
    {
      "filename": "services.py",
      "size": "15894 bytes"
    },
    ...
  ]
}
```
Description: get all service files and metadata from the server

## Remove all microservices files (DELETE: /delete_service)
Request

`nil`

Response
```
{
  "status": "success",
  "data": {}
}
```
Description: remove all services uploaded by user

# Pipeline
## Run Pipeline (POST: /pipeline)
Request
```
[ 
  {
    "ID": "n0",
    "fnname": "merge",
    "inputs": ["n2", "n1"],
    "params": ["Date"]
  },
  {
    "ID": "n1",
    "fnname": "collection.yahoo.stock_price",
    "inputs": [],
    "params": [
      "qan.ax",
      "2023-06-01",
      "2023-10-08"
    ]
  },
  {
    "ID": "n2",
    "fnname": "collection.csv.csv_importer",
    "inputs": []
  },
  {
    "ID": "n3"
    "fnname": "collection.yahoo.stock_price",
    "inputs": []
  },
  {
    "ID": "n4",
    "fnname": "merge",
    "inputs": ["n0", "n3"],
    "params": ["Date"]
  },
  {
    "ID": "n5",
    "fnname": "viz",
    "inputs": ["n4"]
  }
]
```
Response Success
```
{
  "status": "success",
  "data": "pipeline_folder"
}
```

Response Fail
```
{
  "status": "fail",
  "data": {
    "function_name": "xxx.py",
    "traceback": "{ERROR_MSG}"
  }
}
```
Description: Run pipeline designed by the user based on microservices available in the backend

## Obtain files generated in the pipeline (GET: /get_generations)
Request

`nil`

Response
```
{
  "status": "success",
  "data": [
    "file1.img",
    "graph2.html",
    "prediction.jpg"
  ]
}
```
Description: Obtain files generated in the pipeline

## Obtain HTML file generated in the pipeline (GET: /show_html)
Request

```
- name
- folder
```

Response

`HTML raw binary`

Description: Obtain html file for displaying UI

## Obtain file generated in the pipeline (GET: /download_file)
Request

```
- name
- folder
```

Response

`File raw binary`

Description: Obtain file binary for download


# Microservice function format
TODO
```python

```

# Run Frontend
In `frontend` root folder, run
```sh
npm install
```
All the dependencies will be installed and you can run the following command to start the frontend
```sh
./run
```
Frontend is listening port 5005 for backend connection by default

# Run Backend
In `backend` root folder, run the following command to start the backend server
```sh
./run {PORT}
```
* Frontend is monitoring port 5005 for backend connection

To install all backend and microservices modules, run
```sh
pip install -r requirements.txt
```

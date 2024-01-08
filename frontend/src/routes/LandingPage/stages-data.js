// Supported type:
// Text: textbox
// Number: numberbox
// Boolean: checkbox
// Date: date picker

// stages information (From microservices)
export const stagesInfo = {
    input: [ // info of node
        {
            id: 1,
            type: 'input',
            name: 'Yahoo Finance',
            func: "collection.yahoo.stock_price",
            parameters: [
                {
                    pid: 1,
                    title: "ticker",
                    type: "Text",
                    // default: ""
                },
                {                    
                    pid: 2,
                    title: "start_date",
                    type: "Text",
                    // default: ""
                },
                {
                    pid: 3,
                    title: "end_date",
                    type: "Text",
                    // default: ""
                },
                {
                    pid: 4,
                    title: "output_file_name",
                    type: "Text",
                    // default: ""
                }
            ]
        },
        {
            id: 2,
            type: 'input',
            name: 'CSV',
            func: "collection.csv.csv_importer",
            parameters: [
                {
                    pid: 1,
                    title: "input_file_name",
                    type: "Text",
                    // default: ""
                },
                {
                    pid: 2,
                    title: "output_file_name",
                    type: "Text",
                    // default: ""
                }
            ]
        }
    ],
    process: [
        {
            id: 3,
            type: 'process',
            name: 'Missing data',
            func: "process.handle_missing.main_missing_imputation",
            parameters: [
                {
                    pid: 1,
                    title: "input_file_name",
                    type: "Text",
                    // default: ""
                },
                {
                    pid: 2,
                    title: "method",
                    type: "Text",
                    // default: ""
                },
                {
                    pid: 3,
                    title: "exclude_cols",
                    type: "Text",
                    default: true
                },
                {
                    pid: 4,
                    title: "n_neighbors",
                    type: "Number",
                    default: true
                },
                {
                    pid: 5,
                    title: "output_file_name",
                    type: "Text",
                    // default: ""
                }
            ]
        },
        {
            id: 4,
            type: 'process',
            name: 'Duplicate values',
            func: "process.handle_duplicates.drop_duplicates",
            parameters: [
                {
                    pid: 1,
                    title: "input_file_name",
                    type: "Text",
                    // default: ""
                },
                {
                    pid: 2,
                    title: "subset",
                    type: "Text"
                },
                {
                    pid: 3,
                    title: "keep",
                    type: "Text"
                },
                {
                    pid: 4,
                    title: "output_file_name",
                    type: "Text",
                    // default: ""
                }
            ]
        },
        {
            id: 5,
            type: 'process',
            name: 'Train test split',
            func: "process.split_dataset.split_dataset",
            parameters: [
                {
                    pid: 1,
                    title: "input_file_name",
                    type: "Text",
                    // default: ""
                },
                {
                    pid: 2,
                    title: "test_size",
                    type: "Text"
                },
                {
                    pid: 3,
                    title: "train_data_file_name",
                    type: "Text"
                },
                {
                    pid: 4,
                    title: "test_data_file_name",
                    type: "Text",
                    // default: ""
                }
            ]
        },
        {
            id: 6,
            type: 'process',
            name: 'AutoML',
            func: "automl.intialise_model.initialise_model",
            parameters: [
                {
                    pid: 1,
                    title: "train_data_file_name",
                    type: "Text"
                },
                {
                    pid: 2,
                    title: "test_data_file_name",
                    type: "Text",
                    // default: ""
                },
                {
                    pid: 3,
                    title: "output_column",
                    type: "Text"
                },
                {
                    pid: 4,
                    title: "profile",
                    type: "Text",
                    // default: ""
                },
                {
                    pid: 5,
                    title: "output_file_name",
                    type: "Text",
                    // default: ""
                },

            ]
        }
    ],
    output: [
        {
            id: 7,
            type: 'output',
            name: "Table",
            func: "output_table",
            parameters: [
                {
                    pid: 1,
                    title: "input_file_name",
                    type: "Text"
                }
            ]
        },
        {
            id: 8,
            type: 'output',
            name: "Chart",
            func: "output_chart",
            parameters: [
                {
                    pid: 1,
                    title: "input_file_name",
                    type: "Text"
                }
            ]
        },
        {
            id: 9,
            type: 'output',
            name: "Raw data",
            func: "output_raw_data",
            parameters: [
                {
                    pid: 1,
                    title: "input_file_name",
                    type: "Text"
                }
            ]
        }
    ]
};

// Pipeline data
export const stagesData = [ // data of stage
    // {
    //     nodeid: 1,
    //     serviceid: -1,
    //     type: "input",
    //     params: {}
    // }
];

// pipeline raw data (JSON) -> generated from pipieline data + react flow edges

export const pipelineJSON = {
    "import_marketdata_yahoo_csv": {
        "ticker": "msft",
        "start_date": "2022-04-01",
        "end_date": "2023-03-31",
        "output_file_name": "yfinance_ohlc.csv"
    },

    "calculate_moving_average": {
        "window": 20,
        "column": "Close",
        "input_file_name": "yfinance_ohlc.csv",
        "output_file_name": "yfinance_ohlc_ma2.csv"
    }
};
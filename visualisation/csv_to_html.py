import pandas as pd
import plotly.graph_objects as go
import plotly.offline as offline

config = dict({
    'scrollZoom': False,
    'displayModeBar': True,
    'editable': False
})

def with_css_style(fig):
    plot_div = offline.plot(fig, config=config,output_type = 'div')

    template = """
    <head>
    <body style="background-color:#F9F9F9;">
    </head>
    <body>
    {plot_div:s}
    </body>""".format(plot_div = plot_div)

    return template

def csv_to_html(input_file: str, output_name: str):

    """
    type: out

    Microservice to convert a csv file to the required html format for visualisation. 

    Parameters:
    - df (str): name of input dataframe to be read
    - output_name (str): name of output csv to be written

    Returns:
    - pd.DataFrame: a processed dataframe containing output data as a html file
    """
    
    # read the csv file
    df = pd.read_csv(f"{input_file}")

    # Convert the dataframe to HTML
    fig = go.Figure(data=[go.Table(
        header=dict(values=list(df.columns),
                    fill_color='#7ab8ff',
                    align='left'),
        cells=dict(values=df.transpose().values.tolist(),
                fill_color='lavender',
                align='left'))
    ])

    fig.update_layout(
        paper_bgcolor='#F9F9F9'
    )

    # Write the HTML data to a file
    # fig.write_html(f"{output_name}")
    output_file = f"{output_name}"
    new_fig = with_css_style(fig)
    with open(output_file, 'w') as fp:
        fp.write(new_fig)

    return None

# csv_to_html('employees.csv', 'employees.html')
import pandas as pd
import plotly.graph_objects as go
import plotly.express as px
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

def forecasting_visual(df: str, df_forecast: str, output_filename: str):

    """
    type: out

    Microservice to create the html visualisation file for the forecasting mode.  

    Parameters:
    - df (str): name of input dataframe to be read
    - df_forecast (str): name of input forecast dataframe to be read
    - output_filename (str): name of output csv to be written

    Returns:
    - pd.DataFrame: a processed html file with the required visualisation data
    """

    df = pd.read_csv(f"{df}", index_col=0)

    # df = df.to_frame()

    df_forecast = pd.read_csv(f"{df_forecast}", index_col=0)
    forecast_data = [item for sublist in df_forecast.values for item in sublist]

    # Extract the column names 
    column_names = df.columns.tolist()
    actual_data = [item for item in df["Open"]]

    # Plot the values 
    fig = go.Figure(
    data=[
        go.Scatter(x=df.index, y=actual_data, name=str(column_names[0])+' Value Over Time'),
        go.Scatter(x=df_forecast.index, y=forecast_data, name="Forecasted Values")
    ])

    # Configure the legend appropriately
    fig.update_layout(legend=dict(
        yanchor="top",
        y=0.99,
        xanchor="left",
        x=0.01,
        orientation="v",
        title=dict(text='Legend for '+str(column_names[0])+' values'),
        traceorder='normal',
        font=dict(
            family="sans-serif",
            size=12,
            color="black"
        ),
        itemsizing='constant'
    ))

    fig.update_layout(
        paper_bgcolor='#F9F9F9'
    )

    # Write the html data into the given output file name
    # fig.write_html(f"{output_filename}")
    output_file = f"{output_filename}"
    new_fig = with_css_style(fig)
    with open(output_file, 'w') as fp:
        fp.write(new_fig)

    # fig.show()

    return None


# forecasting_visual(train_data, rese, 'output.html')
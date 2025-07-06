# _____________________________
#  To Run:
#  cd ploty-dash-frontend
#  python app.py
# _____________________________



import dash
from dash import html, dcc, Input, Output
import pandas as pd
import os

DATA_DIR = 'data'

def load_csv(filename):
    return pd.read_csv(os.path.join(DATA_DIR, filename))

active_players = load_csv('active_players.csv')
nba_teams = load_csv('nba_teams.csv')
career_stats = load_csv('career_stats.csv')
boxscores_current = load_csv('boxscores_2024_25.csv') 

app = dash.Dash(__name__)
app.title = "NBA Fantasy Draft IDSS"

app.layout = html.Div([
    html.H1("🏀 NBA Fantasy Draft IDSS", style={'textAlign': 'center'}),

    html.Div([
        html.Label("Filter by Position"),
        dcc.Dropdown(
            id='position-filter',
            options=[{'label': pos, 'value': pos} for pos in active_players['POSITION'].dropna().unique()],
            multi=True
        ),

        html.Label("Search Player"),
        dcc.Input(id='search-player', type='text', placeholder='Enter player name'),
    ], style={'width': '60%', 'margin': 'auto', 'padding': '20px'}),

    dcc.Graph(id='player-points-bar'),

    html.Div(id='player-table')
])

@app.callback(
    Output('player-points-bar', 'figure'),
    Input('position-filter', 'value'),
    Input('search-player', 'value')
)
def update_bar_chart(positions, search):
    df = boxscores_current.copy()

    merged = pd.merge(df, active_players, left_on='Player', right_on='DISPLAY_FIRST_LAST', how='inner')

    if positions:
        merged = merged[merged['POSITION'].isin(positions)]
    if search:
        merged = merged[merged['Player'].str.contains(search, case=False)]

    top = merged.groupby('Player')['Points'].mean().nlargest(10).reset_index()

    fig = {
        'data': [{
            'x': top['Player'],
            'y': top['Points'],
            'type': 'bar',
            'name': 'Avg Points'
        }],
        'layout': {
            'title': 'Top 10 Players by Average Points (Filtered)',
            'xaxis': {'title': 'Player'},
            'yaxis': {'title': 'Average Points'}
        }
    }
    return fig

if __name__ == '__main__':
    app.run(debug=True)


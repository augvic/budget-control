import sys
import os

if getattr(sys, 'frozen', False):
    db_path = os.path.abspath(os.path.join(os.path.dirname(sys.executable), "proposals", "proposals.sqlite3"))
else:
    db_path = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', "proposals.sqlite3"))

import sqlite3
import pandas as pd

class Sqlite3ToSheet:

    def convert(self, output_path) -> None:
        connection = sqlite3.connect(db_path)
        df = pd.read_sql_query("SELECT * FROM proposals_proposals", connection)
        df["valor_unitario"] = df["valor_unitario"].astype(float).apply(lambda x: f"R$ {x:,.2f}".replace(",", "X").replace(".", ",").replace("X", "."))
        df["valor_total"] = df["valor_total"].astype(float).apply(lambda x: f"R$ {x:,.2f}".replace(",", "X").replace(".", ",").replace("X", "."))
        df["verba_concedida"] = df["verba_concedida"].astype(float).apply(lambda x: f"R$ {x:,.2f}".replace(",", "X").replace(".", ",").replace("X", "."))
        output_path = fr"{output_path}\propostas.xlsx"
        df.to_excel(output_path, index=False)
        connection.close()
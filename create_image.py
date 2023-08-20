import sqlite3
from datetime import datetime, timedelta
import os
import matplotlib.pyplot as plt

def get_weekly_submissions():
    # 直近7日間の日付を取得
    dates = [(datetime.now() - timedelta(days=i)).date() for i in range(7)]
    
    # 各日付に対応する提出数を取得
    submissions_count = {date: 0 for date in dates}

    conn = sqlite3.connect('base.db')
    cursor = conn.cursor()

    for date in dates:
        count = cursor.execute("SELECT COUNT(*) FROM titles WHERE last_solve_date = ?", (date,)).fetchone()[0]
        submissions_count[date] = count

    conn.close()
    return submissions_count

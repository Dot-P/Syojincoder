import math
from datetime import datetime
import sqlite3

def score():
    scores = []  # スコアとタイトルを保存するためのリスト

    # データベースに接続
    conn = sqlite3.connect('base.db')
    conn.row_factory = sqlite3.Row  # カラム名でアクセスするための設定
    cursor = conn.cursor()

    # base_tableからすべての行を取得
    cursor.execute("SELECT * FROM base_table")
    rows = cursor.fetchall()

    for row in rows:
        Q = row['qnum']
        
        # base_tableからclassifierを取得
        classifier = row['classifier']
        
        # questionsテーブルからfavorite_questionの値を取得
        cursor.execute("SELECT favorite_question FROM questions WHERE classifier = ?", (classifier,))
        favorite_question = cursor.fetchone()[0]
        
        # favorite_questionの値に基づいてFを設定
        F = 1 if favorite_question==1 else 0

        # questionsテーブルからNot_goodの値を取得
        cursor.execute("SELECT Not_good FROM questions WHERE classifier = ?", (classifier,))
        not_good = cursor.fetchone()[0]
        N = 1.5 if not_good == 1 else 1

        # titlesテーブルからAttemptsとWAの値を取得
        cursor.execute("SELECT Attempts, WA, last_solve_date FROM titles WHERE title = ?", (row['title'],))
        title_row = cursor.fetchone()
        A = title_row['Attempts']
        W = 2 if title_row['WA'] != 0 else 1

        # last_solve_dateと今日の日付の差分を計算
        last_solve_date = datetime.strptime(title_row['last_solve_date'], "%Y-%m-%d")
        today_date = datetime.today()
        days_difference = (today_date - last_solve_date).days

        # scoreの計算
        score = 10 * math.log(Q) * F * N * (1.5 - math.exp(-2 * (days_difference - 1) * (W - 1) / (4 ** A))) / (W * math.log(A+2)) 

        # scoreを更新
        cursor.execute("UPDATE base_table SET score = ? WHERE title = ?", (score, row['title']))

        # スコアとタイトルをリストに追加
        scores.append({'title': row['title'], 'score': score})

    conn.commit()  # 変更をコミット
    conn.close()  # 接続を閉じる

    # スコアが大きい順にソート
    scores_sorted = sorted(scores, key=lambda x: x['score'], reverse=True)

    # 上位3つのスコアを取り出す
    top_scores = scores_sorted[:3]

    return {'top_scores': top_scores}



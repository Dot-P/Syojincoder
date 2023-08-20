from flask import Flask, request, send_from_directory, jsonify
import sqlite3
from datetime import datetime
from update_score import score
import matplotlib.pyplot as plt
import os
from create_image import get_weekly_submissions

app = Flask(__name__)

@app.route('/login', methods=['POST'])
def login():
    data = request.json
    username = data['username']
    password = data['password']

    connection = sqlite3.connect('users.db')
    cursor = connection.cursor()

    # ユーザー名とパスワードを照合
    cursor.execute("SELECT * FROM users WHERE username = ? AND password = ?", (username, password))
    user = cursor.fetchone()

    connection.close()

    if user:
        return jsonify(success=True)
    else:
        return jsonify(success=False)


@app.route('/images/<filename>')
def serve_image(filename):
    image_cr()
    return send_from_directory(app.static_folder, filename)

def image_cr():
    submissions_count = get_weekly_submissions()
    dates = list(submissions_count.keys())
    counts = list(submissions_count.values())
    
    plt.plot(dates, counts, marker='o')
    
    # 副線の描画
    plt.grid(True, linestyle='--', linewidth=0.5)

    # 各データポイントに値のラベルを追加
    for i, count in enumerate(counts):
        plt.text(dates[i], counts[i], str(count), fontsize=15, ha='center', va='bottom')

    plt.xlabel('Date')
    plt.ylabel('Number of Submissions')
    plt.title('Submissions in the Last Week')
    plt.xticks(rotation=45)
    plt.tight_layout()
    
    # 画像をstaticフォルダ内に保存
    plt.savefig(os.path.join(app.static_folder, 'plot.png'))


@app.route('/home')
def members():
    top_scores_data = score()['top_scores']
    top_titles = [item['title'] for item in top_scores_data]

    conn = sqlite3.connect('base.db')
    conn.row_factory = sqlite3.Row
    cursor = conn.cursor()

    top_three_data = []

    for title in top_titles:
        # base_tableからdifficulty, title, urlを取得
        cursor.execute("SELECT difficulties, title, url FROM base_table WHERE title = ?", (title,))
        base_row = cursor.fetchone()

        # titlesテーブルからAttemptsを取得
        cursor.execute("SELECT SUM(Attempts) AS total_attempts FROM titles WHERE title = ?", (title,))
        titles_row = cursor.fetchone()

        # 結果をオブジェクトにまとめる
        result = {
            'difficulty': base_row['difficulties'],
            'title': base_row['title'],
            'url': base_row['url'],
            'total_attempts': titles_row['total_attempts']
        }
        top_three_data.append(result)

    conn.close()

    return {'top_three': top_three_data}


@app.route('/submit', methods=['POST'])
def submit():
    data = request.json
    qnum = data['title']
    ac = data['selectedButton']
    diff = data['selectedOption']
    if diff is None or qnum == '':
        return {'message': '問題の番号、難易度が未記入です。'}
    problem = diff + qnum
    if ac is None:
        return {'message': '正誤を選択してください。'}

    # データベースに接続
    conn = sqlite3.connect('base.db')
    conn.row_factory = sqlite3.Row  # カラム名でアクセスするための設定
    cursor = conn.cursor()
    # problemと一致する行を検索
    cursor.execute("SELECT * FROM titles WHERE title = ?", (problem,))
    row = cursor.fetchone()
    if row:
        # 一致した行が見つかった場合、更新処理を行う
        if ac != 'AC':
            wa_count = row['WA'] + 1  # WAカラムに1を加える
        else:
            wa_count = row['WA']
        last_solve_date = datetime.now().strftime("%Y-%m-%d")  # 現在の日付を取得
        attempts = row['Attempts'] + 1  # Attempsカラムに1を加える
        # 更新クエリを実行
        cursor.execute("""
            UPDATE titles 
            SET WA = ?, last_solve_date = ?, Attempts = ? 
            WHERE title = ?
        """, (wa_count, last_solve_date, attempts, problem))
        conn.commit()  # 変更をコミット
    conn.close()  # 接続を閉じる


    # データベースに再接続
    conn = sqlite3.connect('base.db')
    cursor = conn.cursor()

    # 各classifierに対応するWAの合計値を取得
    wa_counts_by_classifier = {}
    for i in range(1, 16):  # classifierは1から15まで
        cursor.execute("SELECT SUM(WA) as total_wa FROM titles WHERE classifier = ?", (i,))
        total_wa = cursor.fetchone()[0]
        wa_counts_by_classifier[i] = total_wa if total_wa else 0  # 合計値がNoneの場合は0とする

    # WAの合計値が多いもの3つのclassifierを取得
    top_3_classifiers = sorted(wa_counts_by_classifier, key=wa_counts_by_classifier.get, reverse=True)[:3]

    # questionsテーブルのNot_goodを更新
    for classifier in range(1, 16):
        not_good_value = 1 if classifier in top_3_classifiers else 0
        cursor.execute("UPDATE questions SET Not_good = ? WHERE classifier = ?", (not_good_value, classifier))

    conn.commit()  # 変更をコミット
    conn.close()  # 接続を閉じる

    score() # スコアの更新をする

    return {'message': 'success'}

@app.route('/process-data', methods=['POST'])
def process_data():
    data = request.json
    checked = data.get('checked') # checked オブジェクトを取得
    checked_list = []
    for i in range(1, 16): # 1 から 15 までのループ
        key = 'checked' + str(i) # キーを動的に作成
        value = checked.get(key) # 対応する値を取得
        checked_list.append(value)
    toggleOptions = data.get('toggleOptions') # toggleOptions オブジェクトを取得
    option1 = toggleOptions.get('option1') # toggleOptions オブジェクトから option1 の値を取得
    option2 = toggleOptions.get('option2') # toggleOptions オブジェクトから option2 の値を取得
    print("Option1:", option1)
    print("Option2:", option2)
    conn = sqlite3.connect('base.db')
    cursor = conn.cursor()
    for index, value in enumerate(checked_list):
        cursor.execute("UPDATE questions SET favorite_question = ? WHERE rowid = ?", (value, index + 1))
    conn.commit()
    conn.close()
    score()
    return {"message": 'Success'} 


@app.route('/get_questions')
def get_questions():
    connection = sqlite3.connect("base.db")
    cursor = connection.cursor()
    cursor.execute("SELECT Classifier FROM questions WHERE Not_good = 1 LIMIT 3")
    classifiers = cursor.fetchall()
    connection.close()

    # Classifierの値に基づいて特定の文字列を取得
    classifier_mapping = {
        1: "全探索",
        2: "累積和及びimos法",
        3: "二分探索",
        4: "座標圧縮及びランレングス圧縮",
        5: "動的計画法",
        6: "しゃくとり法",
        7: "BFS",
        8: "Union-Find",
        9: "ワーシャルフロイド法",
        10: "ユークリッドの互除法",
        11: "エラトステネスの篩及び整数問題",
        12: "セグ木",
        13: "論理演算",
        14: "包除原理",
        15: "DFS",
    }

    questions_list = [classifier_mapping.get(classifier[0], "未定義") for classifier in classifiers]

    return jsonify(questions_list)



if __name__ == "__main__":
    app.run(debug=True)

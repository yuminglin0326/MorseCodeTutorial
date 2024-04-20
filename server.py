from flask import Flask
from flask import render_template
from flask import Response, request, jsonify
app = Flask(__name__)

learns = {
    "1": {
        "id": 1,
        "letter": "a",
        "morse_code": ".-",
        "plain_image": "/static/image/a-plain.png",
        "morse_image": "/static/image/a-morse.png",
        "morse_audio": "/static/audio/morse_code_a.mp3",
        "position": [[-9, 60], [110, 32]], # [top, left],
        "dash": "/static/image/dash_hor.png",
        "flash_interval": [300, 350, 1000] # [on for 300ms, off for 50ms, on for 650ms]
    },
    "2": {
        "id": 2,
        "letter": "e",
        "morse_code": ".",
        "plain_image": "/static/image/e-plain.png",
        "morse_image": "/static/image/e-morse.png",
        "morse_audio": "/static/audio/morse_code_e.mp3",
        "position": [[75, -10]], # [top, left],
        "dash": "/static/image/dash_hor.png",
        "flash_interval": [300]
    },
}

quizzes = {
    "1": {
        "id": 1,
        "name": "Quiz 1",
        "question": "Please enter the Morse Code for 'I'",
        "answer_morse": "..",
        "answer_letter": "i",
        "hint": "/static/image/i-hint.png",
        "answer_img": "/static/image/i-answer.png",
        "type": "english_to_morse"
    },
    "2": {
        "id": 2,
        "name": "Quiz 2",
        "question": "Please enter the Morse Code for 'A'",
        "answer_morse": ".-",
        "answer_letter": "a",
        "hint": "/static/image/a-hint.png",
        "answer_img": "/static/image/a-answer.png",
        "type": "english_to_morse"
    }
}

quiz_score = 0

@app.route('/')
def home():
    return render_template('home.html')

@app.route('/get-started-dot')
def get_started_dot():
    return render_template('get_started_dot.html')

@app.route('/get-started-dash')
def get_started_dash():
    return render_template('get_started_dash.html')

@app.route('/morse-code')
def morse_code():
    return render_template('morse_code.html')


@app.route('/learn/<learn_id>')
def learn(learn_id):
    learn_data = learns[learn_id]

    return render_template('learn.html', learn=learn_data)

@app.route('/learn_try/<learn_id>')
def learn_try(learn_id):
    learn_data = learns[learn_id]
    total_learns = len(learns)

    return render_template('learn_try.html', learn=learn_data, total_learns=total_learns)

@app.route('/finish_learn')
def finish_learn():
    all_learns = learns
    return render_template('finish_learn.html', learns=all_learns)

@app.route('/quiz/<quiz_id>')
def quiz(quiz_id):
    quiz = quizzes[quiz_id]
    total_quizzes = len(quizzes)

    return render_template('quiz.html', quiz=quiz, total_quizzes=total_quizzes)

@app.route('/quiz_answer/<quiz_id>')
def quiz_answer(quiz_id):
    quiz = quizzes[quiz_id]
    total_quizzes = len(quizzes)

    return render_template('quiz_answer.html', quiz=quiz, total_quizzes=total_quizzes)

@app.route('/quiz/score')
def score():

    quiz_data = {
        "score": quiz_score,
        "total_questions": len(quizzes),
    }

    return render_template('quiz_score.html', quiz=quiz_data)

@app.route('/answered_quiz', methods=['GET', 'POST'])
def answered_quiz():
    global quiz_score

    json_data = request.get_json()

    is_correct = json_data["is_correct"]
    print(is_correct)
    if is_correct:
        quiz_score += 1
    
    print(quiz_score)

    return jsonify({"score": quiz_score})


if __name__ == '__main__':
    app.run(debug = True)
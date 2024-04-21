from flask import Flask
from flask import render_template
from flask import Response, request, jsonify
app = Flask(__name__)

learns = {
    # unused data for letter "A"
    # "1": {
    #     "id": 1,
    #     "letter": "a",
    #     "morse_code": ".-",
    #     "plain_image": "/static/image/a-plain.png",
    #     "morse_image": "/static/image/a-morse.png",
    #     "morse_audio": "/static/audio/morse_code_a.mp3",
    #     "position": [[-9, 60], [110, 32]], # [top, left],
    #     "dash": "/static/image/dash_hor.png",
    #     "flash_interval": [300, 350, 1000] # [on for 300ms, off for 50ms, on for 650ms]
    # },
    "1": {
        "id": 1,
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
        "type": "eng_to_morse",
        "question": "Please enter the Morse Code for 'E'",
        "answer_morse": ".",
        "answer_letter": "i",
        "hint": "/static/image/e-hint.png",
        "answer_img": "/static/image/e-answer.png",
        "scored": False,
    },
    "2": {
        "id": 2,
        "type": "eng_to_morse",
        "question": "Please enter the Morse Code for 'L'",
        "answer_morse": ".-..",
        "answer_letter": "a",
        "hint": "/static/image/l-hint.png",
        "answer_img": "/static/image/l-answer.png",
        "scored": False,
    },
    "3": {
        "id": 3,
        "type": "eng_to_morse",
        "question": "Please enter the Morse Code for 'O'",
        "answer_morse": "---",
        "answer_letter": "o",
        "hint": "/static/image/o-hint.png",
        "answer_img": "/static/image/o-answer.png",
        "scored": False,
    },
    "4": {
        "id": 4,
        "type": "flashlight_to_eng",
        "question": "Watch the flashlight and enter the corresponding English letter",
        "answer_morse": "--",
        "answer_letter": "m",
        "flash_interval": [650, 750, 1400], # [on for 650ms, off for 100ms, on for 650ms]
        "hint": "--",
        "answer_img": "/static/image/m-answer.png",
        "scored": False,
    },
    "5": {
        "id": 5,
        "type": "flashlight_to_eng",
        "question": "Watch the flashlight and enter the corresponding English letter",
        "answer_morse": ".-.",
        "answer_letter": "r",
        "flash_interval": [300, 400, 1050, 1150, 1450], # [on for 300ms, off for 100ms, on for 650ms, off for 100ms, on for 300ms]
        "hint": ".-.",
        "answer_img": "/static/image/r-answer.png",
        "scored": False,
    },
    "6": {
        "id": 6,
        "type": "flashlight_to_eng",
        "question": "Watch the flashlight and enter the corresponding English letter",
        "answer_morse": "... --- ...",
        "answer_letter": "sos",
        "flash_interval": [300, 400, 700, 800, 1100, 1400, 2050, 2150, 2800, 2900, 3550, 3850, 4150, 4250, 4550, 4650, 4950],
        "hint": "... --- ...",
        "answer_img": "/static/image/r-answer.png",
        "scored": False,
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


@app.route('/quiz')
def quiz_home():
    for quiz in quizzes.values():
        quiz["scored"] = False

    global quiz_score
    quiz_score = 0

    return render_template('quiz_home.html')

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

    quiz_id = str(json_data["id"])
    if (quizzes[quiz_id]["scored"] == True):
        return jsonify({"score": quiz_score})
    
    is_correct = json_data["is_correct"]
    print(is_correct)
    if is_correct:
        quiz_score += 1
    
    quizzes[quiz_id]["scored"] = True

    print(quiz_score)

    return jsonify({"score": quiz_score})


if __name__ == '__main__':
    app.run(debug = True)
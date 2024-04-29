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
    "2": {
        "id": 2,
        "letter": "h",
        "morse_code": "....",
        "plain_image": "/static/image/h-plain.png",
        "morse_image": "/static/image/h-morse.png",
        "morse_audio": "/static/audio/morse_code_H.mp3",
        "position": [[0, -11], [0, 108], [155, -11], [155, 108]], # [top, left],
        "dash": "/static/image/dash_hor.png",
        "flash_interval": [100, 150, 250, 300, 400, 450, 550, 650]
    },
    "3": {
        "id": 3,
        "letter": "l",
        "morse_code": ".-..",
        "plain_image": "/static/image/l-plain.png",
        "morse_image": "/static/image/l-morse.png",
        "morse_audio": "/static/audio/l-audio.mp3",
        "position": [[0, -11], [35, -43], [166, 20], [166, 70]], # [top, left],
        "dash": "/static/image/dash_ver.png",
        "flash_interval": [100, 150, 450, 500, 600, 650, 750]
    },
    "4": {
        "id": 4,
        "letter": "m",
        "morse_code": "--",
        "plain_image": "/static/image/m-plain.png",
        "morse_image": "/static/image/m-morse.png",
        "morse_audio": "/static/audio/m-audio.mp3",
        "position": [[20, -43], [20, 108]], # [top, left],
        "dash": "/static/image/dash_ver.png",
        "flash_interval": [300, 350, 650]
    },
    "5": {
        "id": 5,
        "letter": "o",
        "morse_code": "---",
        "plain_image": "/static/image/o-plain.png",
        "morse_image": "/static/image/o-morse.png",
        "morse_audio": "/static/audio/o-audio.mp3",
        "position": [[-3, -8], [-3, -8], [-3, -8]], # [top, left],
        "dash": ["/static/image/o-dash-1.png", "/static/image/o-dash-2.png", "/static/image/o-dash-3.png"],
        "flash_interval": [300, 350, 650, 700, 1000]
    },
    "6": {
        "id": 6,
        "letter": "r",
        "morse_code": ".-.",
        "plain_image": "/static/image/r-plain.png",
        "morse_image": "/static/image/r-morse.png",
        "morse_audio": "/static/audio/r-audio.mp3",
        "position": [[150, -12], [82, -7], [150, 106]], # [top, left],
        "dash": "/static/image/dash_hor.png",
        "flash_interval": [100, 150, 450, 500, 600]
    },
    "7": {
        "id": 7,
        "letter": "s",
        "morse_code": "...",
        "plain_image": "/static/image/s-plain.png",
        "morse_image": "/static/image/s-morse.png",
        "morse_audio": "/static/audio/morse_code_S.mp3",
        "position": [[-9, 50], [75, 50], [166, 50]], # [top, left],
        "dash": "/static/image/dash_hor.png",
        "flash_interval": [100, 150, 250, 300, 400, 450]
    }
}

quizzes = {
    "1": {
        "id": 1,
        "type": "eng_to_morse",
        "question": "Please enter the Morse Code for 'E'",
        "answer_morse": ".",
        "answer_letter": "i",
        "hint": "/static/image/e-hint.png",
        "answer_img": ["/static/image/e-answer.png"],
        "scored": False,
        "answered_correctly": 0,
    },
    "2": {
        "id": 2,
        "type": "eng_to_morse",
        "question": "Please enter the Morse Code for 'L'",
        "answer_morse": ".-..",
        "answer_letter": "l",
        "hint": "/static/image/l-hint.png",
        "answer_img": ["/static/image/l-answer.png"],
        "scored": False,
        "answered_correctly": 0,
    },
    "3": {
        "id": 3,
        "type": "eng_to_morse",
        "question": "Please enter the Morse Code for 'O'",
        "answer_morse": "---",
        "answer_letter": "o",
        "hint": "/static/image/o-hint.png",
        "answer_img": ["/static/image/o-answer.png"],
        "scored": False,
        "answered_correctly": 0,
    },
    "4": {
        "id": 4,
        "type": "eng_to_morse",
        "question": "Please enter the morse code for 'Hello'",
        "answer_morse": ".... . .-.. .-.. ---",
        "answer_letter": "Hello",
        "flash_interval": [300, 400, 700, 800, 1100, 1200, 1500, 1800, 2100, 2400, 2700, 2800, 3450, 3550, 3850, 3950, 4250, 4550, 4850, 4950, 5600, 5700, 6000, 6100, 6400, 6700, 7350, 7450, 8100, 8200, 8850],
        "hint": ["/static/image/h-hint.png", "/static/image/e-hint.png", "/static/image/l-hint.png", "/static/image/l-hint.png", "/static/image/o-hint.png"],
        "answer_img": ["/static/image/h-answer.png", "/static/image/e-answer.png", "/static/image/l-answer.png", "/static/image/l-answer.png", "/static/image/o-answer.png"],
        "scored": False,
        "answered_correctly": 0,
    },
    "5": {
        "id": 5,
        "type": "flashlight_to_eng",
        "question": "Watch the flashlight and enter the corresponding English letter",
        "answer_morse": "--",
        "answer_letter": "m",
        "flash_interval": [650, 750, 1400], # [on for 650ms, off for 100ms, on for 650ms]
        "hint": "--",
        "answer_img": ["/static/image/m-answer.png"],
        "scored": False,
        "answered_correctly": 0,
    },
    "6": {
        "id": 6,
        "type": "flashlight_to_eng",
        "question": "Watch the flashlight and enter the corresponding English letter",
        "answer_morse": ".-.",
        "answer_letter": "r",
        "flash_interval": [300, 400, 1050, 1150, 1450], # [on for 300ms, off for 100ms, on for 650ms, off for 100ms, on for 300ms]
        "hint": ".-.",
        "answer_img": ["/static/image/r-answer.png"],
        "scored": False,
        "answered_correctly": 0,
    },
    "7": {
        "id": 7,
        "type": "flashlight_to_eng",
        "question": "Watch the flashlight and enter the corresponding English letter",
        "answer_morse": "... --- ...",
        "answer_letter": "sos",
        "flash_interval": [300, 400, 700, 800, 1100, 1400, 2050, 2150, 2800, 2900, 3550, 3850, 4150, 4250, 4550, 4650, 4950],
        "hint": "... --- ...",
        "answer_img": ["/static/image/r-answer.png"],
        "scored": False,
        "answered_correctly": 0,
    },
    "8": {
        "id": 8,
        "type": "audio_to_eng",
        "question": "Listen to the audio and write the corresponding letter",
        "audio_file": "/static/audio/morse_code_H.mp3",
        "answer_morse": "....",
        "answer_letter": "h",
        "flash_interval": [300, 400, 700, 800, 1100, 1200, 1500, 1800, 2100, 2400, 2700, 2800, 3450, 3550, 3850, 3950, 4250, 4550, 4850, 4950, 5600, 5700, 6000, 6100, 6400, 6700, 7350, 7450, 8100, 8200, 8850],
        "hint": "....",
        "answer_img": ["/static/image/h-answer.png"],
        "scored": False,
        "answered_correctly": 0,
    },
    "9": {
        "id": 9,
        "type": "audio_to_eng",
        "question": "Listen to the audio and write the corresponding letter",
        "audio_file": "/static/audio/morse_code_S.mp3",
        "answer_morse": "...",
        "answer_letter": "s",
        "flash_interval": [300, 400, 700, 800, 1100, 1200, 1500, 1800, 2100, 2400, 2700, 2800, 3450, 3550, 3850, 3950, 4250, 4550, 4850, 4950, 5600, 5700, 6000, 6100, 6400, 6700, 7350, 7450, 8100, 8200, 8850],
        "hint": "...",
        "answer_img": ["/static/image/s-answer.png"],
        "scored": False,
        "answered_correctly": 0,
    },
    "10": {
        "id": 10,
        "type": "audio_to_eng",
        "question": "Listen to the audio and write the corresponding letter",
        "audio_file": "/static/audio/morse_code_MORSE.mp3",
        "answer_morse": "-- --- .-. ... .",
        "answer_letter": "morse",
        "flash_interval": [300, 400, 700, 800, 1100, 1200, 1500, 1800, 2100, 2400, 2700, 2800, 3450, 3550, 3850, 3950, 4250, 4550, 4850, 4950, 5600, 5700, 6000, 6100, 6400, 6700, 7350, 7450, 8100, 8200, 8850],
        "hint": "-- --- .-. ... .",
        "answer_img": ["/static/image/m-answer.png", "/static/image/o-answer.png", "/static/image/r-answer.png", "/static/image/s-answer.png", "/static/image/e-answer.png"],
        "scored": False,
        "answered_correctly": 0,
    },
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
        quiz["answered_correctly"] = 0

    global quiz_score
    quiz_score = 0

    return render_template('quiz_home.html')

@app.route('/quiz/<quiz_id>')
def quiz(quiz_id):
    quiz = quizzes[quiz_id]
    total_quizzes = len(quizzes)

    return render_template('quiz.html', quiz=quiz, total_quizzes=total_quizzes, all_quizzes=quizzes)

@app.route('/quiz_answer/<quiz_id>')
def quiz_answer(quiz_id):
    quiz = quizzes[quiz_id]
    total_quizzes = len(quizzes)

    # update answered_correctly to -2 to prevent user from answering again
    if quizzes[quiz_id]["answered_correctly"] == -1:
        quizzes[quiz_id]["answered_correctly"] = -2

    return render_template('quiz_answer.html', quiz=quiz, total_quizzes=total_quizzes, all_quizzes=quizzes)

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
    # if (quizzes[quiz_id]["scored"] == True):
    #     return jsonify({"score": quiz_score})
    
    is_correct = json_data["is_correct"]
    print(is_correct)
    if is_correct: # if the answer is correct
        
        # if quizzes[quiz_id]["scored"]: 
        if quizzes[quiz_id]["answered_correctly"] == -1: 
            # if it's the second try and got correct, set to 2 (yellow)
            quizzes[quiz_id]["answered_correctly"] = 2
            print("change to 2")
        elif quizzes[quiz_id]["answered_correctly"] == 0:
            # if it's the first time the user answered correctly, set to 1 (green)
            quizzes[quiz_id]["answered_correctly"] = 1
            print("change to 1")
            quiz_score += 1
    else:
        # if the answer is wrong, set to -1 (red)
        if quizzes[quiz_id]["answered_correctly"] == 0:
            quizzes[quiz_id]["answered_correctly"] = -1
            print("change to -1")
    
    all_answered_correctly = []
    for quiz in quizzes.values():
        all_answered_correctly.append(quiz["answered_correctly"])

    quizzes[quiz_id]["scored"] = True

    print(quiz_score)

    return jsonify({"score": quiz_score, "all_answered_correctly": all_answered_correctly})


if __name__ == '__main__':
    app.run(debug = True)

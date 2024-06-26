from flask import Flask
from flask import render_template
from flask import Response, request, jsonify
from flask import Flask, session
app = Flask(__name__)
app.secret_key = 'COMS4170' 

learns = { 
    "0": {
        "id": 0,
        "letter": "e",
        "morse_code": ".",
        "plain_image": "/static/image/e-plain.png",
        "morse_image": "/static/image/e-morse.png",
        "morse_audio": "/static/audio/e-audio.mp3",
        "position": [[80, 6]], # [top, left],
        "dash": "/static/image/dash_hor.png",
        "dash_width": "110",
        "flash_interval": [300]
    },
    "1": {
        "id": 1,
        "letter": "m",
        "morse_code": "--",
        "plain_image": "/static/image/m-plain.png",
        "morse_image": "/static/image/m-morse.png",
        "morse_audio": "/static/audio/m-audio.mp3",
        "position": [[30, 15], [30, 172]], # [top, left],
        "dash": "/static/image/dash_ver.png",
        "dash_width": "10",
        "flash_interval": [700, 900, 1600]
    },
    "2": {
        "id": 2,
        "letter": "o",
        "morse_code": "---",
        "plain_image": "/static/image/o-plain.png",
        "morse_image": "/static/image/o-morse.png",
        "morse_audio": "/static/audio/o-audio.mp3",
        "position": [[-2, 0], [-2, 0], [-2, 0]], # [top, left],
        "dash": ["/static/image/o-dash-1.png", "/static/image/o-dash-2.png", "/static/image/o-dash-3.png"],
        "dash_width": "180",
        "flash_interval": [600, 800, 1500, 1700, 2400]
    },
    "4": {
        "id": 4,
        "letter": "r",
        "morse_code": ".-.",
        "plain_image": "/static/image/r-plain.png",
        "morse_image": "/static/image/r-morse.png",
        "morse_audio": "/static/audio/r-audio.mp3",
        "position": [[150, 6], [101, 15], [150, 100]], # [top, left],
        "dash": "/static/image/dash_hor.png",
        "dash_width": "80",
        "flash_interval": [300, 500, 1200, 1400, 1700]
    },
    "3": {
        "id": 3,
        "letter": "s",
        "morse_code": "...",
        "plain_image": "/static/image/s-plain.png",
        "morse_image": "/static/image/s-morse.png",
        "morse_audio": "/static/audio/s-audio.mp3",
        "position": [[0, 57], [75, 57], [162, 57]], # [top, left],
        "dash": "/static/image/dash_hor.png",
        "dash_width": "110",
        "flash_interval": [300, 500, 800, 1000, 1300]
    },
    "6": {
        "id": 6,
        "letter": "c",
        "morse_code": "-.-.",
        "plain_image": "/static/image/c-plain.png",
        "morse_image": "/static/image/c-morse.png",
        "morse_audio": "/static/audio/c-audio.mp3",
        "position": [[-10, -15], [80, 15], [-10, -15], [143, 110]], # [top, left],
        "dash": ["/static/image/c-dash-1.png", "", "/static/image/c-dash-2.png"],
        "dash_width": "200",
        "flash_interval": [700, 900, 1200, 1400, 2100, 2300, 2600]
    },
    "5": {
        "id": 5,
        "letter": "d",
        "morse_code": "-..",
        "plain_image": "/static/image/d-plain.png",
        "morse_image": "/static/image/d-morse.png",
        "morse_audio": "/static/audio/d-audio.mp3",
        "position": [[30, 18], [6, 85], [156, 85]], # [top, left],
        "dash": "/static/image/dash_ver.png",
        "dash_width": "10",
        "flash_interval": [700, 900, 1200, 1400, 1700]
    }
}

quizzes = {
    "1": {
        "id": 1,
        "type": "eng_to_morse",
        "question": "Please enter the Morse Code for 'E'",
        "answer_morse": ".",
        "answer_letter": "e",
        "morse_audio": "/static/audio/e-audio.mp3",
        "hint": "/static/image/e-hint.png",
        "answer_img": ["/static/image/e-answer.png"],
        "scored": False,
        "answered_correctly": 0,
        "id_in_learns": [0],
    },
    "2": {
        "id": 2,
        "type": "eng_to_morse",
        "question": "Please enter the Morse Code for 'M'",
        "answer_morse": "--",
        "answer_letter": "m",
        "morse_audio": "/static/audio/m-audio.mp3",
        "hint": "/static/image/m-hint.png",
        "answer_img": ["/static/image/m-answer.png"],
        "scored": False,
        "answered_correctly": 0,
        "id_in_learns": [1],
    },
    "3": {
        "id": 3,
        "type": "eng_to_morse",
        "question": "Please enter the Morse Code for 'Me'",
        "answer_morse": "-- .",
        "answer_letter": "me",
        "morse_audio": "/static/audio/me-audio.mp3", # add here
        "hint": "/static/image/me-hint.png",
        "answer_img": ["/static/image/me-answer.png"],
        "scored": False,
        "answered_correctly": 0,
        "id_in_learns": [1, 0],
    },
    "4": {
        "id": 4,
        "type": "flashlight_to_eng",
        "question": "Watch the flashlight and enter the corresponding letter",
        "answer_morse": "-..",
        "answer_letter": "d",
        "morse_audio": "/static/audio/d-audio.mp3",
        "flash_interval": [700, 900, 1200, 1400, 1700],
        # "hint": ["/static/image/h-hint.png", "/static/image/e-hint.png", "/static/image/l-hint.png", "/static/image/l-hint.png", "/static/image/o-hint.png"],
        "hint": "-..",
        # "answer_img": ["/static/image/h-answer.png", "/static/image/e-answer.png", "/static/image/l-answer.png", "/static/image/l-answer.png", "/static/image/o-answer.png"],
        "answer_img": ["/static/image/d-answer.png"],
        "scored": False,
        "answered_correctly": 0,
        "id_in_learns": [5],
    },
    "5": {
        "id": 5,
        "type": "flashlight_to_eng",
        "question": "Watch the flashlight and enter the corresponding letter",
        "answer_morse": "---",
        "answer_letter": "o",
        "morse_audio": "/static/audio/o-audio.mp3",
        "flash_interval": [700, 900, 1600, 1800, 2500], # [on for 650ms, off for 100ms, on for 650ms]
        "hint": "---",
        "answer_img": ["/static/image/o-answer.png"],
        "scored": False,
        "answered_correctly": 0,
        "id_in_learns": [2],
    },
    "6": {
        "id": 6,
        "type": "flashlight_to_eng",
        "question": "Watch the flashlight and enter the corresponding word",
        "answer_morse": "-.. ---",
        "answer_letter": "do",
        "morse_audio": "/static/audio/do-audio.mp3",
        "flash_interval": [700, 900, 1200, 1400, 1700, 2700, 3400, 3600, 4300, 4500, 5200], 
        "hint": "-.. ---",
        "answer_img": ["/static/image/do-answer.png"],
        "scored": False,
        "answered_correctly": 0,
        "id_in_learns": [5, 2],
    },
    "7": {
        "id": 7,
        "type": "audio_to_eng",
        "question": "Listen to the audio and write the corresponding letter",
        "answer_morse": "-.-.",
        "answer_letter": "c",
        "morse_audio": "/static/audio/c-audio.mp3", 
        "flash_interval": [650,750,1050,1150,1800,1900,2200],
        "hint": "-.-.",
        "answer_img": ["/static/image/c-answer.png"],
        "scored": False,
        "answered_correctly": 0,
        "id_in_learns": [6],
    },
    "8": {
        "id": 8,
        "type": "audio_to_eng",
        "question": "Listen to the audio and write the corresponding word",
        # "audio_file": "/static/audio/h-audio.mp3",
        "answer_morse": "-.-. --- -..",
        "answer_letter": "cod",
        "morse_audio": "/static/audio/cod-audio.mp3",
        "flash_interval": [650,750,1050,1150,1800,1900,2200,2500,3150,3250,3900,4000,4650],
        "hint": "-.-. --- -..",
        "answer_img": ["/static/image/cod-answer.png"],
        "scored": False,
        "answered_correctly": 0,
        "id_in_learns": [6, 2, 5],
    },
    "9": {
        "id": 9,
        "type": "eng_to_morse",
        "question": "Please enter the Morse Code for 'R'",
        "answer_morse": ".-.",
        "answer_letter": "r",
        "morse_audio": "/static/audio/r-audio.mp3",
        "hint": "/static/image/r-hint.png",
        "answer_img": ["/static/image/r-answer.png"],
        "scored": False,
        "answered_correctly": 0,
        "id_in_learns": [4],
    },
    "10": {
        "id": 10,
        "type": "eng_to_morse",
        "question": "Please enter the Morse Code for 'ROE'",
        "answer_morse": ".-. --- .",
        "answer_letter": "roe",
        "morse_audio": "/static/audio/roe-audio.mp3",
        "hint": "/static/image/roe-hint.png",
        "answer_img": ["/static/image/roe-answer.png"],
        "scored": False,
        "answered_correctly": 0,
        "id_in_learns": [4, 2, 0],
    },
    "11": {
        "id": 11,
        "type": "flashlight_to_eng",
        "question": "Watch the flashlight and enter the corresponding letter",
        "answer_morse": "...",
        "answer_letter": "s",
        "morse_audio": "/static/audio/s-audio.mp3",
        "flash_interval": [300, 500, 800, 1000, 1300],
        "hint": "...",
        "answer_img": ["/static/image/s-answer.png"],
        "scored": False,
        "answered_correctly": 0,
        "id_in_learns": [3],
    },
    "12": {
        "id": 12,
        "type": "audio_to_eng",
        "question": "Listen to the audio and write the corresponding word",
        "answer_morse": ".-. --- ... .",
        "answer_letter": "rose",
        "morse_audio": "/static/audio/rose-audio.mp3",
        "flash_interval": [300, 200, 900, 1100, 1400, 2400, 3100, 3300, 4000, 4200, 4900, 5900, 6200, 6400, 6700, 6900, 7200, 8200, 8500],
        "hint": ".-. --- ... .",
        "answer_img": ["/static/image/rose-answer.png"],
        "scored": False,
        "answered_correctly": 0,
        "id_in_learns": [4, 2, 3, 0],
    },
    "13": {
        "id": 13,
        "type": "audio_to_eng",
        "question": "Listen to the audio and write the corresponding word",
        "answer_morse": "-.-. --- -.. .",
        "answer_letter": "code",
        "morse_audio": "/static/audio/code-audio.mp3",
        "flash_interval": [700, 900, 1200, 1400, 2100, 2300, 2600, 3300, 4000, 4200, 4900, 5100, 5800, 6500, 7200, 7400, 7700, 7900, 8200, 8900, 9200],
        "hint": "-.-. --- -.. .",
        "answer_img": ["/static/image/code-answer.png"],
        "scored": False,
        "answered_correctly": 0,
        "id_in_learns": [6, 2, 5, 0],
    },
    "14": {
        "id": 14,
        "type": "eng_to_morse",
        "question": "Please enter the Morse Code for 'MORSE'",
        "answer_morse": "-- --- .-. ... .",
        "answer_letter": "morse",
        "morse_audio": "/static/audio/morse-audio.mp3",
        "hint": "/static/image/morse-hint.png",
        "answer_img": ["/static/image/morse-answer.png"],
        "scored": False,
        "answered_correctly": 0,
        "id_in_learns": [1, 2, 4, 3, 0],
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
    current_page = learn_data['letter'].upper()  # Assuming 'letter' holds the character like 'H', 'E', etc.
    return render_template('learn.html', learn=learn_data, current_page=current_page)


@app.route('/learn_try/<learn_id>')
def learn_try(learn_id):
    learn_data = learns[learn_id]
    total_learns = len(learns)
    current_page = learn_data['letter'].upper()  # Assuming 'letter' holds the character like 'H', 'E', etc.
    return render_template('learn_try.html', learn=learn_data, total_learns=total_learns,  current_page=current_page)

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

    return render_template('quiz_score.html', quiz=quiz_data, quizzes=quizzes)

@app.errorhandler(404)
def page_not_found(e):
    # Log to console to confirm this function is triggered
    print("404 error caught, rendering custom page")
    return render_template('404.html'), 404

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

from flask import Flask
from flask import render_template
from flask import Response, request, jsonify
app = Flask(__name__)

quizzes = {
    "1": {
        "id": 1,
        "name": "Quiz 1",
        "question": "Please enter the Morse Code for 'I'",
        "answer_morse": "..",
        "answer_letter": "i",
        "hint": "/static/image/i-hint.png",
        "answer_img": "/static/image/i-answer.png"
    },
    "2": {
        "id": 2,
        "name": "Quiz 2",
        "question": "Please enter the Morse Code for 'A'",
        "answer_morse": ".-",
        "answer_letter": "a",
    }
}

quiz_score = 0

@app.route('/')
def home():
    return render_template('home.html')

@app.route('/quiz/<quiz_id>')
def quiz(quiz_id):
    quiz = quizzes[quiz_id]

    return render_template('quiz.html', quiz=quiz)

@app.route('/quiz_answer/<quiz_id>')
def quiz_answer(quiz_id):
    quiz = quizzes[quiz_id]

    return render_template('quiz_answer.html', quiz=quiz)

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
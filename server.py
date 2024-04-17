from flask import Flask
from flask import render_template
from flask import Response, request, jsonify
app = Flask(__name__)

quizzes = {
    "1": {
        "id": 1,
        "name": "Quiz 1",
        "question": "Please enter the Morse Code for 'I'",
        "answer": "..",
    }
}


@app.route('/')
def home():
    return render_template('home.html')

@app.route('/quiz/<quiz_id>')
def quiz(quiz_id):
    quiz = quizzes[quiz_id]

    return render_template('quiz.html', quiz=quiz)


if __name__ == '__main__':
    app.run(debug = True)
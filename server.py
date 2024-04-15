from flask import Flask
from flask import render_template
from flask import Response, request, jsonify
app = Flask(__name__)


@app.route('/')
def home():
    return render_template('home.html')

@app.route('/quiz1')
def quiz1():
    return render_template('quiz1.html')


if __name__ == '__main__':
    app.run(debug = True)
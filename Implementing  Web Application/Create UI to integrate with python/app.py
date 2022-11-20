from flask import Flask
from flask import render_template

app = Flask(__name__)
app.run(debug=True)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/sign-in')
def signin_form():
    return render_template('signin.html')

@app.route('/signup')
def signup_form():
    return render_template('signup.html')

@app.route('/about')
def about():
    return render_template('about.html')

from flask import Flask, request, jsonify
from flask_cors import CORS, cross_origin
import os
from os.path import join, dirname
import ibm_db
from dotenv import load_dotenv
from threading import Thread
from PIL import Image
import requests
from io import BytesIO
import blurhash
import numpy
import json


app = Flask(__name__)
cors = CORS(app)
app.config['CORS_HEADERS'] = 'Content-Type'

dotenv_path = join(dirname(__file__), '.env')
load_dotenv(dotenv_path)

connectionstr = os.environ.get('DB2_CONNECTION_STRING')
conn = ibm_db.connect(connectionstr, '', '')


def userPresent(email=None):
    if email:
        sql = "SELECT Email FROM User WHERE Email = ?"
        stmt = ibm_db.prepare(conn, sql)
        ibm_db.bind_param(stmt, 1, email)
        ibm_db.execute(stmt)
        account = ibm_db.fetch_assoc(stmt)

        if account:
            return "true"

    return "false"


@app.route("/")
def hello_world():
    return "<p>Welcome to news tracker api</p>"


@app.route("/userpresent", methods=['POST'])
def db2():
    email = request.json['email']
    isPresent = userPresent(email)
    return isPresent


@app.route("/createuser", methods=['POST'])
def createuser():
    try:
        Thread(target=userTask, args=(
            request.json['email'], request.json['name'])).start()
        return jsonify(success=True, message="User created")
    except:
        return jsonify(success=False, error="Missing email or name")


@app.route("/getblurhash", methods=['POST'])
def getblurhash():
    url = request.json['url']
    response = requests.get(url)
    hash = blurhash.encode(numpy.array(Image.open(
        BytesIO(response.content)).convert("RGB")))
    print(hash)
    return jsonify(hash=hash)


@app.route("/bookmark", methods=['POST'])
@cross_origin()
def Bookmark():
    try:
        Thread(target=bookMarkTask, args=(
            request.json['email'], request.json['content'])).start()
        return jsonify(success=True, message="Bookmarked")
    except:
        return jsonify(success=False, error="Missing email or content")


@app.route("/getbookmarks", methods=['POST'])
def getbookmarks():
    email = request.json['email']

    sql = "SELECT Content FROM Bookmark WHERE Email = ?"
    stmt = ibm_db.prepare(conn, sql)
    ibm_db.bind_param(stmt, 1, email)
    ibm_db.execute(stmt)

    response = []

    bookmarks = ibm_db.fetch_assoc(stmt)

    if not bookmarks:
        return jsonify(success=True, error="No bookmarks found")

    while bookmarks != False:
        response.append(bookmarks)
        bookmarks = ibm_db.fetch_assoc(stmt)

    response = json.dumps(response)
    return jsonify(success=True, bookmarks=response)


def bookMarkTask(email, content=None):
    sql = "INSERT INTO Bookmark (Email, Content) VALUES(?, ?)"
    stmt = ibm_db.prepare(conn, sql)
    ibm_db.bind_param(stmt, 1, email)
    ibm_db.bind_param(stmt, 2, content)
    ibm_db.execute(stmt)


def userTask(email, name=''):
    isPresent = userPresent(email)

    if isPresent != "true":
        sql = "INSERT INTO User (Name, Email) VALUES (?, ?)"
        stmt = ibm_db.prepare(conn, sql)
        ibm_db.bind_param(stmt, 1, name)
        ibm_db.bind_param(stmt, 2, email)
        ibm_db.execute(stmt)
        print('created user')

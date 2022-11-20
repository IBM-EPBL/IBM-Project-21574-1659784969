from server import app

if __name__ == "__main__":
    app.run()

# run the server
# gunicorn --bind 0.0.0.0:5000 wsgi:app
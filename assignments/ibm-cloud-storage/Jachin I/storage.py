import ibm_boto3
from ibm_botocore.client import Config, ClientError
import os
from os.path import join, dirname
from dotenv import load_dotenv
import urllib.parse
from flask import Flask,render_template

app = Flask(__name__)

dotenv_path = join(dirname(__file__), '.env')
load_dotenv(dotenv_path)

# Constants for IBM COS values
COS_ENDPOINT = os.environ.get("COS_ENDPOINT")
COS_API_KEY_ID = os.environ.get("COS_API_KEY_ID")
COS_INSTANCE_CRN = os.environ.get("COS_INSTANCE_CRN")
COS_AUTH_ENDPOINT = os.environ.get("COS_AUTH_ENDPOINT") 

# Create resource
cos = ibm_boto3.resource("s3",
    ibm_api_key_id=COS_API_KEY_ID,
    ibm_service_instance_id=COS_INSTANCE_CRN,
    ibm_auth_endpoint=COS_AUTH_ENDPOINT,
    config=Config(signature_version="oauth"),
    endpoint_url=COS_ENDPOINT
)

base_url='https://ibm-cloud-demo-12.s3.jp-tok.cloud-object-storage.appdomain.cloud/'

def get_buckets():
    print("Retrieving list of buckets")
    try:
        buckets = cos.buckets.all()
        for bucket in buckets:
            print("Bucket Name: {0}".format(bucket.name))
            return bucket.name
    except ClientError as be:
        print("CLIENT ERROR: {0}\n".format(be))
    except Exception as e:
        print("Unable to retrieve list buckets: {0}".format(e))

bn = get_buckets()
all_images_in_bucket = []
def get_bucket_contents(bucket_name):
    print("Retrieving bucket contents from: {0}".format(bucket_name))
    try:
        files = cos.Bucket(bucket_name).objects.all()
        for file in files:
            url = base_url + urllib.parse.quote(file.key)
            data = {
              "url": url,
              "name": file.key
            }
            all_images_in_bucket.append(data)
            # get_item(bucket_name, file.key)
    except ClientError as be:
        print("CLIENT ERROR: {0}\n".format(be))
    except Exception as e:
        print("Unable to retrieve bucket contents: {0}".format(e))

get_bucket_contents(bn)

@app.route("/")
def home():
    return render_template('home.html', data=all_images_in_bucket)

@app.route("/chat-bot")
def chat_bot():
    return render_template('chat-bot.html')


if __name__ == '__main__':
    app.run(debug=True)

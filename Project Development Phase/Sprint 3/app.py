from flask import Flask, render_template,request,redirect,session
from flask_mail import Mail, Message
from random import *
import math
import ibm_db
import uuid
import os
import requests
import datetime
import dbconn
import api

   
app = Flask(__name__)

mail = Mail(app) 
app.config['MAIL_SERVER']='smtp.gmail.com'
app.config['MAIL_PORT'] = 465
app.config['MAIL_USERNAME'] = 'MAIL_ID'
app.config['MAIL_PASSWORD'] = 'PASSWORD'
app.config['MAIL_USE_TLS'] = False
app.config['MAIL_USE_SSL'] = True
mail = Mail(app) 

app.secret_key=os.urandom(24)

@app.route('/')
def index():
    if "UID" in session:
       return redirect("/home/api/headlines")
    else:
        return render_template("index.html")
@app.route('/signup')
def register():
    return render_template("signup.html")

@app.route('/signin')
def login():
    return render_template("signin.html")

@app.route('/subscription')
def subscription():
        if "UID" in session:
           return render_template("subscription.html")
        else:
           return redirect("/signup")




#registration page code


@app.route("/registration", methods=['POST'])
def signup():
       if request.method == 'POST':
         name = request.form.get('name')
         email = request.form.get('email')
         pwd = request.form.get('pwd')
         emailcheck="SELECT * FROM userdetails WHERE EMAIL='{0}' "
         smt = ibm_db.prepare(dbconn.con, emailcheck.format(email))
         ibm_db.execute(smt)
         mailres=ibm_db.fetch_assoc(smt)
         if mailres:
              return render_template("signup.html",msg="Email Is Already Taken")
         else:
           sql = "INSERT INTO userdetails (id,username,email,password,otp) VALUES ('{0}','{1}','{2}','{3}','{4}')"
           res = ibm_db.exec_immediate(dbconn.con, sql.format(uuid.uuid4(),name, email, pwd,"123"))
           if sql:
              return redirect("/signin")
           else:
              return redirect("/")
       else:
        print("Could'nt store anything...")



#login page code      


@app.route("/login", methods=['POST'])
def signin():
       if request.method == 'POST':
            email = request.form.get('email')
            pwd = request.form.get('pwd')
            sql = "SELECT * FROM userdetails WHERE EMAIL='{0}' AND PASSWORD='{1}'"
            smt = ibm_db.prepare(dbconn.con,sql.format(email,pwd))
            ibm_db.execute(smt)
            res=ibm_db.fetch_assoc(smt)
            
            if res: 
                 session["UID"]=res['ID']
                 sql = "SELECT * FROM subscription WHERE EMAIL='{0}'"
                 smt = ibm_db.prepare(dbconn.con, sql.format(email))
                 ibm_db.execute(smt)
                 res=ibm_db.fetch_assoc(smt)
                 if res:
                    session["sub"]=True
                 else:
                     session["sub"]=False
                 return redirect("/home/api/headlines?page=1")
            else:
                  return render_template("signin.html",msg="Invalid Email Or Password")
       else:
         print("Could'nt store anything...")

#home page

@app.route('/home/api/headlines')
def home():
      if "UID" in session:
         sql = "SELECT * FROM userdetails WHERE ID='{0}' "
         smt = ibm_db.prepare(dbconn.con, sql.format(session["UID"]))
         ibm_db.execute(smt)
         res=ibm_db.fetch_assoc(smt)
         if res:
            h=api.headlines()
            tore=h['totalResults']
            to=math.ceil(tore/int(9))
            u=request.base_url
            pn=request.args.get('page')
            pn=1
            if pn:
               e_p=int(pn)*int(9)
               s_p=int(e_p)-int(9)
            return render_template("home.html",data=res,news=h,url_head=u,s=s_p,e=e_p,total=to,title="headlines")
         else:
            return redirect("/signin")
      else:
        return redirect("/signin")

 #search module

@app.route('/home/api/query',methods=['GET'])
def query():
        if "UID" in session:
            sql = "SELECT * FROM userdetails WHERE ID='{0}' "
            smt = ibm_db.prepare(dbconn.con, sql.format(session["UID"]))
            ibm_db.execute(smt)
            res=ibm_db.fetch_assoc(smt)
            if res:
                  q=request.args.get('search')
                  s=api.search(q)
                  tore=s['totalResults']
                  to=math.floor(tore/int(9))
                  if to>=10:
                     to=10
                  u=request.base_url
                  pn=request.args.get('page')
                  pn=1
                  if pn:
                    e_p=int(pn)*int(9)
                    s_p=int(e_p)-int(8)
                  return render_template("home.html",data=res,news=s,url_query=u,q=q,s=s_p,e=e_p,total=to,title=q)
            else:
              return redirect("/signin")
        else:
           return redirect("/signin")

#category module

@app.route('/home/api/cat-list',methods=['GET'])
def category():
        if "UID" in session:
            sql = "SELECT * FROM userdetails WHERE ID='{0}' "
            smt = ibm_db.prepare(dbconn.con, sql.format(session["UID"]))
            ibm_db.execute(smt)
            res=ibm_db.fetch_assoc(smt)
            if res:
                  q=request.args.get('category')
                  s=api.category(q)
                  tore=s['totalResults']
                  to=math.floor(int(tore)/int(9))
                  print(to)
                  u=request.base_url
                  pn=request.args.get('page')
                  if pn:
                    e_p=int(pn)*int(9)
                    s_p=int(e_p)-int(9)
                  return render_template("home.html",data=res,news=s,url_cat=u,s=s_p,e=e_p,qu=q,total=to,title=q)
            else:
              return redirect("/signin")
        else:
           return redirect("/signin")


#subscription module


@app.route("/sub-email", methods=['POST'])
def sub():
       if request.method == 'POST':
         loca= request.form.get('location')
         email = request.form.get('email')
         cat = request.form.get('cat')
         lang= request.form.get('lang')
         usercheck="SELECT * FROM userdetails WHERE ID='{0}' "
         smt = ibm_db.prepare(dbconn.con, usercheck.format(session["UID"]))
         ibm_db.execute(smt)
         mailres=ibm_db.fetch_assoc(smt)
         if mailres:
              sql = "INSERT INTO Subscription (id,email,location,category,language) VALUES ('{0}','{1}','{2}','{3}','{4}')"
              res = ibm_db.exec_immediate(dbconn.con, sql.format(session["UID"],email,loca,cat,lang))
              return redirect("/home/api/headlines?page=1")    
         else:
            return print("Could'nt store anything...")

       else:
          return render_template("signup.html",msg="Register and enjoy subscription")
        


#forget password send otp

@app.route('/forget-password', methods=['POST'])
def forgetpassword():
         if request.method == 'POST':
             email = request.form.get('email')
             otp=randint(000000,999999)
             msg = Message( 'OTP',sender ='karthicksarankalemuthu@gmail.com',recipients = [email])
             msg.body =str(otp)
             mail.send(msg)
             sql = "UPDATE userdetails SET OTP='{0}' WHERE EMAIL='{1}'"
             l=email.lower()
             res = ibm_db.exec_immediate(dbconn.con, sql.format(str(otp),l))
             if sql:
               return render_template("forgetpassword.html",Message="OTP is send your email")
             else:
               return render_template("signin.html") 
         else:
             return render_template("signin.html") 


#verifying otp

@app.route('/verify', methods=['POST'])
def verify():
         if request.method == 'POST':
             otp = request.form.get('OTP')
             pwd = request.form.get('pwd')
             sql="SELECT * FROM userdetails WHERE OTP='{0}' "
             smt = ibm_db.prepare(dbconn.con, sql.format(otp))
             ibm_db.execute(smt)
             res=ibm_db.fetch_assoc(smt)
             if res:
                  sql = "UPDATE userdetails SET PASSWORD='{0}' WHERE OTP='{1}'"
                  res = ibm_db.exec_immediate(dbconn.con, sql.format(pwd,otp))
                  return render_template("signin.html",Message="password changed successfully")
             else:
                  return render_template("forgetpassword.html",Message="OTP is invalid")

#send news on mail module

@app.route('/send')
def send():
         if "sub" in session:
             sql = "SELECT * FROM SUBSCRIPTION WHERE ID='{0}'"
             smt = ibm_db.prepare(dbconn.con, sql.format(session["UID"]))
             ibm_db.execute(smt)
             res=ibm_db.fetch_assoc(smt)
             r="https://gnews.io/api/v4/top-headlines?token={0}&topic={1}&lang={2}&country=in&max=10"
             key=""
             s=r.format(key,res["CATEGORY"],res["LANGUAGE"])
             d=requests.get(s)
             data=d.json()
             sql1 = "SELECT * FROM  userdetails WHERE ID='{0}'"
             smt1 = ibm_db.prepare(dbconn.con, sql1.format(session["UID"]))
             ibm_db.execute(smt1)
             res1=ibm_db.fetch_assoc(smt1)
             msg = Message( 'Read Everyday',sender ='MAIL_ID',recipients =[res1["EMAIL"]])
             news= '<div style="width:230px;height: 550px;border-radius: 5px;border: 3px solid #FF5161;box-shadow: 10px 10px 20px gainsboro;margin:20px;"><img style="width: 225px;height: 230px;"src="'+'{0}'+'" alt="Card image"><div><h4 style=" font-size: 15px;margin-left: 5px;overflow: hidden;">'+'{1}'+'</h4><p style=" font-size: 9px;font-weight: 500;margin-left: 5px;word-wrap: break-word;overflow: hidden;">'+'{2}'+'</p><a href="'+'{3}'+'" style="  width:140px;height: 35px;border-radius:3px;outline: none;border: none; background-color:#0975F3;color: #fff;box-shadow: 6px 7px 10px #E7E9F6; text-decoration: none;margin: 10px;">Read more</a><br></div></div>'
             sendnews=news.format(data["articles"][0]["image"],data["articles"][0]["title"],data["articles"][0]["description"],data["articles"][0]["url"])
             msg.html=sendnews
             mail.send(msg)
             return redirect("/home/api/headlines?page=1")
         else:
              return redirect("/signin")
      
#logout module

@app.route('/logout')
def logout():
        session.pop("UID",None)
        return redirect("/signin")

if __name__ == '__main__':
       app.run(debug=True)

from flask import Flask, render_template, request,redirect,g,session
import ibm_db
import uuid
import os
import dbconn

app = Flask(__name__)

app.secret_key=os.urandom(24)

@app.route('/')
def index():
    if "UID" in session:
       return redirect("/home")
    else:
        return render_template("index.html")
@app.route('/signup')
def register():
    return render_template("signup.html")

@app.route('/signin')
def login():
    return render_template("signin.html")



#registration page code


@app.route("/registration", methods=['POST'])
def signup():
       if request.method == 'POST':
         name = request.form.get('name')
         email = request.form.get('email')
         pwd = request.form.get('pwd')
         emailcheck="SELECT * FROM authentication WHERE EMAIL='{0}' "
         smt = ibm_db.prepare(dbconn.con, emailcheck.format(email))
         ibm_db.execute(smt)
         mailres=ibm_db.fetch_assoc(smt)
         if mailres:
              return render_template("signup.html",msg="Email Is Already Taken")
         else:
           sql = "INSERT INTO authentication (id,username,email,password) VALUES ('{0}','{1}','{2}','{3}')"
           res = ibm_db.exec_immediate(dbconn.con, sql.format(uuid.uuid4(),name, email, pwd,))
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
            sql = "SELECT * FROM authentication WHERE EMAIL='{0}' AND PASSWORD='{1}'"
            smt = ibm_db.prepare(dbconn.con, sql.format(email,pwd))
            ibm_db.execute(smt)
            res=ibm_db.fetch_assoc(smt)
            
            if res: 
                 session["UID"]=res['ID']
                 return redirect("/home")
            else:
                  return render_template("signin.html",msg="Invalid Email Or Password")
       else:
         print("Could'nt store anything...")

@app.route('/home')
def home():
      if "UID" in session:
         sql = "SELECT * FROM authentication WHERE ID='{0}' "
         smt = ibm_db.prepare(dbconn.con, sql.format(session["UID"]))
         ibm_db.execute(smt)
         res=ibm_db.fetch_assoc(smt)
         if res:
            return render_template("home.html")
         else:
            return redirect("/signin")
      else:
        return redirect("/signin")



@app.route('/logout')
def logout():
        session.pop("UID",None)
        return redirect("/signin")

if __name__ == '__main__':
    app.run(debug=True)

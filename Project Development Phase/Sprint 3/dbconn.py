import ibm_db
try:
    con = ibm_db.connect("DATABASE=bludb;HOSTNAME=b0aebb68-94fa-46ec-a1fc-1c999edb6187.c3n41cmd0nqnrk39u98g.databases.appdomain.cloud;PORT=31249;SECURITY=SSL;SSLServerCertificate=DigiCertGlobalRootCA.crt;UID=hrc47660;PWD=vn0D4tZ0VkJyM6xw;", '', '')
    print("db connection successfully")
except:
    print("db connection failed")

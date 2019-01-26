import os
import sys
import json
import time
import datetime
import requests 

def checkEmail(email):
    url = 'https://api.passporterapp.com/api/v1/users/signup/check/email/'
    payload = {'email': email}
    try:
        response = requests.request("POST", url, json=payload)
        data = response.json()
        return data['exists']
    except:
        return False

print("start sendMail script") 


# api-endpoint 
READYLIKERSURL = "http://#api#/api/Likers/ready".replace("#api#",os.environ['GROWTH_API_URL'])
LIKERSENDMAIL  = "http://#api#/api/Likers/#id#/send".replace("#api#",os.environ['GROWTH_API_URL'])
LIKERSURL = "http://#api#/api/Likers/#id#".replace("#api#",os.environ['GROWTH_API_URL'])


print('start sendMails Daemon')

while 1==1 :
    print(datetime.datetime.now())
    print('loop start')
    try:
        r = requests.get(url = READYLIKERSURL) 
        likers =  r.json()
        if likers != 'error':
            print('%i likers preparados para envio' % (len(likers)))
            for liker in likers:
                checked = checkEmail(liker['public_email'])
                if checked:
                    print('setting liker state to passporterer:')
                    print(liker['id'])
                    payload = {'passporterAccount': True}
                    r = requests.post(url = LIKERSURL.replace("#id#",liker['id']),json=payload)
                else:
                    print('ordering send for liker:')
                    print(liker['id'])
                    r = requests.patch(url = LIKERSENDMAIL.replace("#id#",liker['id']))
                print(r)
        else:
            print('not liker waiting to send')
    except:
        likers = None
        print('cant connect to likers ready')
    


    print('waiting 10 seconds for check more likers ready to send')
    time.sleep(10)



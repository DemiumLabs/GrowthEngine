import os
import sys
import json
import time
import requests
from kafka import KafkaConsumer
from kafka import KafkaProducer
from kafka.errors import KafkaError

producer = KafkaProducer(bootstrap_servers=[os.environ['KAFKAURL']],value_serializer=lambda m: json.dumps(m).encode('ascii'))
consumer = KafkaConsumer('tasks', group_id="sendMail", bootstrap_servers=[os.environ['KAFKAURL']])


AVAILABLE_ACCOUNT_URL = "http://mailer_api:3000/api/Accounts/available"
SENDEMAILURL = "http://mailer_api:3000/api/Accounts/#accountId#/send/#sendId#"
for message in consumer:
    # message value and key are raw bytes -- decode if necessary!
    # e.g., for unicode: `message.value.decode('utf-8')`
    print ("%s:%d:%d" % (message.topic, message.partition,message.offset))

    print ("sending message : %d : %s" % (message.offset,message.value))

    messageData = json.loads(message.value)

    r = requests.get(url = AVAILABLE_ACCOUNT_URL) 
    data =  r.json()
    print(data)
    if not data['account']: 
        reload = json.loads(message.value)
        producer.send('tasks', reload )
        print('no accounts available, queue and sleep')
        time.sleep(10)
    else:     
        url = SENDEMAILURL.replace("#accountId#", data['account']['id']).replace('#sendId#',messageData['sendId'])
        print(url)
        r = requests.post(url = url,params= {'reservationToken': data['account']['reservationToken']}) 
        print(r.json())

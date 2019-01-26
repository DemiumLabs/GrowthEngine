import os
import sys
import json
import time
import datetime
import requests 
import json

from kafka import KafkaConsumer
from kafka import KafkaProducer
from kafka.errors import KafkaError

print('start script send to mailer')
print(datetime.datetime.now())

MAILERAPIURL = "http://#mailerapi#/api/Sends".replace("#mailerapi#",os.environ['MAILER_API_URL'])

consumer = KafkaConsumer('sends', group_id="sendToMailer", bootstrap_servers=[os.environ['KAFKA_URL']])



for message in consumer:
    # message value and key are raw bytes -- decode if necessary!
    # e.g., for unicode: `message.value.decode('utf-8')`
    # print ("%s:%d:%d: key=%s value=%s" % (message.topic, message.partition,
    #                                       message.offset, message.key,
    #                                       message.value))
    print ("%s:%d:%d" % (message.topic, message.partition,message.offset))

    data = json.loads(message.value)
    if sum([key in data.keys() for key in ['email', 'name', 'template']]) == 3:
        print(data['template'])
        print(data['email'])
        print(data['name'])
        #time.sleep(5)
        to = {'name':data['name'],'email':data['email']}
        payload = {'template' : data['template'],'to':to }
        try:
            r = requests.post(url = MAILERAPIURL, json = payload) 
            print(r.json())
        except:
            print('cant connect to mailer api')
            time.sleep(5)
            sys.exit()

   
    
    # likers = bot.get_media_likers(data['media_id'])

    # print('Number of likers: %d' % len(likers))

    # for i, liker_id in enumerate(likers):
    #     print(liker_id)
    #     producer.send('likers', {'passporterInterest':data['passporterInterest'], 'instance': data['instance'], 'liker_id' :liker_id} )


import os
import sys
import json
import time
import datetime
from kafka import KafkaConsumer
from kafka import KafkaProducer
from kafka.errors import KafkaError
import requests 

sys.path.append(os.path.join(sys.path[0], '../'))
from instabot import Bot

print(datetime.datetime.now())
print("start likers script") 

# api-endpoint 
LIKERINTERESTURL = "http://growth_api:3000/api/Likers/#likerId#/interests"
LIKERSURL = "http://growth_api:3000/api/Likers"




bot = Bot()
bot.login(
    username = os.environ['USERNAME'],
    password = os.environ['PASSWORD'],
    cookie_fname = os.environ['COOKIE']
)

try:
    consumer = KafkaConsumer('likers', group_id="likerInterest", bootstrap_servers=[os.environ['KAFKAURL']])
except:
    print(datetime.datetime.now())
    print('not conect to kafka')
    sys.exit()

for message in consumer:
    # message value and key are raw bytes -- decode if necessary!
    # e.g., for unicode: `message.value.decode('utf-8')`
    # print ("%s:%d:%d: key=%s value=%s" % (message.topic, message.partition,
    #                                       message.offset, message.key,
    #                                       message.value))
    print ("%s:%d:%d" % (message.topic, message.partition, message.offset))
    print(datetime.datetime.now())

    data = json.loads(message.value)

    pk = data['liker_id']
    taggerId = data['instance']

    lbFilter = {"where":{"pk":pk}}

    PARAMS =  {"filter": json.dumps(lbFilter)}
    r = requests.get(url = LIKERSURL, params = PARAMS) 
    likers =  r.json()

    if  len(likers) == 0: 
        time.sleep(int(os.environ['SLEEPTIME']))
        user = bot.get_user_info(pk)
        r = requests.post(url = LIKERSURL, data = user) 
        liker = r.json()
    else:
        liker = likers[0]

    print('set interest for liker:')
    print(liker['id'])

    r = requests.post(url = LIKERINTERESTURL.replace("#likerId#", liker['id']), data = {'taggerId' : taggerId}) 
    print(r.json())
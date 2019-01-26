import os
import sys
import json
sys.path.append(os.path.join(sys.path[0], '../'))
from instabot import Bot
from kafka import KafkaConsumer
from kafka import KafkaProducer
from kafka.errors import KafkaError

bot = Bot()
bot.login(
    username = os.environ['USERNAME'],
    password = os.environ['PASSWORD'],
    cookie_fname = os.environ['COOKIE']
)

producer = KafkaProducer(bootstrap_servers=[os.environ['KAFKAURL']],value_serializer=lambda m: json.dumps(m).encode('ascii'))
print(producer)


consumer = KafkaConsumer('tags', group_id="extractLikers", bootstrap_servers=[os.environ['KAFKAURL']])

print(consumer)
for message in consumer:
    # message value and key are raw bytes -- decode if necessary!
    # e.g., for unicode: `message.value.decode('utf-8')`
    # print ("%s:%d:%d: key=%s value=%s" % (message.topic, message.partition,
    #                                       message.offset, message.key,
    #                                       message.value))
    print ("%s:%d:%d" % (message.topic, message.partition,message.offset))

    data = json.loads(message.value)

    print(data['media_id'])

    likers = bot.get_media_likers(data['media_id'])

    print('Number of likers: %d' % len(likers))

    for i, liker_id in enumerate(likers):
        print(liker_id)
        producer.send('likers', {'passporterInterest':data['passporterInterest'], 'instance': data['instance'], 'liker_id' :liker_id} )
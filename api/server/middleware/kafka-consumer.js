'use strict';

var path = require('path');
var serverPath = path.join(path.dirname(module.parent.filename), '../../../server/');
var kafka = require('kafka-node');

module.exports = function(options) {
  options = options || {};

  console.log('kafka loading');
  const Consumer = kafka.Consumer;
  const client = new kafka.KafkaClient(
    { 
      kafkaHost: process.env.KAFKA_URL
    }
  );
  client.on('error',(error)=>console.log(error));
  options.handlers.map(handler);

  function handler(options){
    console.log(options);
        var topicsToCreate = [{
          topic: options.topic,
          partitions: 1,
          replicationFactor: 1
        }];
    
        client.createTopics(topicsToCreate, (error, result) => {

        let handler = require(path.join(serverPath, options.consumerHandler));

        let consumer = new Consumer(
            client,
            [
                { topic: options.topic, partition: 0 }
            ],
            {
                autoCommit: false
            }
        );
        
        consumer.on('message', function(message) {
              if (handler.onMessage && typeof handler.onMessage === 'function') {
                handler.onMessage(message);
            } else {
                console.log(JSON.parse(message.value));
            }
        });

        consumer.on('error', function(err) {
              if (handler.onError && typeof handler.onError === 'function') {
                handler.onError(err);
            } else {
                console.log('Error:', err);
            }
        });

        consumer.on('offsetOutOfRange', function(err) {
              if (handler.onOffsetOutOfRange && typeof handler.onOffsetOutOfRange === 'function') {
                handler.onOffsetOutOfRange(err);
            } else {
                console.log('offsetOutOfRange:', err);
            }
        });
    });
  }


  


  // console.log('kafka loading');

  // var canReceive = true;
  // if (!options['consumerHandler']) {
  //   console.warn('You have to define a consumer handling module');
  //   canReceive = false;
  // }
  // if (!process.env.KAFKA_URL) {
  //   console.warn('Kafka url not set, events will not received. Please set KAFKA_URL.');
  //   canReceive = false;
  // }
  // if (!options['topic']) {
  //   console.warn('Kafka topic not set, events will not received. Please set topic in midleware config');
  //   canReceive = false;
  // }

 // if (canReceive) {
  //  var handler = require(path.join(serverPath, options['consumerHandler']));

  //}


  //   consumer.on('message', function (message) {
  //     console.log(message);
  //   });


  // }

  return function(req, res, next) {
    console.log('consumer middleware');
    next();
  };
};
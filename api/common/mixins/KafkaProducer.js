'use strict';

var kafka = require('kafka-node');

module.exports = function(Model, options) {
  var canSend = true;
  var Producer = kafka.Producer;
  var client = null;
  var producer = null;
  var timeToRetryConnection = 12 * 1000; // 12 seconds
  var reconnectInterval = null;

  if (!process.env.KAFKA_URL) {
    console.log('Kafka url not set, events will not be sent, please set KAFKA_URL env variable');
    canSend = false;
  }

  if (canSend) {
    var _initProducer = function() {
      client = new kafka.Client(process.env.KAFKA_URL),
      producer = new Producer(client);

	    producer.on('ready', function() {
	      console.log('Kafka producer is ready!!');
	      if (reconnectInterval != null) {
	        clearTimeout(reconnectInterval);
	        reconnectInterval = null;
	      }
	    });

	    producer.on('error', function(err) {
	      producer.close();
	      client.close();
	      if (reconnectInterval == null) { // Multiple Error Events may fire, only set one connection retry.
	        reconnectInterval =
					setTimeout(function() {
					  console.log('Reconnect is called in producer error event');
					  _initProducer();
					}, timeToRetryConnection);
	      }
	    });

	    client.on('error', function(err) {
	      producer.close();
	      client.close(); // Comment out for client on close
	      if (reconnectInterval == null) { // Multiple Error Events may fire, only set one connection retry.
	        reconnectInterval =
					setTimeout(function() {
					  console.log('reconnect is called on client error event');
					  _initProducer();
					}, timeToRetryConnection);
	      }
	    });

	    client.on('close', function(err) {
	      producer.close();
	      if (reconnectInterval == null) { // Multiple Error Events may fire, only set one connection retry.
	        reconnectInterval =
					setTimeout(function() {
					  console.log('reconnect is called on client close');
					  _initProducer();
					}, timeToRetryConnection);
	      }
	    });
    };
    _initProducer();
  }

  Model.sendEvent = function(model, next) {
    if (canSend) {
      var sentMessage = JSON.stringify(model.messages);
      var payloads = [
        {topic: model.topic, messages: sentMessage, partition: 0},
      ];
      producer.send(payloads, function(err, data) {
        if (next) {
          next(err, data);
        }
      });
    } else {
      if (next) {
        next(null, null);
      }
    }
  };
};
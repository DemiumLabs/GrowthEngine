'use strict';
var kafka = require('kafka-node');
const Consumer = kafka.Consumer;


module.exports = function kafkaExtractTags(server) {
    
    
    // const client = new kafka.KafkaClient(
    //   { 
    //     kafkaHost: 'kafka:29092'
    //   }
    // );
    
    // client.on('error',(error)=>console.log(error));
    
    // const consumer = new Consumer(
    //     client,
    //     [
    //         { topic: 't1' }
    //     ],
    //     {
    //         groupId: 'extractTags_t1'
    //     }
    // );

    // consumer.on('message', function (message) {
    //     console.log(message);
    // });
};

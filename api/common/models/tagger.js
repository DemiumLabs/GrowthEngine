'use strict';

var kafka = require('kafka-node');
const client = new kafka.KafkaClient({
    kafkaHost: process.env.KAFKA_URL,
    connectTimeout: 5000,
    requestTimeout: 1000
});
const producer = new kafka.Producer(client);
const admin = new kafka.Admin(client); // client must be KafkaClient

producer.on('ready', function () { console.log('producer ready'); });





module.exports = function(Tagger) {


    Tagger.observe('after save', function queueInstagramProcess(ctx, next) {
        if(ctx.isNewInstance){
            let message = { action: 'instagramGetInfo', passporterInterest:ctx.instance.passporterInterest, instance: ctx.instance.id, media_id: ctx.instance.media_id };
            producer.send([{
                topic:'tags',
                messages: [JSON.stringify(message)]
            }],(err,result)=> console.log(err,result));
        }  
        next();
    });


    Tagger.reload = function(cb) {
        Tagger.find().then(taggers=>{
            let messages = taggers.forEach(x => {
                let message = JSON.stringify({ action: 'instagramGetInfo', passporterInterest:x.passporterInterest, instance: x.id, media_id: x.media_id });
                producer.send([{
                    topic:'tags',
                    messages: [message]
                }],(err,result)=> console.log(err,result));
            })
            cb(null, messages);
        });
    }
  
    Tagger.remoteMethod('reload', {
        returns: {arg: 'reload', type: 'string'}
    });


    Tagger.observe('access', function logQuery(ctx, next) {

        admin.listGroups((err, res) => {
            console.log('consumerGroups', res);
      
        });      
        admin.describeGroups(['likerInterest','extractLikers'], (err, res) => {
                console.log(JSON.stringify(res,null,1));
        })
        console.log('Accessing %s matching %s', ctx.Model.modelName, ctx.query.where);
        next();
      });
};

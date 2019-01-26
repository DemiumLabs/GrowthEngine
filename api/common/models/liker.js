'use strict';
const MINIMUM_WAIT_TIME = 7 * 24 * 60 * 60 * 1000;  // 7 days in miliseconds 

var kafka = require('kafka-node');
const client = new kafka.KafkaClient({
    kafkaHost: process.env.KAFKA_URL,
    connectTimeout: 5000,
    requestTimeout: 1000
});
const producer = new kafka.Producer(client);
const admin = new kafka.Admin(client); // client must be KafkaClient

producer.on('ready', function () { console.log('liker producer ready'); });



module.exports = function(Liker) {


    Liker.getReadyToSend = () => {
        const limit = 10;
        const fields = ['public_email','full_name'];
        const include = ["interests"];

        let withPublicEmailCondition = {
                                            and: [
                                            {
                                                public_email: {
                                                neq: ""
                                                }
                                            },
                                            {
                                                public_email: {
                                                neq: null
                                                }
                                            }
                                            ]
                                        }

        let waitToSendCondition =       { 
                                            or: [
                                                {lastSend: {eq: null} },    
                                                {lastSend: {lt: Date.now() - MINIMUM_WAIT_TIME}}
                                            ]  
                                        };
                          
        let isNotPassporterer =         {
                                            or: [
                                                {
                                                    passporterAccount: {
                                                    eq: ""
                                                    }
                                                },
                                                {
                                                    passporterAccount: {
                                                    eq: null
                                                    }
                                                }
                                                ]    
                                        }


        let filter = { 
                        include: include,
                      //  fields: fields,
                        limit: limit,
                        where: {
                            and: [
                                 withPublicEmailCondition,
                                 waitToSendCondition,
                                 isNotPassporterer
                            ]
                        }
                     }
       // console.log(JSON.stringify(filter));
        
        return Liker.find(filter)
    }

    Liker.prototype.send = function(){
        console.log('enviando',this.id);

        let message = { email: this.public_email, name: this.full_name, template:'default' };
        producer.send([{
            topic: 'sends',
            messages: [JSON.stringify(message)]
        }],(err,result)=> console.log(err,result));
        
        
        this.lastSend = new Date();
        return this.save();
    }


    Liker.remoteMethod('getReadyToSend', {
        description: "get next Likers ready to send",
        http: {path: '/ready', verb: 'get'},
        returns: {root: 'true', type: 'object'}
     });


     Liker.remoteMethod('send', {
        isStatic: false,
        description: "send email for this liker",
        http: {path: '/send', verb: 'post'},
        accepts: [
       //     { arg:'id', type: 'string', required:true, description:"Model Id"}
        ],
        returns: {root: 'true', type: 'object'}
     });



};

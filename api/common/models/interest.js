'use strict';

module.exports = function(Interest) {



    Interest.observe('before save', function uniqueControl(ctx, next) {
        if(ctx.instance && ctx.isNewInstance){
            Interest
                .count( {and:[{likerId: ctx.instance.likerId},{taggerId: ctx.instance.taggerId}]})
                .then((n)=> n ?  next('liker and tagger exisits') : next(null));
        }  else   next();
    });






    Interest.dashboard = function(cb) {
        let fields = {"fields":["passporterInterest"]};
        let filter = {include:{relation:"tagger",scope:{fields:["passporterInterest"]}}};
        Interest.find(filter).then(interest=>{

            
            let dataProcess = (interests)=>{
                return interests
                .reduce((last,x)=>{  
                      var el = last.find(e=>e.passporterInterest == x.tagger.passporterInterest); 
                      if(el) {
                          var li = el.likers.find((e=>e.liker == x.likerId));
                          if(li) li.count++;
                          else el.likers.push({liker:x.likerId,count:1});
                      } 
                      else last.push({passporterInterest:x.tagger.passporterInterest,likers:[{liker:x.likerId,count:1}]}); 
                      return last  
                },[])
                .map((x)=>{
                      x.tops = x.likers.reduce((l,x)=>{
                          var el = l.find(e=>e.count == x.count);
                          if(el) el.quantity++;
                          else l.push({count:x.count,quantity:1});
                          return l;
                      },[])
                      .sort((a,b) => b.count - a.count)
                      return x;
                })
              }


            cb(null,dataProcess(interest));

        })
        
    }
  
    Interest.remoteMethod('dashboard', {
        returns: {root:true, type: 'array'}
    });



};

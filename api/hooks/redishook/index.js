module.exports = function myHook(sails) {

   // This var will be private
   var redis = require('../../../node_modules/redis');
   var RedisNotifier = require('redis-notifier');

   var eventNotifier = new RedisNotifier(redis, {
      redis : { host : '127.0.0.1', port : 6379 },
      expired : true,
      evicted : true,
      logLevel : 'DEBUG' //Defaults To INFO
   });
   return {
      defaults: {
         __configKey__: {
            _hookTimeout: 20000 // wait 20 seconds before timing out
         }
      },
      // This function will be public
      initialize: function(cb){
         eventNotifier.on('message', function(pattern, channelPattern, emittedKey) {
            var channel = this.parseMessageChannel(channelPattern);
            if(channel.key == 'expired'){
               var pars = emittedKey.split(':');
               var messageId = pars[pars.length - 1];
               Message.findOne({id: messageId})
               .then(function(msg){
                  if(msg !== undefined){
                     msg.destroy()
                     .then(function(m){
                        console.log('destroyed message');
                     })
                     .catch(function(err){
                        console.log(err);
                     })
                  }else{
                     console.log('no message');
                  }
               }).catch(function(err){
                  console.log(err);
               });
            }
         });
         return cb();
      }

   };
};
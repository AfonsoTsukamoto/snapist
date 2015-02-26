/**
* Message.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

function merge_options(obj1,obj2){
    var obj3 = {};
    for (var attrname in obj1) { obj3[attrname] = obj1[attrname]; }
    for (var attrname in obj2) { obj3[attrname] = obj2[attrname]; }
    return obj3;
}

var redis  = require('redis');
var redisClient = redis.createClient();

module.exports = {

  attributes: {
    text: {
      type: 'string',
      required: 'true',
      maxLength: 144
    },
    username: {
      type: 'string',
      required: true,
      maxLength: 10
    },
    channelId: {
      type: 'integer',
      required: true
    },
    toJSON: function(){
      var obj = this.toObject();
      delete obj.createdAt;
      return obj;
    }
  },
  afterCreate: function(message, next){
    var mkey = 'snapist:message:' + message.id;
    console.log(mkey);
    redisClient.set(mkey, message.text);
    redisClient.expire(mkey, 30);
    next();
  }
};

/**
 * ChannelController
 *
 * @description :: Server-side logic for managing channels
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {
	index: function(req, res){
    Channel.find().then(function(channels){
      if(channels !== undefined){
        res.status(200);
        res.json(channels);
      }else{
        res.status(404);
        res.json({ error: 'No record found' });
      }
    });
  },
  create: function(req, res){
    var params = req.params.all()
    if(params.name){
      Channel.findOneByName(params.name).then(function(channel){
        console.log("Here");
        console.log(channel);
        if(channel === undefined){
          Channel.create({ name: params.name }).then(function(channel){
            if(channel !== undefined){
              res.status(200);
              res.json(channel);
            }else{
              res.status(400);
              res.json({ error: 'Unable to create channel' });
            }
          });
        }else{
          res.status(400);
          res.json({ error: 'Name already taken' });
        }
      });
    }else{
      res.status(400);
      res.json({ error: 'Bad Request : Missing channel name' });
    }
  },
  messages: function(req, res){
    var params = req.params.all()
    Channel.findOne(params.id)
    .then(function(channel){
      if(channel !== undefined){
        Message.find().where({channelId: channel.id})
        .then(function(messages){
          res.status(200);
          res.json(messages);
        })
        .catch(function(err){
          res.status(400);
          res.json({ error: 'Baddddddd shieetttt happened!' });
        })
      }else{
        res.status(404);
        res.json({ error: 'No messages' })
      }
    })
    .catch(function(err){
      res.status(400);
      res.json({ error: 'Baddddddd shieetttt happened!' });
    });
  },
  newMessage: function(req, res){
    var params = req.params.all();
    Channel.findOne(params.id)
    .then(function(channel){
      Message.create({ text: params.text, username: params.username, channelId: channel.id })
      .then(function(message){
        if(message !== undefined){
          res.status(200);
          res.json(message);
        }else{
          res.status(400);
          res.json({error: 'Malformed message! You suck!'});
        }
      })
      .catch(function(err){
        res.status(400);
        res.json({error: 'Malformed message!'})
      })
    });
  }
};


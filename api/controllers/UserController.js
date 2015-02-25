/**
 * UserController
 *
 * @description :: Server-side logic for managing Users
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {
	register: function(req, res){
    var param = req.body.name;
    User.findOne({ name: param }).then(function(user){
      if(user !== undefined){
        res.json({ error:  'User name taken!'})
        res.status(400)
      }else{
        User.create({ name: req.body.name }).then(function(user){
          if(user !== undefined){
            res.json(user);
            res.status(200);
          }else{
            res.json({error: 'Could not create user.'});
            res.status(400);
          }
        }).catch(function(err){
          console.log(err);
          return res.badRequest('Could not make the db request');
        });
      }
    })
    .catch(function(err){
      console.log(err);
      return res.badRequest('Could not make the db request');
    })
  },
  index: function(req, res){
    User.find().limit(20).then(function(data){
      console.log(data);
      res.json(data);
      res.status(200);
    })
  }
};


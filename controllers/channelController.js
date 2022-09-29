const { Channel, User } = require('../models');

module.exports={
    getChannels(req,res){
        Channel.find().then((channels)=>res.json(channels))
    },
    //gets messages sent within a given time of the request (default ten minutes?)
    getMessagesSince(req,res){

    },
    getOneChannel(req,res){
        Channel.findById(req.params.channelId,function(err,channel){
            if(err){
                res.status(500).json(err);
                return;
            }
            !channel
            ? res.status(404).json({ message: 'No channel with that ID' })
            : res.json(channel)
        })
    },
    createChannel(req,res){
        Channel.create(req.body)
        .then((channel) => {
            console.log(channel);
            res.json('Created the channel🎉')
          })
        .catch((err)=> res.status(500).json(err));
    },
}
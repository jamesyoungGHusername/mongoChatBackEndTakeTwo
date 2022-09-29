const router = require('express').Router();
const {
    getChannels,
    createChannel,
} = require('../../controllers/channelController');

router.route('/').get(getChannels).post(createChannel);

module.exports = router;
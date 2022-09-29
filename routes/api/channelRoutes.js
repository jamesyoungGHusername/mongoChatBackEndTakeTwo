const router = require('express').Router();
const {
    getChannels
} = require('../../controllers/channelController');

router.route('/').get(getChannels);

module.exports = router;
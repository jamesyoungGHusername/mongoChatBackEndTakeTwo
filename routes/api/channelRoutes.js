const router = require('express').Router();
const {
    getChannels,
    createChannel,
    addMessage,
    getRecentMessages
} = require('../../controllers/channelController');

router.route('/').get(getChannels).post(createChannel);
router.route('/:channelId/messages').post(addMessage).get(getRecentMessages);

module.exports = router;
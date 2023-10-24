const {connect} = require('amqplib');

const e = require('./emitter');

const apiToPostsQueue = 'api-to-posts';
const postsToApiQueue = 'posts-to-api';
let apiToPostsChannel = null;

let connection = null;

async function getApiToPostsChannel(){
    if(apiToPostsChannel != null)
        return apiToPostsChannel;
    if(connection == null){
        connection = await connect('amqp://rabbitmq');
    }
    apiToPostsChannel = await connection.createChannel();
    await apiToPostsChannel.assertQueue(apiToPostsQueue);
    await apiToPostsChannel.assertQueue(postsToApiQueue);
    apiToPostsChannel.consume(postsToApiQueue, data => {
        apiToPostsChannel.ack(data);
        let {uuid, status, message, payload} = JSON.parse(data.content.toString());
        e.emit(uuid, status, message, payload);
    });
    return apiToPostsChannel;
};

module.exports = {
    apiToPostsQueue,
    getApiToPostsChannel
};





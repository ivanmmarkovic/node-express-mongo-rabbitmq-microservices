import {connect} from 'amqplib';


export const apiToPostsQueue = 'api-to-posts';
export const postsToApiQueue = 'posts-to-api';
let postsToApiChannel = null;

let connection = null;

export async function getPostsToApiChannel(){
    if(postsToApiChannel != null)
        return postsToApiChannel;
    if(connection == null){
        connection = await connect('amqp://rabbitmq');
    }
    postsToApiChannel = await connection.createChannel();
    await postsToApiChannel.assertQueue(apiToPostsQueue);
    await postsToApiChannel.assertQueue(postsToApiQueue);
    
    return postsToApiChannel;
};






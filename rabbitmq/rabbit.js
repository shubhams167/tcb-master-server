const amqp = require("amqplib");

const AMQP_CONN_URL = process.env.AMQP_CONN_URL;

// This worker will publish jobs to the request queue
const PUBLISH_QUEUE_NAME = "request";

// To publish
var publishConnection = null;
var publishChannel = null;

// Open connection for publishing
module.exports.openPublishConnection = async () => {
	try {
        publishConnection = await amqp.connect(AMQP_CONN_URL)
		publishConnection.on('close', (err) => {
			if (err) throw err;
			console.log('[AMQP] Publish connection closed!'); 
		})
		console.log('[AMQP] Publish connection established!');
	}	
    catch (err){
        throw err;
    }
}

// Open channel for publishing
module.exports.openPublishChannel = async () => {
	try {
        publishChannel = await publishConnection.createChannel();
        publishChannel.on('close', (err) => {
			if (err) throw err;
			console.log('[AMQP] Publish channel closed!');
		})
		console.log('[AMQP] Publish channel created!');
	}	
    catch (err){
        throw err;
    }
}

module.exports.publish = async (job) => {
    try {
        await publishChannel.assertQueue(PUBLISH_QUEUE_NAME);
        await publishChannel.sendToQueue(PUBLISH_QUEUE_NAME, Buffer.from(JSON.stringify(job)), {persistent: true});
        console.log(`[AMQP] Job for user ${job.userId} published`);
    }
    catch (err){
        throw err;
    }
}
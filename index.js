const express = require('express');
const app = express();
const http = require('http').createServer(app);
const rabbit = require('./rabbitmq/rabbit');

app.use(express.json());

app.get('/', (req, res, next) => {
	res.status(200).send('I serve a 🤖');
});

app.get('/publish', async (req, res, next) => {
	res.status(200).send({success: true});
});

app.post('/qna', async (req, res, next) => {
	try{
		// Publish request to the queue
		await rabbit.publish(req.body);
		res.status(200).send({success: true, message: 'Job added to the queue'});
	} catch (err){
		console.error(`[AMQP] ${err}`);
		res.status(500).send({success: false, message: 'Something went wrong'});
	}
});

http.listen(3000, async () => {
	console.log('Server listening on port 3000');
	try{
		await rabbit.openPublishConnection();
		await rabbit.openPublishChannel();
	} catch (err) {
		console.error(`[AMQP] ${err}`);
	}
});

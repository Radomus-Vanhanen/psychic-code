const Discord = require('discord.js');
const client = new Discord.Client();

client.once('ready', () => {
	console.log('Ready!');
});

client.on('message', message => {
	if (message.content === '!ping') {
		// send back "Pong." to the channel the message was sent in
		message.channel.send('Pong.');
	}
});

client.login('Njc1MjMwMjI3MjQ4NTc4NjAx.Xj0HJw.ze8j4q4em9RjbcIVrJ1avd3z0fg');


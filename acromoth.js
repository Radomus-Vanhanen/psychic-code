const Discord = require('discord.js');
const client = new Discord.Client();

client.once('ready', () => {
	console.log('Ready!');
});

// COMMAND
client.on("message", message => {
	if (message.content.startsWith("!mdm")) {
		let args = message.content
		message.guild.roles.cache.get("783991612383428609").members.forEach(member => member.send(args))
	}
})

client.login('Njc1MjMwMjI3MjQ4NTc4NjAx.Xj0HJw.ze8j4q4em9RjbcIVrJ1avd3z0fg');


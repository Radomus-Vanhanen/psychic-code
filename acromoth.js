const Discord = require('discord.js');
const client = new Discord.Client();

client.once('ready', () => {
	console.log('Ready!');
});

const guild = client.guilds.cache.get("783979448173199371");

var PeopleInRole = guild.roles.resolve('783991612383428609').members


client.on('message', message => {
	if (message.content === 'dm') {
		for (i = 0; i < PeopleInRole.length; i++) {
			PeopleInRole[i].send("working?")
		  }
	}
});


client.login('Njc1MjMwMjI3MjQ4NTc4NjAx.Xj0HJw.ze8j4q4em9RjbcIVrJ1avd3z0fg');


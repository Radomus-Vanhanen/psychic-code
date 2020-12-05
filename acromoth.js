const Discord = require('discord.js');
const client = new Discord.Client();

client.once('ready', () => {
	console.log('Ready!');
});

// COMMAND
client.on("message", message => {
	if (message.content.startsWith(prefix + "mdm")) {
		const args = message.content.split(" ");
		const roleArgs = args.slice(0, 1);
		const messageArgs = args.slice(1)

		const role = message.guild.roles.find(role => role.name.toLowerCase('messager') === roleArgs.join(" ").toLowerCase())
		if (!role) return message.reply('There is not such a role!');

		for (let i = 0; i < message.guild.members.size; i++) {
			if (message.guild.members[i].roles.has(role.id)) {
				message.guild.members[i].user.send(messageArgs.join(" "))
			}
		}
	}
})

client.login('Njc1MjMwMjI3MjQ4NTc4NjAx.Xj0HJw.ze8j4q4em9RjbcIVrJ1avd3z0fg');


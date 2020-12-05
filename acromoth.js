const Discord = require('discord.js');
const client = new Discord.Client();

client.once('ready', () => {
	console.log('Ready!');
});

// COMMAND
client.on("message", message => {
	var prefix = "!";

if (message.content.startsWith(prefix + "mdm")) {
	//if (!message.member.hasPermission("ADMINISTRATOR")) return

	let args = message.content.split(" ").splice(1)
	var argresult = args.join(' ')
	message.guild.members.cache.forEach(member => {
		if (member.roles.cache.find(r => r.name === "Messager")){
			member.send(`${argresult}\n ${member}`)
		}
   })
}

})

client.login('Njc1MjMwMjI3MjQ4NTc4NjAx.Xj0HJw.ze8j4q4em9RjbcIVrJ1avd3z0fg');


const Discord = require('discord.js');
const client = new Discord.Client();

client.once('ready', () => {
	console.log('Ready!');
});

// COMMAND
client.on("message", message => {
	var prefix = "!";
	//var args = message.content.substring(prefix.length).split (" ");

	client.on('message', message => {
		if (message.content.split(' ')[0] == '/b')
			message.guild.members.cache.forEach( member => {
				if (!message.member.hasPermission("ADMINISTRATOR")) return;
				member.send( `${member} ! ` + "**" + message.guild.name + " : ** " + message.content.substr(3))
				message.delete()
			})
	})

if (message.content.startsWith(prefix + "mdm")) {
	if (!message.member.hasPermission("ADMINISTRATOR")) return

	let args = message.content.split(" ").splice(1)
	var argresult = args.join(' ')
	message.guild.members.cache.forEach(member => {
		if (member.roles.has("Messager")){
			member.send(`${argresult}\n ${member}`)
		}
   })

	if (!args[1]) {
		let embed3 = new Discord.RichEmbed()
		.setDescription(":white_check_mark: | Successfully sent to role.")
		.setColor("#00ff33")
		.setTitle("Message has been sent.")
		.setFooter("For the blade.")
		.setImage("http://bit.ly/36Ske5f")
		message.channel.sendEmbed(embed3)
	} else {
		let embed4 = new Discord.RichEmbed()
		.setDescription(":white_check_mark: | Successfully sent to role.")
		.setColor("#00ff33")
		.setTitle("Message has been sent.")
		.setFooter("For the blade.")

		message.channel.sendEmbed(embed4)
		message.delete()
	}
}

})

client.login('Njc1MjMwMjI3MjQ4NTc4NjAx.Xj0HJw.ze8j4q4em9RjbcIVrJ1avd3z0fg');


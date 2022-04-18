const http = require("http");
const querystring = require("querystring");
const moment = require('moment');
const discord = require("discord.js");
const { Client, Intents } = require('discord.js');
const { MessageEmbed } = require('discord.js');
const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] });
const prefix = process.env.prefix;
try {

  http.createServer(function(req, res) {
    res.write("online");
    res.end();
  }).listen(8080);

  
  client.on('ready', () => {
    const activities = [
      "Read the rules first",
      "Still in development stage",
      "Created by Tail",
      `Latency is ${client.ws.ping} ms`
    ];
    console.log('reloaded');
    setInterval(() => {
      const index = Math.floor(Math.random() * (activities.length - 1) + 1);
      client.user.setActivity(activities[index], {
        type: 'STREAMING',
        url: 'https://www.youtube.com/watch?v=yqyixwqiCag',
      });
    }, 5000)
  });

client.on('messageCreate', message => {
  if (message.channel.type == "dm") return;
  if (!message.content.startsWith(prefix)) return;
  const args = message.content.slice(prefix.length).trim().split(/ +/g);
  const command = args.shift().toLowerCase();
  if (command === "ping") {
    const embed = new MessageEmbed()
      .setTitle("")
      .setURL()
      .setAuthor('Neutron', 'https://i.ibb.co/8XP3hJn/1neutronlogo.png')
      .setDescription(`<:ntimer:931738951373451264> Latency is ${Math.round(client.ws.ping)}ms`)
      .setColor('#5865f2')
      .setThumbnail()
      .setImage()
      .setFooter(`command triggered by ${message.author.username}`, `${message.author.displayAvatarURL()}`)
      .addFields()
      .setTimestamp();
    message.channel.send({ embeds: [embed] });
  }
})


  
client.on('messageCreate', message => {
  if (message.channel.type == "dm") return; 
    if (!message.content.startsWith(prefix)) return;
    const args = message.content.slice(prefix.length).trim().split(/ +/g);
  const command = args.shift().toLowerCase();
  if (command === "server") {
    const embed = new MessageEmbed()
      .setTitle(`Infomation about ${message.guild.name}`)
      .setURL()
      .setAuthor('Neutron', 'https://i.ibb.co/8XP3hJn/1neutronlogo.png')
      .setDescription("")
      .setColor('#5865f2')
      .setThumbnail(`${message.guild.iconURL()}`)
      .setImage()
      .setFooter(`command triggered by ${message.author.username}`, `${message.author.displayAvatarURL()}`)
      .addFields({
        name: '<:ncrown:931724370928357478> Owner',
        value: `<@!${message.guild.ownerID}>`,
        inline: true
      }, {
          name: '<:npeople:931724505678745640> Members',
          value: `${message.guild.memberCount}`,
          inline: true
        }, {
          name: '<:nchat:931724246974074882> Channels',
          value: `${client.channels.cache.size}`,
          inline: true
        }, {
          name: '<:nlabel:931724429166272512> Roles',
          value: `${message.guild.roles.cache.size}`,
          inline: true
        }, {
          name: '<:nheart:931724470400479243> Emojis',
          value: `${message.guild.emojis.cache.size}`,
          inline: true
        }, {
          name: '<:nboosts:931724183317118996> Boosts',
          value: `${message.guild.premiumSubscriptionCount}`,
          inline: true
        }, {
          name: '<:nclock:931724291605659698> Created at',
          value: `${moment.utc(message.guild.createdAt).format("MMM Do YYYY H:mm:ss z")}`
      }
      )
      .setTimestamp();
    message.channel.send({ embeds: [embed] });
  }
})

client.on('messageCreate', (message) => {
  const receivedEmbed = message.embeds[0];

  if (message.author.id == client.user.id) {
    return;
  }
  if (message.author.id == "798638506636607558") {
if (message.embeds[0].description.includes('Hiyokomame0144 joined the queue')) {
  message.guild.channels.cache.get('845342982298927144').send('**Kusomame Joined The Queue,**<@&845346699069358170>');
    }
    return;
  }
});
  
    if (process.env.TOKEN == undefined) {
    console.log("TOKEN NOT SET");
    process.exit(0);
  }
  client.login(process.env.TOKEN);
} catch (e) {
  console.log(e);
}
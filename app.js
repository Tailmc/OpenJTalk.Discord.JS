require('dotenv').config()
const discord = require("discord.js")
const { Client, Intents } = require('discord.js');
const { MessageEmbed } = require('discord.js');
const { joinVoiceChannel, createAudioPlayer, createAudioResource, getVoiceConnection } = require('@discordjs/voice');
const OpenJTalk = require('openjtalk');
const { toHiragana, toKatakana } = require('@koozaki/romaji-conv');
const fs = require('fs');
const hound = require('hound')
const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_VOICE_STATES] });
const data = fs.readFileSync('db.json', 'utf-8');
const parseddata = JSON.parse(data)
const prefix = process.env.prefix;
const mei = new OpenJTalk();
const watcher = hound.watch('.')

try {
    client.on('ready', () => {
        const activities = [
            "@discordjs/voice",
            "Discord.js",
            "Dotenv",
            "FFMPEG-static",
            "OpenJTalk",
            "Libsodium-wrappers",
            "@koozaki/romaji-conv",
            "Hound"
        ];
        console.log('reloaded');
        setInterval(() => {
            const index = Math.floor(Math.random() * (activities.length - 1) + 1);
            client.user.setActivity(activities[index], {
                type: 'STREAMING',
                url: 'https://www.youtube.com/watch?v=2xx_2XNxxfA',
            });
        }, 2500)
    });

    client.on('messageCreate', message => {
        if (message.channel.type == "dm") return;
        const args = message.content.slice(prefix.length).trim().split(/ +/g);
        const command = args.shift().toLowerCase();
        if (command === "ping" && message.content.startsWith(prefix)) {
            const embed = new MessageEmbed()
                .setTitle("")
                .setURL()
                .setAuthor({ name: 'Tails Utils', iconURL: 'https://i.ibb.co/8XP3hJn/1neutronlogo.png' })
                .setDescription(`:timer: Latency is ${Math.round(client.ws.ping)}ms`)
                .setColor('#B88F69')
                .setThumbnail()
                .setImage()
                .setFooter({ text: `command triggered by ${message.author.username}`, iconURL: `${message.author.displayAvatarURL()}` })
                .addFields()
                .setTimestamp();
            message.channel.send({ embeds: [embed] });
        }
        if (command === "help" && message.content.startsWith(prefix)) {
            const embed = new MessageEmbed()
                .setTitle("")
                .setURL()
                .setAuthor({ name: 'Tails Utils', iconURL: 'https://i.ibb.co/8XP3hJn/1neutronlogo.png' })
                .setDescription(`:question: commands are help, ping, tts, leave`)
                .setColor('#B88F69')
                .setThumbnail()
                .setImage()
                .setFooter({ text: `command triggered by ${message.author.username}`, iconURL: `${message.author.displayAvatarURL()}` })
                .addFields()
                .setTimestamp();
            message.channel.send({ embeds: [embed] });
        }
        if (command === "tts" && message.content.startsWith(prefix)) {
            if (message.member.voice.channelId !== null) {
                const connection = joinVoiceChannel({
                    channelId: message.member.voice.channelId,
                    guildId: message.guildId,
                    adapterCreator: message.member.voice.channel.guild.voiceAdapterCreator,
                });
                let datatoadd = {
                    server: message.guildId,
                    channel: message.channelId
                }
                message.channel.send(":green_circle: Connected to the voice channel");
                let obj = parseddata.find(function (i) {
                    return i.server === message.guildId
                })
                let found = parseddata.findIndex(elem => {
                    return elem === obj
                })
                if (found > -1) {
                    parseddata.splice(found, 1)
                }
                parseddata.push(datatoadd)
                fs.writeFile('db.json', JSON.stringify(parseddata), 'utf-8', (err) => {
                    if (err) {
                        console.log(err)
                    }
                })
            } else {
                message.channel.send(":warning: You're not connected to a voice channel");
                return;
            }
        }
        if (command === "leave" && message.content.startsWith(prefix) && message.guild.me.voice.channelId !== null) {
            const connection = getVoiceConnection(message.guild.id)
            connection.destroy();
            message.channel.send(":red_circle: Connection destroyed")
        }

        if (message.guild.me.voice.channelId !== null) {
            let current = parseddata.find(function (i) {
                return i.server === message.guildId
            })
            let currentchannel = current.channel
            if (!message.content.startsWith(prefix) && !message.content.startsWith('http') && !message.author.bot && currentchannel === message.channelId) {
                mei.talk(toHiragana(message.content));
                watcher.on('create', function(file, stats) {
                    const connection = getVoiceConnection(message.guild.id)
                    const player = createAudioPlayer()
                    connection.subscribe(player)
                    const resource = createAudioResource(file)
                    player.play(resource)
                })
            }
        }
    });

    if (process.env.TOKEN == undefined) {
        console.log("undefined token");
        process.exit(0);
    }
    client.login(process.env.TOKEN);
} catch (e) {
    console.log(e);
}

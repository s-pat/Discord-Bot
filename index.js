const Discord = require("discord.js");
const TOKEN = " "; //youtube auth token required here
const PREFIX = "!";

const YTDL = require('ytdl-core');




function play(connection, message) {
    var server = servers[message.guild.id];
    server.dispatcher = connection.playStream(YTDL(server.queue[0], { filter: "audioonly" }));
    server.queue.shift;
    server.dispatcher.on("end");
    if (server.queue[0]) play(connection, message);
    else connection.disconnect();
}


var bot = new Discord.Client();

var servers = {}



bot.on("ready",function(){
    console.log("Ready");
});


bot.on("message", function (message) {
    if (message.author.equals(bot.user)) return;


    if (!message.content.startsWith(PREFIX)) return;

    var args = message.content.substring(PREFIX.length).split(" ");

    switch (args[0].toLowerCase()) {
        case "ping":
            message.channel.sendMessage("pong(just used to test bot)");
            break;
        case "info":
            message.channel.sendMessage("Kana's bot.");
            break; ``
        case "yikes":
            message.channel.send("yikes", {
                file: "./images/stevey.png"
            });
            break;
        case "commands":
            var embed = new Discord.RichEmbed().addField("!yikes", "yikes png").addField("!play + yt link", "plays audio from youtubelink").addField("!skip", "skip song").addField("!stop", "stops music")
            message.channel.sendEmbed(embed);
            break;
        case "play":
    

            if (!args[1]) {
                message.channel.sendMessage("Please insert a Link");
                return;
            }
            if (!message.member.voiceChannel) {
                message.channel.sendMessage("Join a voice chat to use this function.");
                return;
            }
            if (!servers[message.guild.id]) servers[message.guild.id] = {
                queue: []
            };
            var server = servers[message.guild.id];
            server.queue.push(args[1]);

            if (!message.guild.voiceConnection) message.member.voiceChannel.join().then(function(connection) {
                play(connection, message);
            });
            break;
        case "skip":
            var server = servers[message.guild.id];
            if (server.dispatcher) server.dispatcher.end();
            break;
        case "stop":
            var server = servers[message.guild.id];
            if (message.guild.voiceConnection) message.guild.voiceConnection.disconnect();
            break;
        case "test":

            break;
        default:
            message.channel.sendMessage("Invalid Command.");
       

    }//end of switch




});

bot.login(TOKEN);



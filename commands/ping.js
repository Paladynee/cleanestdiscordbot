const Discord = require('discord.js');

module.exports = {

    data: {
        name: "ping",
        dev: false,
        args: false,
        guild: false,
        alias: [],
    },

    /**@param {Discord.Message} message @param {string[]} args*/

    async execute(message) {

        // command.execute

        await message.reply(`\`🕒 WebSocket Ping: ${message.client.ws.ping}ms\``);

    },

}
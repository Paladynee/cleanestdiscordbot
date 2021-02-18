const Discord = require('discord.js');

module.exports = {

    data: {
        name: "eval",
        dev: true,
        args: true,
        guild: false,
        alias: ["e"],
    },

    /**@param {Discord.Message} message @param {string[]} args*/

    async execute(message, args) {

        // command.execute

        let code = message.content.split(' ').splice(1).join(' ');
        try {
            const evaled = eval(code);
            await message.reply(`${evaled}`, { code: 'xl' });
        } catch (e) {
            message.reply(`Error: ${e}`, { code: 'xl' });
            return;
        }

    },

}
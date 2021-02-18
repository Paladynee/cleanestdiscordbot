const Discord = require('discord.js');

module.exports = {

    data: {
        name: "kick",
        dev: false,
        args: true,
        guild: true,
        alias: [],
    },

    /**@param {Discord.Message} message @param {string[]} args*/

    async execute(message, args) {

        // command.execute

        if (!message.member.hasPermission('KICK_MEMBERS')) return message.reply('Unknown command.');


        let target = message.mentions.members.first();
        if (!target) return message.reply(`You didn't specify a member to kick.`);
        if (!target.kickable) return message.reply(`I cannot kick that member.`);
        let b = args.splice(1);
        let reason = b.length ? b.join(' ') : "reason not specified";
        try {   
            await target.kick(reason);
        } catch (e) {
            console.log(e);
            message.reply(`There was an error trying to kick that member.`);
            return;
        }
        return message.reply(`I have successfully kicked \`${target.displayName}\` from \`${message.guild.name}\` because of \`${reason}\`.`);

    },

}
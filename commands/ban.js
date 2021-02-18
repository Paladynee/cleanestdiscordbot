const Discord = require('discord.js');

module.exports = {

    data: {
        name: "ban",
        dev: false,
        args: true,
        guild: true,
        alias: [],
    },

    /**@param {Discord.Message} message @param {string[]} args*/

    async execute(message, args) {

        // command.execute

        if (!message.member.hasPermission('BAN_MEMBERS')) return reply('Unknown command.');

        let target = message.mentions.members.first();
        if (!target) return message.reply(`You didn't specify a member to ban.`);
        if (!target.bannable) return message.reply(`I cannot ban that member.`);
        let b = args.splice(1);
        let reason = b.length ? b.join(' ') : "reason not specified";
        try {
            await target.ban(reason);
        } catch (e) {
            console.log(e);
            message.reply(`There was an error trying to ban that member.`);
            return;
        }
        return message.reply(`I have successfully banned \`${target.displayName}\` from \`${message.guild.name}\` because of \`${reason}\`.`);

    },

}
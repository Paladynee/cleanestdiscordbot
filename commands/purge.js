const Discord = require('discord.js');

module.exports = {

    data: {
        name: "purge",
        dev: false,
        args: true,
        guild: true,
        alias: ["prune"],
    },

    /**@param {Discord.Message} message @param {string[]} args*/

    async execute(message, args) {

        // command.execute

        if (!message.member.hasPermission('MANAGE_MESSAGES')) return message.reply('Unknown command.');

        let count = args[0];
        if (isNaN(count)) return message.reply('Invalid argument.');
        if (count < 1) return message.reply('Invalid argument.');
        if (count > 1000) return message.reply("You can't purge more than 1000 messages at one time.");
        let totalpurges = 0;
        try {
            let t = await message.channel.messages.fetch({ limit: 99 });
            if (t.size === 0) return message.reply(`There were no messages to purge.`);
            if (count > 99) {
                while (count > 99) {
                    let messages = await message.channel.messages.fetch({ limit: 99 });
                    if (messages.size === 0) return message.reply(`Successfully purged \`${totalpurges}\` messages from \`${message.channel.name}\`.`);
                    await message.channel.bulkDelete(messages);
                    count -= 99;
                    totalpurges += messages.size;
                }
                let messages = await message.channel.messages.fetch({ limit: count });
                if (messages.size === 0) return message.reply(`Successfully purged \`${totalpurges}\` messages from \`${message.channel.name}\`.`);
                await message.channel.bulkDelete(messages);
                totalpurges += messages.size;
            } else {
                let messages = await message.channel.messages.fetch({ limit: count });
                if (messages.size === 0) return message.reply(`Successfully purged \`${totalpurges}\` messages from \`${message.channel.name}\`.`);
                await message.channel.bulkDelete(messages);
                totalpurges += messages.size;
            }
        } catch (e) {
            console.log(e);
            message.reply(`There was an issue trying to purge messages.\nError: ${e}`);
        }
        message.reply(`Successfully purged \`${totalpurges}\` messages from \`${message.channel.name}\`.`);
    },

}
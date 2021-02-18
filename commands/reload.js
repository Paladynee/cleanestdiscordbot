const Discord = require('discord.js');
const { prefix } = require('../config.json');
const fs = require('fs');
const example = require('./example.js');

module.exports = {

    data: {
        name: "reload",
        dev: true,
        args: true,
        guild: false,
        alias: ["rm", "refresh"],
    },

    /**@param {Discord.Message} message @param {Discord.Collection<string, example>} commands*/

    async execute(message, commands) {

        // command.execute

        const args = message.content.slice(prefix.length).trim().split(/ +/);
        args.shift();
        let firstArg = args[0].toLowerCase();
        if (firstArg === "all") {
            let commandFiles = fs.readdirSync("./commands").filter((file) => file.endsWith(".js"));
            let newCommandsCollection = new Discord.Collection();
            for (const file of commandFiles) {
                delete require.cache[require.resolve(`./${file}`)];
                const newCommandName1 = require(`./${file}`);
                newCommandsCollection.set(newCommandName1.data.name, newCommandName1);
            }
            message.reply(`Successfully reloaded ALL modules. :white_check_mark::white_check_mark::white_check_mark:`);
            return newCommandsCollection;
        }
        let command = commands.get(firstArg) || commands.find((cmd) => cmd.data.alias && cmd.data.alias.includes(firstArg));

        if (!command) return void message.reply(`Error: Couldn't find module \`${firstArg}\`. :no_entry_sign:`);

        let old = command;

        try {
            require(`./${command.data.name}`);
        } catch (e) {
            console.error(error);
            message.channel.send(`:no_entry_sign::no_entry_sign::no_entry_sign: Error : There was an error while reloading module \`${command.data.name}\`: \`${error.message}\``)
            require.cache[require.resolve(`./${old.data.name}`)] = old;
            return;
        }

        delete require.cache[require.resolve(`./${command.data.name}.js`)];
        const newCommand = require(`./${command.data.name}.js`);
        commands.set(newCommand.data.name, newCommand);
        message.reply(`Successfully reloaded module \`${firstArg}\`. :white_check_mark:`);
        return commands;

    },

}

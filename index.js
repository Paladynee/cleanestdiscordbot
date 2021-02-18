const { token, owner: ownerID, prefix } = require('./config.json');
const Discord = require('discord.js');
const fs = require('fs');
const client = new Discord.Client();
const example = require('./commands/example.js');
/**@type {Discord.Collection<string, example>}*/
const commandFiles = fs.readdirSync('./commands').filter((file) => file.endsWith('.js'));
const l = console.log;
let commands = new Discord.Collection();

for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    if (command && command.data && command.data.name !== undefined && command.data.name === '') {
        delete require.cache[require.resolve(`./commands/${file}`)];
    } else {
        commands.set(command.data.name, command)
    };
}

client.once('ready', async () => {
    console.log(`LOGGED IN AS ${client.user.tag.toUpperCase()}.`);
});

client.on('message', async (message) => {
    if (message.author.bot || message.webhookID || !message.author || !message.content || message.system) return;
    if (!message.content.startsWith(prefix)) return;

    const args = message.content.slice(prefix.length).trim().split(/ +/);
    const commandName = args.shift().toLowerCase();
    const ownerUser = client.users.cache.get(ownerID);

    try {
        if (!commands.has(commandName) && !commands.find((cmd) => cmd.data.alias && cmd.data.alias.includes(commandName))) return await message.channel.send('Unknown command.');
    } catch (e) { console.log(e); }

    /**
     * @type {example}
     */

    const command = commands.get(commandName) || commands.find((cmd) => cmd.data.alias && cmd.data.alias.includes(commandName));

    try {
        if (command.data.dev && message.author.id !== ownerID) return await message.reply('Unknown command.');
        if (command.data.guild && !message.guild) return await message.reply(`This command is only available in servers.\nIf you think this is an error, please contact ${ownerUser.tag}.`);
        if (command.data.args && !args.length) return await message.reply(`Invalid arguments.`);
    } catch (e) { console.log(e); }

    if (command.data.name === 'reload') {
        try {
            let toBeCommands = await command.execute(message, commands);
            if (!toBeCommands) return;
            commands = toBeCommands;
        } catch (ERR) {
            console.log(ERR);
            try {
                await message.reply(`There was an error executing command \`${command.data.name}\`.\nPlease contact \`${ownerUser.tag}\` and send them this message:\n\`${ERR}\``);
            } catch (e) { console.log(err); }
        }
        return;
    }

    try {
        await command.execute(message, args);
    } catch (ERR) {
        console.log(ERR);
        try {
            await message.reply(`There was an error executing command \`${command.data.name}\`.\nPlease contact \`${ownerUser.tag}\` and send them this message:\n\`${ERR}\``);
        } catch (e) { console.log(err); }
    }
});

client.login(token);
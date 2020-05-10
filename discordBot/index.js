const Commando = require('discord.js-commando');
const path = require('path');
const sails = require('sails');
const handleRoleUpdate = require('./roles/handleRoleUpdate.js');
const DiscordMessageHandler = require('../api/hooks/economy/objects/discordMessageHandler.js');

/**
 * @module DiscordBot
 * @description a Sails project hook. Integrates a discord bot to the system
 * @param {*} sails Global sails instance
 */

const discordMessageHandler = new DiscordMessageHandler()


/**
 * @module DiscordCommands
 * @description Command guide for users
 */
if (!process.env.DISCORDBOTTOKEN) {
  sails.log.warn(`No Discord bot token was given, not logging in. This is probably not what you wanted!`);
}

sails.lift({hooks: { grunt: false }}, async function (err) {
  sails.log.info('Initializing custom hook (`discordBot`)');
  client = new Commando.Client({
    owner: sails.config.custom.botOwners,
    unknownCommandResponse: false
  });

    // Register custom embed messages

  client.customEmbed = require('./util/createEmbed').CustomEmbed;
  client.errorEmbed = require('./util/createEmbed').ErrorEmbed;

  // Register some stuff in the registry... yeah..
  client.registry
    .registerGroups([
      ['sdtd', '7 Days to die'],
      ['meta', 'Commands about the system']
    ])
    .registerDefaults()
    .registerCommandsIn(path.join(__dirname, 'commands'));

  // Listeners

  client.on('commandError', (command, error) => {
    sails.log.error(`Command error! ${command.memberName} trace: ${error.stack}`);
  });

  client.on('ready', () => {
    sails.log.info(`Connected to Discord as ${client.user.tag} - ${client.guilds.size} guilds`)
    // try {
    //   let enabledServers = await SdtdConfig.find({
    //     inactive: false,
    //     or: [{
    //       chatChannelId: {
    //         '!=': ''
    //       }
    //     }]
    //   }).populate('config');

    //   for (const serverConfig of enabledServers) {
    //     try {
    //       await start(serverConfig.server);
    //     } catch (error) {
    //       sails.log.error(`HOOK - DiscordChatBridge:initialize - Error for server ${serverConfig.server} - ${error}`)
    //     }
    //   }
    //   sails.log.info(`HOOK SdtdDiscordChatBridge:initialize - Initialized ${chatBridgeInfoMap.size} chatbridge(s)`);
    //   /// adasd

    //   let textChannel = discordClient.channels.get(config.chatChannelId);

    //   if (_.isUndefined(textChannel)) {
    //     return;
    //   }

    //   let chatBridge = new ChatBridgeChannel(textChannel, server);
    //   setChatBridge(serverId, chatBridge)
    //   return;
    // } catch (error) {
    //   sails.log.error(`HOOK SdtdDiscordChatBridge:start - ${error}`);
    //   throw error;
    // }
  });

  client.on('commandRun', (command, promise, message) => {
    sails.log.info(`Command ${command.name} ran by ${message.author.username} on ${message.guild ? message.guild.name : 'DM'} - ${message.content}`);
  });

  client.on('error', error => {
    sails.log.error(`DISCORD ERROR - ${error.message}`);
  });

  client.on('disconnect', e => {
    sails.log.error(`Discord disconnected with code ${e.code} - ${e.reason}`)
  });

  client.on('reconnecting', () => {
    sails.log.warn(`Discord reconnecting to webhook`);
  });

  client.on('warn', (msg) => {
    sails.log.warn(`Discord bot warning: ${msg}`);
  })

  client.on('rateLimit', info => {
    sails.log.warn(`Discord API rateLimit reached! ${info.limit} max requests allowed to ${info.method} ${info.path}`);
  });

  client.on('guildMemberUpdate', (oldMember, newMember) => {

    try {
      handleRoleUpdate(oldMember, newMember)
    } catch (error) {
      sails.log.error(`Error handling role change`, error)
    }

  });

  client.on("message", (message) => {
    sendMessageToGame(client, message);
  });


  // Login
  client.login(sails.config.custom.botToken).then(() => {
      initializeGuildPrefixes();


      // Rotate presence with stats info
      client.setInterval(async function () {
        let statsInfo = await sails.helpers.meta.loadSystemStatsAndInfo();
        let randomNumber = Math.trunc(Math.random() * 3);

        let presenceTextToSet = `$info | `

        switch (randomNumber) {
          case 0:
            presenceTextToSet += `Servers: ${statsInfo.servers}`
            break;
          case 1:
            presenceTextToSet += `Players: ${statsInfo.players}`
            break;
          case 2:
            presenceTextToSet += `Guilds: ${statsInfo.guilds}`
            break;
          case 3:
            presenceTextToSet += `Uptime: ${statsInfo.uptime}`
            break;

          default:
            break;
        }

        client.user.setPresence({
          game: {
            name: presenceTextToSet
          }
        })
      }, 60000)

    })
    .catch((err) => {
      sails.log.error(err);
    });
});

async function initializeGuildPrefixes() {
  let serversWithDiscordEnabled = await SdtdConfig.find({
    discordGuildId: {
      '!=': ['']
    }
  })

  serversWithDiscordEnabled.forEach(serverConfig => {
    let guild = client.guilds.get(serverConfig.discordGuildId);
    if (guild) {
      guild.commandPrefix = serverConfig.discordPrefix;
    }
  })

}

async function sendMessageToGame(client, channelId, message) {
  if (message.author.bot) {
    // bots dont get broadcasted
    return;
  }

  if (message.content.startsWith(message.guild.commandPrefix)) {
    // commands dont need to goto server
    return;
  }

  if (message.author.id === client.user.id) {
    // dont send the bot itselfs messages
    return
  }

  const config = await SdtdConfig.find({
    chatChannelId: channelId
  }).populate('server');

  if (!config) {
    // wrong channel
    return;
  }

  try {
    await sails.helpers.commands.sendMessage(config.server.id, `[${message.author.username}]: ${message.cleanContent}`)
    return true;
  } catch {
    sails.log.error(`HOOK discordBot:chatBridgeChannel - sending discord message to game`, error);
    message.react("⚠");
  }
}

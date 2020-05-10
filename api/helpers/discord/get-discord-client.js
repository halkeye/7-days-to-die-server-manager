const _ = require('lodash');
const Discord = require('discord.js');
const botClient = new Discord.Client();

/* minimum steps it takes to not need to login/use websocket */
botClient.token = process.env.DISCORDBOTTOKEN;
botClient.user = { bot: true };

class DiscordClientWrapper {
  async getMutualGuilds(user) {
    const userClient = new Discord.Client();
    userClient.token = `Bearer ${user.discordAccessToken}`;
    userClient.user = { bot: false };

    return Promise.all([
      userClient.rest.makeRequest('get', Discord.Constants.Endpoints.User('@me') + '/guilds', true),
      botClient.rest.makeRequest('get', Discord.Constants.Endpoints.User('@me') + '/guilds', true)
    ]).then(guilds => _.intersectionBy(...guilds, g => g.id));
  }

  async getChannels(guildId) {
    const endpoint = Discord.Constants.Endpoints.Guild(guildId) + '/channels';
    return botClient.rest.makeRequest('get', endpoint, true).then(channels => channels.filter(channel => channel.type === Discord.Constants.ChannelTypes.TEXT));
  }
}

  /*
      getGuilds: async function() {
        const endpoint = Discord.Constants.Endpoints.User('@me') + '/guilds';
        return botClient.rest.makeRequest('get', endpoint, true);
      },
      getGuild: async function (serverId, guildId) {
        const endpoint = Discord.Constants.Endpoints.User('@me').Guild(guildId);
        return botClient.rest.makeRequest('get', endpoint, true);
      }
    }
    */
module.exports = {
  friendlyName: 'Gets the discord client',
  sync: true,
  inputs: {
  },
  exits: {
  },

  fn: function (inputs, exits) {
    return exits.success(new DiscordClientWrapper());
  },
};

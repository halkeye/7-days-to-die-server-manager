module.exports = {


  friendlyName: 'Find channels the bot can write in for a guild ID',


  description: '',


  inputs: {
    guildId: {
      example: '1337',
      required: true
    }

  },

  exits: {
    badRequest: {
      responseType: 'badRequest'
    }
  },

  /**
   * @memberof SdtdServer
   * @method
   * @name find-writeable-channels-in-guild
   * @param {string} guildId
   * @returns {array}
   */

  fn: async function (inputs, exits) {

    try {

      const client = sails.helpers.discord.getDiscordClient();
      const foundChannelsArray = await client.getChannels(inputs.guildId); // FIXME - this will allow anyone to look up any guildId

      // let userPerms = channel.permissionsFor(discordClient.user)
      // return (userPerms.has('SEND_MESSAGES') && userPerms.has('EMBED_LINKS') && userPerms.has('VIEW_CHANNEL'))

      sails.log.debug(`API - SdtdServer:find-writeable-channels-in-guild - Found ${foundChannelsArray.length} channels for guild ${inputs.guildId}!`);
      exits.success(foundChannelsArray.map(channel => {
        return {
          id: channel.id,
          name: channel.name
        }
      }));
    } catch (error) {
      sails.log.error(`API - SdtdServer:find-writeable-channels-in-guild - ${error}`);
      return exits.error(error);
    }

  }


};

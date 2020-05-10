module.exports = {

  friendlyName: 'Set discord guild',

  description: 'Set the discordGuildId for a SdtdServer',

  inputs: {
    discordGuildId: {
      required: true,
      type: 'string'
    },
    serverId: {
      required: true,
      type: 'string'
    }
  },

  exits: {
    success: {},
    badGuild: {
      responseType: 'badRequest'
    },
    notFound: {
      responseType: 'notFound'
    }
  },


  fn: async function (inputs, exits) {

    try {
      let server = await SdtdServer.findOne(inputs.serverId).populate('owner');
      if (!server || !server.owner){
        return exits.notFound()
      }

      let foundUser = server.owner;
      if (!foundUser.discordId) {
        return exits.notFound()
      }

      if (inputs.discordGuildId === "0" ) {
        await SdtdConfig.update({
          server: inputs.serverId
        }, {
          discordGuildId: inputs.discordGuildId
        });
        return exits.success();
      }

      const client = sails.helpers.discord.getDiscordClient();
      const foundGuilds = await client.getMutualGuilds(foundUser);
      if (!foundGuilds.find(guild => guild.id === inputs.discordGuildId)) {
        return exits.badGuild();
      }

      await SdtdConfig.update({
        server: inputs.serverId
      }, {
        discordGuildId: inputs.discordGuildId
      });

      sails.log.info(`API - SdtdServer:set-discord-guid - set guild ${inputs.discordGuildId} for server ${inputs.serverId}`);
      return exits.success();
    } catch (error) {
      sails.log.error(`API - SdtdServer:set-discord-guid - ${error}`);
      return exits.error(error);
    }
  }
};

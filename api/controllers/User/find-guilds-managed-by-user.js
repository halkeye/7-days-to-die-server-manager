module.exports = {


    friendlyName: 'Find guilds managed by user',


    description: '',


    inputs: {
      userId: {
        required: true,
        example: '1337'
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
       * @name find-guilds-managed-by-user
       * @param {number} userId
       * @returns {array}
       */

    fn: async function (inputs, exits) {
      try {
        let foundUser = this.req.user || await User.findOne(inputs.userId);
        if (!foundUser.discordId) {
          return exits.badRequest();
        }
        const client = sails.helpers.discord.getDiscordClient();
        const foundGuilds = await client.getMutualGuilds(foundUser);
        sails.log.debug(`API - SdtdServer:find-guilds-managed-by-user - Found ${foundGuilds.length} guilds for user ${foundUser.id}!`);
        return exits.success(foundGuilds);
      } catch (error) {
        console.log(error);
        sails.log.error(`API - SdtdServer:find-guilds-managed-by-user - ${error}`);
        return exits.error(error);
      }

    }


  };


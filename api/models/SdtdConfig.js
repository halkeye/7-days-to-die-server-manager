/**
 * SdtdConfig.js
 *
 * @description Persistent configuration per server for system features
 * @module SdtdConfig
 */

module.exports = {
  afterCreate(newConfig, cb) {
    sails.hooks.sdtdlogs
      .start(newConfig.server)
      .then(r => {
        let modules = [];
        modules.push(sails.hooks.customhooks.start(newConfig.server));
        modules.push(
          sails.hooks.historicalinfo.start(newConfig.server, "memUpdate")
        );
        Promise.all(modules)
          .then(r => {
            cb(undefined, r);
          })
          .catch(e => cb(e));
      })
      .catch(e => {
        sails.log.error(e);
        return cb(e);
      });
  },

	connection: 'sequalize',
  attributes: {
    //When a server does not respond to requests for a long time, it is set to inactive.
    inactive: {
      type: Sequelize.BOOLEAN,
      defaultsTo: false
    },

    //  _______             _    _
    // |__   __|           | |  (_)
    //    | |_ __ __ _  ___| | ___ _ __   __ _
    //    | | '__/ _` |/ __| |/ / | '_ \ / _` |
    //    | | | | (_| | (__|   <| | | | | (_| |
    //    |_|_|  \__,_|\___|_|\_\_|_| |_|\__, |
    //                                    __/ |
    //                                   |___/

    inventoryTracking: {
      type: Sequelize.BOOLEAN,
      defaultsTo: false
    },

    locationTracking: {
      type: Sequelize.BOOLEAN,
      defaultsTo: false
    },

    // ______
    // |  ____|
    // | |__   ___ ___  _ __   ___  _ __ ___  _   _
    // |  __| / __/ _ \| '_ \ / _ \| '_ ` _ \| | | |
    // | |___| (_| (_) | | | | (_) | | | | | | |_| |
    // |______\___\___/|_| |_|\___/|_| |_| |_|\__, |
    //                                         __/ |
    //                                        |___/

    economyEnabled: {
      type: Sequelize.BOOLEAN,
      defaultsTo: false
    },

    currencyName: {
      type: Sequelize.STRING,
      defaultsTo: "dolla dolla billz"
    },

    killEarnerEnabled: {
      type: Sequelize.BOOLEAN,
      defaultsTo: false
    },

    zombieKillReward: {
      type: Sequelize.INTEGER,
      min: 0,
      defaultsTo: 1
    },

    playerKillReward: {
      type: Sequelize.INTEGER,
      min: 0,
      defaultsTo: 20
    },

    playtimeEarnerEnabled: {
      type: Sequelize.BOOLEAN,
      defaultsTo: false
    },

    playtimeEarnerInterval: {
      type: Sequelize.INTEGER,
      defaultsTo: 5
    },

    playtimeEarnerAmount: {
      type: Sequelize.INTEGER,
      defaultsTo: 1
    },

    discordTextEarnerEnabled: {
      type: Sequelize.BOOLEAN,
      defaultsTo: false
    },

    discordTextEarnerAmountPerMessage: {
      type: Sequelize.INTEGER,
      defaultsTo: 0.1
    },

    // How much seconds have to be between messages for a player to get rewarded
    discordTextEarnerTimeout: {
      type: Sequelize.INTEGER,
      defaultsTo: 3
    },

    discordTextEarnerIgnoredChannels: {
      type: Sequelize.JSON,
      defaultsTo: []
    },

    costToTeleport: {
      type: Sequelize.INTEGER,
      defaultsTo: 1
    },

    costToSetTeleport: {
      type: Sequelize.INTEGER,
      defaultsTo: 15
    },

    costToMakeTeleportPublic: {
      type: Sequelize.INTEGER,
      defaultsTo: 25
    },

    costToUseGimme: {
      type: Sequelize.INTEGER,
      defaultsTo: 50
    },

    //   _____                                          _
    //  / ____|                                        | |
    // | |     ___  _ __ ___  _ __ ___   __ _ _ __   __| |___
    // | |    / _ \| '_ ` _ \| '_ ` _ \ / _` | '_ \ / _` / __|
    // | |___| (_) | | | | | | | | | | | (_| | | | | (_| \__ \
    //  \_____\___/|_| |_| |_|_| |_| |_|\__,_|_| |_|\__,_|___/

    /**
     * @memberof SdtdConfig
     * @var {boolean} commandsEnabled
     * @description Whether or not ingame commands are enabled
     * @default false
     */

    commandsEnabled: {
      type: Sequelize.BOOLEAN,
      defaultsTo: false
    },

    /**
     * @memberof SdtdConfig
     * @var {string} commandPrefix
     * @description Command prefix to use ingame
     */

    commandPrefix: {
      type: Sequelize.STRING,
      defaultsTo: "$"
    },

    enabledCallAdmin: {
      type: Sequelize.BOOLEAN,
      defaultsTo: false
    },

    enabledPlayerTeleports: {
      type: Sequelize.BOOLEAN,
      defaultsTo: true
    },

    enabledWho: {
      type: Sequelize.BOOLEAN,
      defaultsTo: false
    },

    enabledGimme: {
      type: Sequelize.BOOLEAN,
      defaultsTo: false
    },

    maxPlayerTeleportLocations: {
      type: Sequelize.INTEGER,
      defaultsTo: 3
    },

    playerTeleportDelay: {
      type: Sequelize.INTEGER,
      defaultsTo: 15,
      min: 0
    },

    playerTeleportTimeout: {
      type: Sequelize.INTEGER,
      defaultsTo: 60,
      min: 0
    },

    gimmeCooldown: {
      type: Sequelize.INTEGER,
      defaultsTo: 30,
      min: 0
    },

    // _____  _                       _
    // |  __ \(_)                     | |
    // | |  | |_ ___  ___ ___  _ __ __| |
    // | |  | | / __|/ __/ _ \| '__/ _` |
    // | |__| | \__ \ (_| (_) | | | (_| |
    // |_____/|_|___/\___\___/|_|  \__,_|

    discordPrefix: {
      type: Sequelize.STRING,
      defaultsTo: "$"
    },

    /**
     * @memberof SdtdServer
     * @var {string} discordGuildId
     * @description Id of the disccord guild this server is associated with
     */

    discordGuildId: {
      type: Sequelize.STRING
    },

    /**
     * @memberof SdtdServer
     * @var {string} chatChannelId
     * @description Id of the discord channel for chat bridge
     */

    chatChannelId: {
      type: Sequelize.STRING
    },

    /**
     * @memberof SdtdServer
     * @var {string} chatChannelRichMessages
     * @description Whether to use rich messages for (dis)connect messages
     */

    chatChannelRichMessages: {
      type: Sequelize.BOOLEAN,
      defaultsTo: true
    },

    /**
     * @memberof SdtdServer
     * @var {string} chatChannelGlobalOnly
     * @description Whether to only send messages sent in the global channel (excluding party chat)
     */

    chatChannelGlobalOnly: {
      type: Sequelize.BOOLEAN,
      defaultsTo: false
    },

    /**
     * @memberof SdtdServer
     * @var {string} chatChannelBlockedPrefixes
     * @description Block messages starting with a certain prefix from chat bridge
     */

    chatChannelBlockedPrefixes: {
      type: Sequelize.JSON,
      defaultsTo: new Array("/", "!")
    },

    discordNotificationConfig: {
      type: Sequelize.JSON,
      defaultsTo: {
        systemboot: "",
        playerConnected: "",
        playerDisconnected: "",
        connectionLost: "",
        connected: ""
      }
    },

    //   _____ ____  _
    //   / ____|  _ \| |
    //  | |  __| |_) | |
    //  | | |_ |  _ <| |
    //  | |__| | |_) | |____
    //   \_____|____/|______|

    // How many bans a player must have before triggering the discord notification
    gblNotificationBans: {
      type: Sequelize.INTEGER,
      defaultsTo: 3
    },

    gblAutoBanEnabled: {
      type: Sequelize.BOOLEAN,
      defaultsTo: false
    },

    // How many bans a player must have before triggering the auto ban
    gblAutoBanBans: {
      type: Sequelize.INTEGER,
      defaultsTo: 5
    },

    //   _                       _
    //  | |                     (_)
    //  | |     ___   __ _  __ _ _ _ __   __ _
    //  | |    / _ \ / _` |/ _` | | '_ \ / _` |
    //  | |___| (_) | (_| | (_| | | | | | (_| |
    //  |______\___/ \__, |\__, |_|_| |_|\__, |
    //                __/ | __/ |         __/ |
    //               |___/ |___/         |___/

    /**
     * @memberof SdtdConfig
     * @var {boolean} loggingEnabled
     * @description Whether or not logging is enabled
     * @default true
     */

    loggingEnabled: {
      type: Sequelize.BOOLEAN,
      defaultsTo: true
    },

    //  _    _ _     _             _           _   _        __
    // | |  | (_)   | |           (_)         | | (_)      / _|
    // | |__| |_ ___| |_ ___  _ __ _  ___ __ _| |  _ _ __ | |_ ___
    // |  __  | / __| __/ _ \| '__| |/ __/ _` | | | | '_ \|  _/ _ \
    // | |  | | \__ \ || (_) | |  | | (_| (_| | | | | | | | || (_) |
    // |_|  |_|_|___/\__\___/|_|  |_|\___\__,_|_| |_|_| |_|_| \___/

    memUpdateInfoEnabled: {
      type: Sequelize.BOOLEAN,
      defaultsTo: true
    },

    //   _____                  _                _
    //  / ____|                | |              | |
    // | |     ___  _   _ _ __ | |_ _ __ _   _  | |__   __ _ _ __
    // | |    / _ \| | | | '_ \| __| '__| | | | | '_ \ / _` | '_ \
    // | |___| (_) | |_| | | | | |_| |  | |_| | | |_) | (_| | | | |
    //  \_____\___/ \__,_|_| |_|\__|_|   \__, | |_.__/ \__,_|_| |_|
    //                                    __/ |
    //                                   |___/

    /**
     * @memberof SdtdConfig
     * @var {json} countryBanConfig
     * @description Config for country ban
     */

    countryBanConfig: {
      type: Sequelize.JSON,
      defaultsTo: {
        enabled: false,
        ban: false,
        bannedCountries: [],
        kickMessage: "Your country has been blocked on this server.",
        allowNull: true,
        whiteListedSteamIds: []
      }
    },

    /*   _____ _               _    _      _
        |  __ (_)             | |  (_)    | |
        | |__) | _ __   __ _  | | ___  ___| | __
        |  ___/ | '_ \ / _` | | |/ / |/ __| |/ /
        | |   | | | | | (_| | |   <| | (__|   <
        |_|   |_|_| |_|\__, | |_|\_\_|\___|_|\_\
                        __/ |
                       |___/                     */

    pingKickEnabled: {
      type: Sequelize.BOOLEAN,
      defaultsTo: false
    },

    maxPing: {
      type: Sequelize.INTEGER,
      min: 1,
      defaultsTo: 150
    },

    pingChecksToFail: {
      type: Sequelize.INTEGER,
      min: 1,
      defaultsTo: 3
    },

    pingKickMessage: {
      type: Sequelize.STRING,
      defaultsTo: "Your ping is too high! Please check your connection."
    },

    pingWhitelist: {
      type: Sequelize.JSON,
      defaultsTo: "[]"
    },

    /*
 __      __   _   _
 \ \    / /  | | (_)
  \ \  / /__ | |_ _ _ __   __ _
   \ \/ / _ \| __| | '_ \ / _` |
    \  / (_) | |_| | | | | (_| |
     \/ \___/ \__|_|_| |_|\__, |
                           __/ |
                          |___/
    */

    votingApiKey: {
      type: Sequelize.STRING,
      defaultsTo: ""
    },

    votingEnabled: {
      type: Sequelize.BOOLEAN,
      defaultsTo: false
    },

    votingCommand: {
      type: Sequelize.STRING,
      defaultsTo:
        'say "${player.name} has just voted and received 50 ${server.config.currencyName}!"; addCurrency(${player.id}, 50)'
    },

    /*

     ____                             _   _ _
    |  _ \                           | | (_) |
    | |_) | __ _ _ __  _ __   ___  __| |  _| |_ ___ _ __ ___  ___
    |  _ < / _` | '_ \| '_ \ / _ \/ _` | | | __/ _ \ '_ ` _ \/ __|
    | |_) | (_| | | | | | | |  __/ (_| | | | ||  __/ | | | | \__ \
    |____/ \__,_|_| |_|_| |_|\___|\__,_| |_|\__\___|_| |_| |_|___/

    */

    bannedItemsEnabled: {
      type: Sequelize.BOOLEAN,
      defaultsTo: false
    },

    bannedItems: {
      type: Sequelize.JSON,
      defaultsTo: []
    },

    bannedItemsCommand: {
      type: Sequelize.STRING,
      defaultsTo:
        'kick ${player.steamId} "Unauthorized item detected in inventory"'
    },
  },
  //  ╔═╗╔═╗╔═╗╔═╗╔═╗╦╔═╗╔╦╗╦╔═╗╔╗╔╔═╗
  //  ╠═╣╚═╗╚═╗║ ║║  ║╠═╣ ║ ║║ ║║║║╚═╗
  //  ╩ ╩╚═╝╚═╝╚═╝╚═╝╩╩ ╩ ╩ ╩╚═╝╝╚╝╚═╝
  associations: function () {
    /**
     * @var server
     * @description Server this config belongs to
     * @memberof SdtdConfig
     */
    // SdtdConfig.hasOne(SdtdServer, { as: 'server', foreignKey: 'serverId' });
  },
	options : {
		freezeTableName : false,
		tableName       : 'sdtdconfig',
		schema          : 'sails',
		classMethods    : {},
		instanceMethods : {},
		hooks           : {}
	}
};

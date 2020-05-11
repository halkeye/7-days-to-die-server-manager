/**
 * Datastores
 * (sails.config.datastores)
 *
 * A set of datastore configurations which tell Sails where to fetch or save
 * data when you execute built-in model methods like `.find()` and `.create()`.
 *
 *  > This file is mainly useful for configuring your development database,
 *  > as well as any additional one-off databases used by individual models.
 *  > Ready to go live?  Head towards `config/env/production.js`.
 *
 * For more information on configuring datastores, check out:
 * https://sailsjs.com/config/datastores
 */

let datastores = {


  /***************************************************************************
   *                                                                          *
   * Your app's default datastore.                                            *
   *                                                                          *
   * Sails apps read and write to local disk by default, using a built-in     *
   * database adapter called `sails-disk`.  This feature is purely for        *
   * convenience during development; since `sails-disk` is not designed for   *
   * use in a production environment.                                         *
   *                                                                          *
   * To use a different db _in development_, follow the directions below.     *
   * Otherwise, just leave the default datastore as-is, with no `adapter`.    *
   *                                                                          *
   * (For production configuration, see `config/env/production.js`.)          *
   *                                                                          *
   ***************************************************************************/

  default: {
    adapter: 'sails-disk',
    inMemoryOnly: true
  },
  cache: {
    adapter: 'sails-disk',
    inMemoryOnly: true
  },
  sequalize: {
    database: './.tmp/db.sqlite3',
    options: {
      dialect: 'sqlite',
      logging: 'verbose'
    }
  },
  /*
  somePostgresqlServer: {
    user: 'postgres',
    password: '',
    database: 'sequelize',
    dialect: 'postgres',
    options: {
      dialect: 'postgres',
      host   : 'localhost',
      port   : 5432,
      logging: 'verbose'
    }
  },
  */
};

module.exports.datastores = datastores;

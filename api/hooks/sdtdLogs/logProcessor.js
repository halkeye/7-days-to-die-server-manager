const Redis = require("redis");
const dotenv = require("dotenv");
const {promisify} = require("util");
const SdtdApi = require("7daystodie-api-wrapper");

const handleLogLine = require("./handleLogLine");

/**
 * Set up Redis functionality
 */
dotenv.config();
Redis.RedisClient.prototype.getAsync = promisify(Redis.RedisClient.prototype.get);
Redis.RedisClient.prototype.setAsync = promisify(Redis.RedisClient.prototype.set);

module.exports = async function(job) {
  const redisClient = Redis.createClient({
    url: process.env.REDISSTRING
  });
  const resultLogs = [];
  // Get latest log line from Redis
  let lastLogLine = parseInt(
    await redisClient.getAsync(
      `sdtdserver:${job.data.server.id}:sdtdLogs:lastLogLine`
    )
  );

  // If latest log line is not found, get it from the server
  if (!lastLogLine) {
    const webUIUpdate = await SdtdApi.getWebUIUpdates(job.data.server);
    lastLogLine = parseInt(webUIUpdate.newlogs) + 1;
  }

  const count = process.env.CSMM_LOG_COUNT
    ? parseInt(process.env.CSMM_LOG_COUNT)
    : 50;

  // Get new logs from the server
  const newLogs = await SdtdApi.getLog(job.data.server, lastLogLine, count);

  // Adjust latest log line based on new logs we got
  lastLogLine = lastLogLine + newLogs.entries.length;

  // Set latest log line in Redis
  await redisClient.setAsync(
    `sdtdserver:${job.data.server.id}:sdtdLogs:lastLogLine`,
    lastLogLine
  );

  // Parse these logs into usable data
  let index = -1;
  for (const line of newLogs.entries) {
    index++;
    if (newLogs.entries[index + 1]) {
      if (newLogs.entries[index + 1].msg.includes("handled by mod")) {
        //Message is being handled by a mod, skip to the next line with possibly mod-controlled data
        continue;
      }
    }

    let parsedLogLine = handleLogLine(line);
    if (!parsedLogLine) {
      parsedLogLine.server = job.data.server;
      resultLogs.push(parsedLogLine);
    }
  }

  // Set last success date in Redis
  await redisClient.setAsync(
    `sdtdserver:${job.data.server.id}:sdtdLogs:lastSuccess`,
    Date.now()
  );

  return Promise.resolve({
    lastLogLine,
    logs: resultLogs
  });
};

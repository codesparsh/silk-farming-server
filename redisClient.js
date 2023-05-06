const redis = require("redis");
require("dotenv").config();
const { promisify } = require('util');


const client = redis.createClient({
    password: process.env.REDIS_PASSWORD,
    socket: {
        host: process.env.REDIS_HOSTNAME,
        port: process.env.REDIS_PORT
    }
  });

  client.connect().then(() => {
    console.log("Connected!")
  })
  

  module.exports = client
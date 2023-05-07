let cron = require("node-cron")
let http = require("http")
var redisClient = require("../redisClient")
const { parse } = require("path")
const { admin } = require('../firebase-config')
const USER_KEY = "user"
const FARM_KEY = "farm"

const notification_options = {
    priority: "high",
    timeToLive: 60 * 60 * 24
};

module.exports.signup = async (req, res) => {
    let username = req.body.username
    let password = req.body.password
    if (username != undefined && password != undefined) {
        let key = USER_KEY + ":" + username
        await redisClient.get(key).then(async user => {
            if (user != null && user != undefined) {
                res.send({
                    "status": "Failure",
                    "error": "User already exists"
                })
            } else {
                console.log(user)
                let newUser = {
                    "username": username,
                    "password": password
                }
                redisClient.set(key, value = JSON.stringify(newUser)).then(() => {
                    res.send({
                        "status": "Success",
                        "user": newUser
                    })
                }).catch(() => {
                    res.send({
                        "status": "Failure",
                        "error": "Server error, try again"
                    })
                })
            }
        }).catch(() => {
            res.send({
                "status": "Failure",
                "error": "Cannot Search for user"
            })
        })
    } else {
        if (username == undefined) {
            res.send({
                "status": "Failure",
                "error": "Username required"
            })
        } else {
            res.send({
                "status": "Failure",
                "error": "Password required"
            })
        }

    }
}

module.exports.signin = async (req, res) => {
    let username = req.body.username
    let password = req.body.password

    if (username != undefined && password != undefined) {
        let key = USER_KEY + ":" + username
        await redisClient.get(key).then(async user => {
            if (user == null || user == undefined) {
                res.send({
                    "status": "Failure",
                    "error": "User not found, please sign in"
                })
            } else {
                let parsedUser = JSON.parse(user)
                if (password == parsedUser.password) {
                    res.send({
                        "status": "Success",
                        "user": parsedUser
                    })
                } else {
                    res.send({
                        "status": "Failure",
                        "error": "Incorrect Password"
                    })
                }

            }
        }).catch(() => {
            res.send({
                "status": "Failure",
                "error": "Cannot Search for user"
            })
        })
    } else {
        if (username == undefined) {
            res.send({
                "status": "Failure",
                "error": "Username required"
            })
        } else {
            res.send({
                "status": "Failure",
                "error": "Password required"
            })
        }

    }
}

module.exports.updateUserDetails = async (req, res) => {
    let username = req.body.username
    let tiers = req.body.tiers
    let species = req.body.species
    let shedDimensions = req.body.shedDimensions
    let state = req.body.state
    let lastSanitation = req.body.sanitation
    let registrationToken = req.body.registrationToken

    let key = USER_KEY + ":" + username
    await redisClient.get(key).then(async user => {
        if (user == null || user == undefined) {
            res.send({
                "status": "Failure",
                "error": "User not found"
            })
        } else {
            let newUser = JSON.parse(user)
            let updatedUser = {
                ...newUser,
                tiers: (tiers == null || tiers == undefined) ? newUser.tiers : tiers,
                species: (species == null || species == undefined) ? newUser.species : species,
                shedDimensions: (shedDimensions == null || shedDimensions == undefined) ? newUser.shedDimensions : shedDimensions,
                state: (state == null || state == undefined) ? newUser.state : state,
                sanitation: (lastSanitation == null || lastSanitation == undefined) ? newUser.lastSanitatedAt : lastSanitation
            }

            redisClient.set(key, value = JSON.stringify(updatedUser)).then(() => {
                res.send({
                    "status": "Success",
                    "user": updatedUser
                })
            }).catch(() => {
                res.send({
                    "status": "Failure",
                    "error": "Server error, try again"
                })
            })

        }
    }).catch(() => {
        res.send({
            "status": "Failure",
            "error": "Cannot Search for user"
        })
    })
}


module.exports.listFeeds = async (req, res) => {
    let username = req.body.username
    let userDetailsKey = USER_KEY + ":" + username
    await redisClient.get(userDetailsKey).then(async (user) => {
        if (user != null || user != undefined) {
            let channelId = process.env.CHANNEL_ID
            let key = FARM_KEY + ":" + channelId
            await redisClient.get(key).then((data) => {
                let parsedData = JSON.parse(data)
                let feedArr = (parsedData.feeds == null || parsedData.feeds == undefined) ? [] : parsedData.feeds
                res.send({
                    "status": "Success",
                    "feeds": feedArr
                })
            }).catch(() => {
                res.send({
                    "status": "Failure",
                    "error": "DB Error"
                })
            })
        } else {
            res.send({
                "status": "Failure",
                "error": "User not found"
            })
        }

    }).catch(err => {
        console.log("Server Error")
        res.send({
            "status": "Failure",
            "error": "DB Error"
        })
    })
}

function sendTemperatureNotification (registrationToken) {
    const message = {
        data: {
            score: '850',
            time: '2:45'
        },
        token: registrationToken
    };

    getMessaging().send(message)
        .then((response) => {
            console.log('Successfully sent message:', response);
        })
        .catch((error) => {
            console.log('Error sending message:', error);
        });
}


cron.schedule("*/10 * * * * *", () => {
    console.log("Cron Job runing every 10 second")
    http.get(`http://api.thingspeak.com/channels/${process.env.CHANNEL_ID}/feeds.json?api_key=${process.env.API_KEY}&results=1`, (response) => {

        let data = '';

        response.on('data', (chunk) => {
            data += chunk;
        });

        response.on('end', () => {
            console.log('Retrieved all data');
            let parsedData = JSON.parse(data);
            let channelId = parsedData.channel.id
            let feed = parsedData.feeds.length > 0 ? parsedData.feeds[0] : undefined
            let temperature = feed.field1
            let humidity = feed.field2

            console.log({ temperature: temperature, humidity: humidity })

            if (temperature != null && temperature != undefined && registrationToken != null && registrationToken != undefined) {
                sendTemperatureNotification(registrationToken);
            } 

            let key = FARM_KEY + ":" + channelId
            let feedArr = []

            redisClient.get(key).then(feedArrData => {
                if (feedArrData != null || feedArrData != undefined) {
                    parsedFeedData = JSON.parse(feedArrData)
                    feedArr = (parsedFeedData.feeds == null || parsedFeedData.feeds == undefined) ? [] : parsedFeedData.feeds
                } else {
                    feedArr = []
                }


                let findEntry = feedArr.find((entry) => entry.entry_id == feed.entry_id)
                if (findEntry == null || findEntry == undefined) {
                    feedArr.push({
                        "entry_id": feed.entry_id,
                        "created_at": feed.created_at,
                        "temperature": temperature,
                        "humidity": humidity
                    })
                }

                redisClient.set(key, value = JSON.stringify({ "feeds": feedArr })).then(() => {
                    console.log("New Feed Update - ID:" + feed.entry_id)
                }).catch(() => {
                    console.log("Cannot update feed in db - ID:" + feed.entry_id)
                })
            }).catch(err => {
                console.log(err)
            })


        })
    })
})
let cron = require("node-cron")
let https = require("https")
let Utility = require('./utils');

const USER_KEY = "user"
const FARM_KEY = "farm"

var redisClient = require("../redisClient")

var admin = require("firebase-admin");

var serviceAccount = require("../service-account.json");

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

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
                res.send({
                    "status": "Success",
                    "data": parsedData
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

module.exports.registration = async (req, res) => {
    let registrationToken = req.body.registrationToken
    if (registrationToken != null && registrationToken != undefined) {
        if (Utility.saveRegistrationToken({ registrationToken: registrationToken, lastLoginAt: Date.now() })) {
            res.send({
                "status": "Success",
                "message": "Token Saved"
            })
        } else {
            res.send({
                "status": "Failure",
                "error": "DB Error"
            })
        }
    } else {
        res.send({
            "status": "Failure",
            "error": "Invalid Token"
        })
    }
}


cron.schedule("*/5 * * * * *", () => {
    console.log("Cron Job runing every 5 seconds")
    Utility.getAccessToken().then((_) => {
        https.get(`https://api.thingspeak.com/channels/${process.env.CHANNEL_ID}/feeds.json?api_key=${process.env.API_KEY}&results=1`, async (response) => {
            let data = '';
            response.on('data', (chunk) => {
                data += chunk;
            });
            response.on('end', async () => {
                let parsedData = JSON.parse(data);
                let channelId = parsedData.channel.id
                let key = FARM_KEY + ":" + channelId
                let feed = parsedData.feeds.length > 0 ? parsedData.feeds[0] : undefined
                let entry = {
                    entry_id: feed.entry_id,
                    created_at: feed.created_at,
                    temperature: feed.field1,
                    humidity: feed.field2
                }

                if ((entry.temperature >= 29 || entry.temperature <= 23) && entry.humidity <= 70) {
                    let msgVal = `Temperature = ${Math.round(entry.temperature)}°C \nHumidity = ${Math.round(entry.humidity)}%`
                    if (entry.temperature >= 29) {
                        await Utility.sendThresholdNotification("ALERT: HIGH TEMPERATURE AND SUBOPTIMAL HUMIDITY",msgVal)
                    } else {
                        await Utility.sendThresholdNotification("ALERT: LOW TEMPERATURE AND SUBOPTIMAL HUMIDITY",msgVal)
                    }
                } else if (entry.temperature >= 29) {
                    let msgVal = `Temperature = ${Math.round(entry.temperature)}°C`
                    await Utility.sendThresholdNotification("ALERT: HIGH TEMPERATURE IN REARING SHED", msgVal)
                } else if (entry.temperature <= 23) {
                    let msgVal = `Temperature = ${Math.round(entry.temperature)}°C`
                    await Utility.sendThresholdNotification("ALERT: LOW TEMPERATURE IN REARING SHED", msgVal)
                } else if (entry.humidity <= 70) {
                    let msgVal = `Humidity = ${Math.round(entry.humidity)}%`
                    await Utility.sendThresholdNotification("ALERT: SUBOPTIMAL HUMIDITY IN REARING SHED", msgVal)
                }

                redisClient.set(key, value = JSON.stringify(entry)).then(() => {
                    console.log("New Feed Update - ID:" + feed.entry_id)
                }).catch(() => {
                    console.log("Cannot update feed in db - ID:" + feed.entry_id)
                })
            })
        })
    }).catch((error) => {
        console.log("access token error ", error)
    })

})

let cron = require("node-cron")
let http = require("http")
var redisClient = require("../redisClient")
const { parse } = require("path")
const USER_KEY = "user"
const FARM_KEY = "farm"

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
                let newUser = JSON.parse(user)
                res.send({
                    "status": "Success",
                    "user": newUser
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

module.exports.updateUserDetails = async (req, res) => {
    let username = req.body.username
    let tiers = req.body.tiers
    let species = req.body.species
    let shedDimensions = req.body.shedDimensions
    let state = req.body.state

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
                tiers: tiers,
                species: species,
                shedDimensions: shedDimensions,
                state: state
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

module.exports.getFeedData = async (req, res) => {
    let username = req.body.username
    let userDetailsKey = USER_KEY + ":" + username
    redisClient.get(userDetailsKey).then(async (user) => {
        let channelId = process.env.CHANNEL_ID
        redisClient.get()
    }).catch(err => {
        console.log("User not found")
    })
}

cron.schedule("*/30 * * * * *", () => {
    console.log("Cron Job runing every second")
    http.get(`http://api.thingspeak.com/channels/${process.env.CHANNEL_ID}/feeds.json?api_key=${process.env.API_KEY}&results=1`, (response) => {

        let data = '';

        response.on('data', (chunk) => {
            data += chunk;
        });

        response.on('end', async () => {
            console.log('Retrieved all data');
            let parsedData = JSON.parse(data);
            console.log(parsedData);
            let channelId = parsedData.channel.id
            let feed = parsedData.feeds.length > 0 ? parsedData.feeds[0] : undefined
            let temperature = feed.field1
            let humidity = feed.field2
            console.log(temperature, humidity)
            let key = FARM_KEY + ":" + channelId
            let feedData = {
                "entry": feed.entry_id,
                "created_at": feed.created_at,
                "temperature": temperature,
                "humidity": humidity
            }
            let feedArr = []
            await redisClient.get(key).then(feedArrData => {
                if (feedArrData != null || feedArrData != undefined) {
                    feedArr = JSON.parse(feedArrData)
                } else {
                    feedArr = []
                }
                console.log("---------   " + feedArrData)
            }).catch(err => {
                feedArr = []
            })

            // feedArr = feedArr.push(feedData)
            console.log("---------   " + feedArr)

            redisClient.set(key, value = JSON.stringify(feedArr)).then(() => {
                console.log("New Feed Update - ID:" + feed.entry_id)
            }).catch(() => {
                console.log("Cannot update feed in db - ID:" + feed.entry_id)
            })
        })
    })
})
let cron = require("node-cron")
let http = require("http")
let https = require("https")
var redisClient = require("../redisClient")
const { parse } = require("path")
const { google } = require('googleapis');
// const { admin } = require('../firebase-config')
const USER_KEY = "user"
const FARM_KEY = "farm"

const PROJECT_ID = 'silk-farming';
const HOST = 'fcm.googleapis.com';
const PATH = '/v1/projects/' + PROJECT_ID + '/messages:send';
const MESSAGING_SCOPE = 'https://www.googleapis.com/auth/firebase.messaging';
const SCOPES = [MESSAGING_SCOPE];


var admin = require("firebase-admin");

var serviceAccount = require("../service-account.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});


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
        redisClient.set("registrationToken", value = registrationToken).then(() => {
            res.send({
                "status": "Success",
                "message": "Token Saved"
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
            "error": "Invalid Token"
        })
    }
}

function getAccessToken() {
    return new Promise(function(resolve, reject) {
      const jwtClient = new google.auth.JWT(
        serviceAccount.client_email,
        null,
        serviceAccount.private_key,
        SCOPES,
        null
      );
      jwtClient.authorize(function(err, tokens) {
        if (err) {
          reject(err);
          return;
        }
        resolve(tokens.access_token);
      });
    });
  }

const sendNotification  = async (msg, entry) => {
    console.log("Sending notification -------")
 await redisClient.get("registrationToken").then(async (token) => {
    getAccessToken().then(function(accessToken) {
        const options = {
          hostname: HOST,
          path: PATH,
          method: 'POST',
          // [START use_access_token]
          headers: {
            'Authorization': 'Bearer ' + accessToken
          }
          // [END use_access_token]
        };
    
        const request = https.request(options, function(resp) {
          resp.setEncoding('utf8');
          resp.on('data', function(data) {
            console.log('Message sent to Firebase for delivery, response:');
            console.log(data);
          });
        });
    
        request.on('error', function(err) {
          console.log('Unable to send message to Firebase');
          console.log(err);
        });
    
        request.write(JSON.stringify({message: {
            token: token, data: {msg: msg, entry:entry}, notification: {title: msg, body: entry}
        }}));
        request.end();
      });
    }).catch(() => {
        console.log("Failed to send notification")
    })

}


cron.schedule("*/5 * * * * *", () => {
    console.log("Cron Job runing every 10 second")
    getAccessToken().then((token) => {
console.log("access token ", token)
    }).catch((error) => {
console.log("access token error ", error)

    })
    http.get(`http://api.thingspeak.com/channels/${process.env.CHANNEL_ID}/feeds.json?api_key=${process.env.API_KEY}&results=1`, async (response) => {
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

            if (entry.temperature >= 29) {
                await sendNotification("ALERT: HIGH TEMPERATURE IN REARING SHED", entry.temperature)
            }

            if (entry.temperature <= 23) {
                await sendNotification("ALERT: LOW TEMPERATURE IN REARING SHED", entry.temperature)
            }

            if (entry.humidity <= 70) {
                await sendNotification("ALERT: SUBOPTIMAL HUMIDITY IN SILKWORM REARING SHED", entry.humidity)

            }

            redisClient.set(key, value = JSON.stringify(entry)).then(() => {
                console.log("New Feed Update - ID:" + feed.entry_id)
            }).catch(() => {
                console.log("Cannot update feed in db - ID:" + feed.entry_id)
            })
        })
    })
})

            // let channelId = parsedData.channel.id
                    // let feed = parsedData.feeds.length > 0 ? parsedData.feeds[0] : undefined
                    // let temperature = feed.field1
                    // let humidity = feed.field2
        
                    // console.log({ temperature: temperature, humidity: humidity })
                    // if (humidity > 50) {
                    //     console.log("Greater humidity")
                    // }
                    // if (temperature != null && temperature != undefined) {
                    //     sendTemperatureNotification(registrationToken);
                    // }
        
                    // let key = FARM_KEY + ":" + channelId
                    // let feedArr = []
        
                    // redisClient.get(key).then(feedArrData => {
                    //     if (feedArrData != null || feedArrData != undefined) {
                    //         parsedFeedData = JSON.parse(feedArrData)
                    //         feedArr = (parsedFeedData.feeds == null || parsedFeedData.feeds == undefined) ? [] : parsedFeedData.feeds
                    //     } else {
                    //         feedArr = []
                    //     }
        
        
                    //     let findEntry = feedArr.find((entry) => entry.entry_id == feed.entry_id)
                    //     if (findEntry == null || findEntry == undefined) {
                    //         feedArr.push({
                    //             "entry_id": feed.entry_id,
                    //             "created_at": feed.created_at,
                    //             "temperature": temperature,
                    //             "humidity": humidity
                    //         })
                    //     }
        
                    //     redisClient.set(key, value = JSON.stringify({ "feeds": feedArr })).then(() => {
                    //         console.log("New Feed Update - ID:" + feed.entry_id)
                    //     }).catch(() => {
                    //         console.log("Cannot update feed in db - ID:" + feed.entry_id)
                    //     })
                    // }).catch(err => {
                    //     console.log(err)
                    // })
        
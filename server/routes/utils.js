const { parse } = require("path")
const { google } = require('googleapis');
var serviceAccount = require("../service-account.json");
var admin = require("firebase-admin");
let https = require("https")

var redisClient = require("../redisClient");
const { token } = require("morgan");


const PROJECT_ID = 'silk-farming';
const HOST = 'fcm.googleapis.com';
const PATH = '/v1/projects/' + PROJECT_ID + '/messages:send';
const MESSAGING_SCOPE = 'https://www.googleapis.com/auth/firebase.messaging';
const SCOPES = [MESSAGING_SCOPE];
const REGISTER = "register"
const TIME_DIFF = 1800

// admin.initializeApp({
//     credential: admin.credential.cert(serviceAccount)
// });
  
module.exports.saveRegistrationToken = async ({registrationToken, lastLoginAt, lastNotifiedAt} = {}) => {
    let setToken = async (tokenDetails) => {
        console.log(tokenDetails)
        await redisClient.set(REGISTER, value = JSON.stringify(tokenDetails)).then(() => {
            return true
        }).catch(() => {
            console.log("Token Not getting saved")
            return false
        })
    }

    if (registrationToken != null && registrationToken != undefined) {
        await redisClient.get(REGISTER).then(async (tokenData) => {
            if (tokenData != null && tokenData != undefined) {
                let parsedTokenDataArr = JSON.parse(tokenData)
                if (parsedTokenDataArr.length) {
                    let checkToken = parsedTokenDataArr.find(tokenDetails => {
                        return registrationToken == tokenDetails.registrationToken
                    })
                    if (checkToken != null && checkToken != undefined){
                        let tokenArr = parsedTokenDataArr.map(tokenDetails => {
                            if (registrationToken == tokenDetails.registrationToken) {
                                let details = {
                                    registrationToken: registrationToken,
                                    lastLoginAt: lastLoginAt || tokenDetails.lastLoginAt,
                                    lastNotifiedAt: lastNotifiedAt || null
                                }
                                return details
                            } else {
                               return tokenDetails
                            }
                        })
                        let result  = await setToken(tokenArr)
                        return result;
                    } else {
                        let tokenArr = parsedTokenDataArr
                        tokenArr.push({
                            registrationToken: registrationToken,
                            lastLoginAt: lastLoginAt || Date.now(),
                            lastNotifiedAt: lastNotifiedAt || null  
                        })
                        let result  = await setToken(tokenArr)
                        return result;
                    }
                } else {
                    let tokenDetails = {
                        registrationToken: registrationToken,
                        lastLoginAt: lastLoginAt || Date.now(),
                        lastNotifiedAt: lastNotifiedAt || null
                    }
                    let result  = await setToken([tokenDetails])
                    return result;
                }
                
            } else {
                let tokenDetails = {
                    registrationToken: registrationToken,
                    lastLoginAt: lastLoginAt || Date.now(),
                    lastNotifiedAt: lastNotifiedAt || null
                }
                let result  = await setToken([tokenDetails])
                return result;
            }
        }).catch(() => {
            console.log("Token Not getting saved")
            return false
        })
    } else {
        return false;
    }
}

module.exports.getAccessToken = () => {
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

module.exports.sendNotification = async (token, msg, entry) => {
    await this.getAccessToken().then(function(accessToken) {
        const options = {
        hostname: HOST,
        path: PATH,
        method: 'POST',
        headers: {
            'Authorization': 'Bearer ' + accessToken
        }
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
            token:token, data: {msg: msg, entry:entry}, notification: {title: msg, body: entry}
        }}));
        request.end();
    });
}

module.exports.sendThresholdNotification  = async (msg, entry) => {
    console.log("Sending notification -------")
    await redisClient.get(REGISTER).then(async (tokens) => {
        let parsedTokens = JSON.parse(tokens)
        tokens = parsedTokens != null && parsedTokens != undefined ? parsedTokens : []
        let registrationTokens = 
        tokens
        .filter(tokenDetails => {
            return (Date.now() - tokenDetails.lastNotifiedAt > TIME_DIFF)
        }) 
        .map(async tokenDetails => {
            await this.sendNotification(tokenDetails.registrationToken, msg, entry)
            return 
        })

        tokens = tokens.map(tokenDetails => {
            if (registrationTokens.includes(tokenDetails.registrationToken)) {
                return {
                    ...tokenDetails,
                    lastNotifiedAt: Date.now()
                }                    
            } else {
                return tokenDetails
            }

        })
        await redisClient.set(REGISTER, JSON.stringify(tokens)).then(() => {
            console.log("Registration Tokens updated")
        }).catch(err => {
            console.log("Unable to update DB");
            console.log(err);
        }) 


    }).catch(() => {
        console.log("Failed to send notification")
    })
}

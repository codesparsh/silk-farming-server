var redisClient = require("../redisClient")
const USER_KEY = "user"
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
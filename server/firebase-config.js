var admin = require("firebase-admin");

var serviceAccount = require("./public/silk-farming-firebase-adminsdk-sqqb5-fe31821c7d.json");


admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

module.exports.admin = admin
const{sign, verify} = require('jsonwebtoken')
require("dotenv").config()

function createToken(user) {
    return sign({
        emailAddress: user.emailAddress,
        userPass: user.userPass
    },
    process.env.SECRET_KEY,
    {
        expiresIn: '1h'
    })
}

module.exports = {
    createToken
}
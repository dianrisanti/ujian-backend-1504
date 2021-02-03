const jwt = require('jsonwebtoken')
const TOKEN_KEY = "!@#$%^&"

module.exports = {
    createToken: (data) => {
        return jwt.sign(data, TOKEN_KEY)
    },

    createTokenExp: (data) => {
        return jwt.sign(data, TOKEN_KEY, {expiresIn: 120})
    },

    verifyToken: (req, res, next) => {
        const token = req.body.token

        if(!token) return res.status(400).send('no token exist')

        try {
            const result = jwt.verify(token, TOKEN_KEY)
            req.user = result
            next()
        }

        catch(err) {
            console.log(err)
            res.status(400).send(err)
        }
    }
}
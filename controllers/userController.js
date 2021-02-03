const { generateQuery, asyncQuery } = require('../helper/queryHelp')
const { createToken } = require('../helper/jwt')

const { validationResult } = require('express-validator')
const cryptojs = require('crypto-js')
const SECRET_KEY = '!@#$%^&'

module.exports = {
    register: async(req, res) => {
        try{
            let errors = validationResult(req)
            if (!errors.isEmpty()) return res.status(400).send(errors.array()[0].msg)

            let { username, password, email } = req.body
            const hashpass = cryptojs.HmacMD5(password, SECRET_KEY).toString()

            const checkUser = `
                SELECT * FROM users
                WHERE username = '${username}'
                OR email = '${email}'
            `
            const checkResult = await asyncQuery(checkUser)
            if (checkResult.length !== 0) return res.status(400).send('Username or Email already existed')
            
            const regisQuery = `INSERT INTO users (uid, username, password, email)
            VALUES ('${Date.now()}', '${username}', '${hashpass}', '${email}')`
            const resultRegis = await asyncQuery(regisQuery)

            const userRegis = `SELECT id, uid, username, email from users WHERE id = ${resultRegis.insertId}`
            const resultUser = await asyncQuery(userRegis)

            resultUser[0].token = createToken({uid: resultUser[0].uid , role: '2'})

            res.status(200).send(resultUser[0])
        }
        catch(err){
            console.log(err)
            res.status(400).send('ERROR REGISTER')
        }
    },

    login: async(req, res) => {
        try{
            const { username, email, password } = req.body
            const hashpass = cryptojs.HmacMD5(password, SECRET_KEY).toString()

            let queryUser = ''
            if(username && !email) {
                queryUser = `SELECT id, uid, username, email, status, role FROM users 
                WHERE username = '${username}' AND password = '${hashpass}' AND status = 1`
            }
            if(!username && email) {
                queryUser = `SELECT id, uid, username, email, status, role FROM users 
                WHERE email = '${email}' AND password = '${hashpass}' AND status = 1`
            }

            const result = await asyncQuery(queryUser)
            if (result.length === 0) return res.status(400).send('Account doesn\'t exist')

            result[0].token = createToken({uid: result[0].uid , role: result[0].role})

            res.status(200).send(result[0])
        }
        catch(err){
            console.log(err)
            res.status(400).send('ERROR LOGIN')
        }
    },

    deactive: async(req, res) => {
        try{
            const { uid, role } = req.user
            
            const verify = `UPDATE users SET status = 2 WHERE uid = ${+uid} AND role = '${role}' AND status = 1`
            await asyncQuery(verify)

            const userQuery = `SELECT u.uid, s.status FROM users u JOIN status s on u.status = s.id
            WHERE u.uid = ${+uid}`
            const resultUser = await asyncQuery(userQuery)

            res.status(200).send(resultUser[0])
        }
        catch(err){
            console.log(err)
            res.status(400).send(err)
        }
    },

    reactive: async(req, res) => {
        try{
            const { uid, role } = req.user
            
            const verify = `UPDATE users SET status = 1 WHERE uid = ${+uid} AND role = '${role}' AND status = 2`
            await asyncQuery(verify)

            const userQuery = `SELECT u.uid, s.status FROM users u JOIN status s on u.status = s.id
            WHERE u.uid = ${+uid}`
            const resultUser = await asyncQuery(userQuery)

            res.status(200).send(resultUser[0])
        }
        catch(err){
            console.log(err)
            res.status(400).send(err)
        }
    },

    close: async(req, res) => {
        try{
            const { uid, role } = req.user
            
            const verify = `UPDATE users SET status = 3 WHERE uid = ${+uid} AND role = '${role}' AND status = 1`
            await asyncQuery(verify)

            const userQuery = `SELECT u.uid, s.status FROM users u JOIN status s on u.status = s.id
            WHERE u.uid = ${+uid}`
            const resultUser = await asyncQuery(userQuery)

            res.status(200).send(resultUser[0])
        }
        catch(err){
            console.log(err)
            res.status(400).send(err)
        }
    },
}
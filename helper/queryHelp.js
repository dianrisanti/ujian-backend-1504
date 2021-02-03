const util = require('util')
const database = require('../database')

module.exports = {
    generateQuery: (data) => {
        const input = {}
        for(let item in data){
            if(data[item]) input[`${item}`] = data[item]
        }

        let result = ''
        for(let key in input){
            result += ` ${key} = ${database.escape(input[key])},`
        }
        return result.slice(0, -1)
    },

    generateWhereQuery: (input) => {
        let result = ''
        for(let key in input){
            if(key === "status" || key === "time") result += ` ${key} = ${database.escape(input[key].replace('%', ' '))} AND`
            else result += ` ${key} = ${database.escape(input[key])} AND`
        }
        return result.slice(0, -3)
    },

    asyncQuery: util.promisify(database.query).bind(database)
}
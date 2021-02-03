const { generateWhereQuery, asyncQuery } = require('../helper/queryHelp')

module.exports = {
    getAll: async(req, res) => {
        try{
            const getQuery = `SELECT m.name, m.release_date, m.release_month, m.release_year, m.duration_min, m.genre, 
            m.description, m.status, l.location, st.time 
            FROM schedules s 
            JOIN locations l ON s.location_id = l.id
            JOIN show_times st ON s.time_id = st.id
            JOIN (SELECT m.id, m.name, m.release_date, m.release_month, m.release_year, m.duration_min, m.genre, 
            m.description, ms.status FROM movies m JOIN movie_status ms ON m.status=ms.id) m ON s.movie_id = m.id;`

            const result = await asyncQuery(getQuery)

            res.status(200).send(result)
        }
        catch(err){
            console.log(err)
            res.status(400).send('ERROR GET MOVIES')
        }
    },

    getByQuery: async(req, res) => {
        try{
            const getQuery = `SELECT m.name, m.release_date, m.release_month, m.release_year, m.duration_min, m.genre, 
            m.description, m.status, l.location, st.time 
            FROM schedules s 
            JOIN locations l ON s.location_id = l.id
            JOIN show_times st ON s.time_id = st.id
            JOIN (SELECT m.id, m.name, m.release_date, m.release_month, m.release_year, m.duration_min, m.genre, 
            m.description, ms.status FROM movies m JOIN movie_status ms ON m.status=ms.id) m ON s.movie_id = m.id
            WHERE${generateWhereQuery(req.query)}`

            const result = await asyncQuery(getQuery)

            res.status(200).send(result)
        }
        catch(err){
            console.log(err)
            res.status(400).send('ERROR GET MOVIES')
        }
    },

    add: async(req, res) => {
        try{
            let { name, genre, release_date, release_month, release_year, duration_min, description } = req.body
            
            const addQuery = `INSERT INTO movies (name, genre, release_date, release_month, release_year, duration_min, description)
            VALUES ('${name}', '${genre}', ${release_date}, ${release_month}, ${release_year}, ${duration_min}, '${description}')`
            const resultAdd = await asyncQuery(addQuery)

            const movie = `SELECT id, name, genre, release_date, release_month, release_year, duration_min, description from movies WHERE id = ${resultAdd.insertId}`
            const result = await asyncQuery(movie)

            res.status(200).send(result[0])
        }
        catch(err){
            console.log(err)
            res.status(400).send('ERROR ADD MOVIE')
        }
    },

    editStatus: async(req, res) => {
        try{
            const { uid, role } = req.user
            const adminQuery = `SELECT * FROM users WHERE uid = ${+uid} AND role = 1`
            const adminResult = await asyncQuery(adminQuery)
            if(adminResult.length === 0) return res.status(400).send('You cannot edit status')

            const id = +req.params.id
            const queryMovie = `SELECT * FROM movies WHERE id = ${id}`
            const result = await asyncQuery(queryMovie)
            if(result.length === 0) return res.status(500).send('There is no data to edit')

            const editQuery = `UPDATE movies SET status = ${req.body.status} WHERE id = ${id}`
            await asyncQuery(editQuery)

            const movieQuery = `SELECT id FROM movies WHERE id = ${id}`
            const movieResult = await asyncQuery(movieQuery)
            movieResult[0].message = 'status has been changed'

            res.status(200).send(movieResult)
        }
        catch(err){
            console.log(err)
            res.status(400).send(err)
        }
    },

    addSchedule: async(req, res) => {
        try{
            const { uid, role } = req.user
            const adminQuery = `SELECT * FROM users WHERE uid = ${+uid} AND role = 1`
            const adminResult = await asyncQuery(adminQuery)
            if(adminResult.length === 0) return res.status(400).send('You cannot add schedule')

            const id = +req.params.id
            const querySchedule = `SELECT * FROM movies WHERE id = ${id}`
            const result = await asyncQuery(querySchedule)
            if(result.length === 0) return res.status(500).send('There is no data to edit')

            const {location_id, time_id} = req.body
            const addQuery = `INSERT INTO schedules (movie_id, location_id, time_id)
            VALUES (${id}, ${+location_id}, ${+time_id})`
            const addResult = await asyncQuery(addQuery)

            const movieQuery = `SELECT movie_id id FROM schedules WHERE id = ${addResult.insertId}`
            const movieResult = await asyncQuery(movieQuery)
            movieResult[0].message = 'schedule has been added'

            res.status(200).send(movieResult)
        }
        catch(err){
            console.log(err)
            res.status(400).send(err)
        }
    }
}
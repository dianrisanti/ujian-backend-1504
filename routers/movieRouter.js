const router = require('express').Router()

const { verifyToken } = require('../helper/jwt')

const { movieController } = require('../controllers')

router.get('/get/all', movieController.getAll)
router.get('/get', movieController.getByQuery)
router.post('/add', movieController.add)
router.patch('/edit/:id', verifyToken, movieController.editStatus)
router.patch('/set/:id', verifyToken, movieController.addSchedule)

module.exports = router
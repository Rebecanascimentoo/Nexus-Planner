const router = require('express').Router()
const controller = require('../controllers/tasks.controller')
const authMiddleware = require('../middlewares/auth.middleware')

router.use(authMiddleware)

router.post('/', controller.create)
router.get('/', controller.findAll)
router.put('/:id', controller.update)
router.delete('/:id', controller.remove)

module.exports = router
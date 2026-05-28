const service = require('../services/auth.service')

exports.register = async (req, res) => {
  try {
    const result = await service.register(req.body)

    res.status(201).json(result)
  } catch (error) {
    res.status(400).json({
      error: error.message
    })
  }
}

exports.login = async (req, res) => {
  try {
    const result = await service.login(req.body)

    res.json(result)
  } catch (error) {
    res.status(400).json({
      error: error.message
    })
  }
}
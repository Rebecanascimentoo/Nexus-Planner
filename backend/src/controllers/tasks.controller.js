const service = require('../services/tasks.service')

exports.create = async (req, res) => {
  try {
    const task = await service.create(req.userId, req.body)

    res.status(201).json(task)
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
}

exports.findAll = async (req, res) => {
  try {
    const tasks = await service.findAll(req.userId)

    res.json(tasks)
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
}

exports.update = async (req, res) => {
  try {
    const task = await service.update(req.userId, req.params.id, req.body)

    res.json(task)
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
}

exports.remove = async (req, res) => {
  try {
    await service.remove(req.userId, req.params.id)

    res.json({ message: 'Tarefa deletada com sucesso' })
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
}
const prisma = require('../lib/prisma')

exports.create = async (userId, data) => {
  return prisma.task.create({
    data: {
      title: data.title,
      description: data.description,
      status: data.status || 'pending',
      priority: data.priority || 'medium',
      dueDate: data.dueDate ? new Date(data.dueDate) : null,
      userId
    }
  })
}

exports.findAll = async (userId) => {
  return prisma.task.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' }
  })
}

exports.update = async (userId, id, data) => {
  return prisma.task.updateMany({
    where: {
      id: Number(id),
      userId
    },
    data
  })
}

exports.remove = async (userId, id) => {
  return prisma.task.deleteMany({
    where: {
      id: Number(id),
      userId
    }
  })
}
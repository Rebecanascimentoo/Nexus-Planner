const prisma = require('../lib/prisma')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

exports.register = async (data) => {
  const userExists = await prisma.user.findUnique({
    where: {
      email: data.email
    }
  })

  if (userExists) {
    throw new Error('Email já cadastrado')
  }

  const hash = await bcrypt.hash(data.password, 10)

  const user = await prisma.user.create({
    data: {
      name: data.name,
      email: data.email,
      passwordHash: hash
    }
  })

  return user
}

exports.login = async (data) => {
  const user = await prisma.user.findUnique({
    where: {
      email: data.email
    }
  })

  if (!user) {
    throw new Error('Usuário não encontrado')
  }

  const validPassword = await bcrypt.compare(
    data.password,
    user.passwordHash
  )

  if (!validPassword) {
    throw new Error('Senha inválida')
  }

  const token = jwt.sign(
    {
      userId: user.id
    },
    process.env.JWT_SECRET,
    {
      expiresIn: '7d'
    }
  )

  return {
    token
  }
}
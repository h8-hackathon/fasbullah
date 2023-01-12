const bcrypt = require('bcryptjs')

const isValidPassword = (userInput, hash) => {
  return bcrypt.compare(userInput, hash)
}

module.exports = { isValidPassword }

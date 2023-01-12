const bcrypt = require('bcryptjs')

const isValidPassword = (userInput, hash) => {
  console.log(userInput, hash)
  return bcrypt.compare(userInput, hash)
}

const tagsGetter = (tags) => {
  return tags
    .split('\n')
    .flatMap((tag) => tag.split(' '))
    .filter((tag) => tag[0] === '#')
    .map((tag) => tag.slice(1).toLowerCase())
}

module.exports = { isValidPassword, tagsGetter }

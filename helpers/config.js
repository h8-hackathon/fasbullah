const fs = require('fs')

const DATABASE_URL = process.env.DATABASE_URL

if(!DATABASE_URL) {
  console.log('DATABASE_URL is required in envoirment')
  process.exit(1)
}

const config = new URL(DATABASE_URL);

const production = {
    "username": config.username,
    "password": config.password,
    "database": config.pathname.split("/")[1],
    "host": config.hostname,
    "dialect": "postgres"
}


const defaultConfig = JSON.parse(fs.readFileSync('./config/config.json', 'utf-8'))

defaultConfig.production = production

fs.writeFileSync('./config/config.json', JSON.stringify(defaultConfig, null, 4))
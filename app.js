const express = require('express')

const app = express()
const PORT = process.env.PORT || 3000

app.set('view engine', 'ejs')
app.use(express.urlencoded({extended: false}))


app.get('/', (req, res) => {
    res.render('user/index')
})

app.get('/login', (req, res) => {
    res.render('user/login')
})

app.get('/register', (req, res) => {
    res.render('user/register')
})

app.get('/post', (req, res) => {
    res.render('post/post')
})

app.listen(PORT)


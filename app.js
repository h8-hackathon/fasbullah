const express = require('express')
const session = require('express-session')

const app = express()
const PORT = process.env.PORT || 3000

app.set('view engine', 'ejs')
app.use(express.urlencoded({extended: false}))
app.use(session({
    secret: process.env.SECRET || 'secret',
    resave: false,
    saveUninitialized: false,
    cookie: {secure: false, sameSite: true}
}))

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

app.get('/profile/:id', (req, res) => [
    res.render('profile/userProfile')
])

app.get('/profile/:id/edit', (req, res) => {
    res.render('profile/edit-form')
})


app.listen(PORT)


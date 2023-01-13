const express = require('express')
const session = require('express-session')
const router = require('./routes/index.routes')

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

app.use(router)

app.get('/landing', (req, res) => {
    res.render('user/landingPage')
})

app.get('/login', (req, res) => {
    res.render('user/login')
})

app.get('/register', (req, res) => {
    res.render('user/register')
})

app.get('/', (req, res) => {
    res.render('post/post')
})

app.get('/post/add', (req, res) => {
    res.render('post/form-add')
})

app.get('/post/:id', (req, res) => {
    res.render('post/postById')
})

app.get('/profile/:id', (req, res) => {
    res.render('profile/userProfile')
})

app.get('/profile/:id/friends', (req, res) => {
    res.render('profile/form-friend')
})

app.get('/profile/:id/edit', (req, res) => {
    res.render('profile/edit-form')
})

app.get('/tags/tag', (req, res) => {
    res.render('profile/tags')
})



app.listen(PORT)


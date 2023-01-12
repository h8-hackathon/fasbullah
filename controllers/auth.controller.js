const { isValidPassword } = require('../helpers')
const { Credential } = require('../models')

class AuthController {
  static loginForm(req, res) {
    if(req.session.loggedIn) return res.redirect('/')
    res.send('Login')
  }
  
  static login(req, res) {
    if(req.session.loggedIn) return res.redirect('/')

    const { email, password } = req.body
    let temp = {}

    Credential.findOne({
      where: {
        email,
      },
      include: User
    })
    .then((credential) => {
      if (!credential)
        throw new Error({
          name: 'validationError',
          errors: [{ message: `${email} isn't found please check your email` }],
        })

      temp.credential = credential
      return isValidPassword(password, credential.password)
        
    })
    .then((valid) => {
      if (!valid) throw new Error({
        name: 'validationError',
        errors: [{ message: `Your password is not match, please check again` }],
      })

      req.session.user = temp.credential.User
      req.session.role = temp.credential.role
      req.session.loggedIn = true
      res.redirect('/')
    })
    .catch(err => {
      if(err.name && err.errors) {
        res.redirect(401, '/login?errors=' + err.errors.map(({message}) => message))
        return
      }
      res.status(500).send(err)
    })
  }

  static registerForm(req, res) {
    if(req.session.loggedIn) return res.redirect('/')

    res.send('register')
  }

  static register(req, res) {
    if(req.session.loggedIn) return res.redirect('/')

    const { name, password, email } = req.body

    User.create({ name })
      .then(user => {
        return Credential.create({ email, password, UserId: user.id })
      })
      .then(() => {
        res.redirect('/login?success=Successfully Register')
      })
      .catch((err) => {
        if(err.name && err.errors) {
          res.redirect(403, '/register?errors=' + err.errors.map(({message}) => message))
          return
        }
        res.status(500).send(err)
      })
  }
}


module.exports = AuthController
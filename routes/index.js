const express = require('express')
const bcryptjs = require('bcryptjs')
const router = express.Router()

const SALT_ROUNDS = 10 

router.get('/', async (req, res) => {

    let articles = await db.any('SELECT articleId, title, body FROM articles')
        res.render('index', {articles: articles})
})

router.get('/hello', (req, res, next) => {
    res.send('Hello World')
})

router.get('/logout', (req, res, next) => {

    if(req.session) {
        req.session.destroy((error) => {
            if(error) {
                next(error)
            } else {
                res.redirect('login')
            }
        })
    }
})

router.get('/register', (req,res) => {
    res.render('register')
})

router.get('/login', (req, res) => {
    res.render('Login')
})


router.post('/login', async (req,res) => {

    let username = req.body.username
    let password = req.body.password

    let user = await db.oneOrNone('SELECT userid,username,password FROM users WHERE username = $1', [username])
      if(user) { //check for user's password

    bcryptjs.compare(password,user.password,function(error,result){
        if(result) {

        // put username and userId in the session
            if(req.session) {
                req.session.user = {userId: user.userid, username: user.username}
            }

            res.redirect('/users/articles')

        } else {
            res.render('login',{message: "Invalid username or password!"})
        }
    })

        }   else { // user does not exist
        res.render('login',{message: "Invalid username or password!"})
        }
    })


router.get('/login', (req, res) => {
    res.render('Login')
})

router.post('/register', async (req,res) => {

    let username = req.body.username
    let password = req.body.password
    
    let user = await db.oneOrNone('SELECT userid FROM users WHERE username = $1',[username])

        if(user) {
        res.render('register',{message: "User name already exists!"})
        } else {
          // insert user into the users table

        bcryptjs.hash(password,SALT_ROUNDS,function(error, hash){

            if(error == null) {
                db.none('INSERT INTO users(username,password) VALUES($1,$2)',[username,hash])
                .then(() => {
                    res.redirect('/login')
                    })
                }
            })
        }
    })  


module.exports = router
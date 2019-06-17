
const express = require('express')
const app = express()
const mustacheExpress = require('mustache-express')
const bodyParser = require('body-parser')
const session = require('express-session')
const path = require('path')
const checkAuthorization = require('./utils/checkAuthorization')
const PORT = 3000

const userRoutes = require('./routes/users')
const indexRoutes = require('./routes/index')

const pgp = require('pg-promise')({
    query: e => {
    }
});

const options = {
    host: 'localhost',
    database: 'newsdb',
    password: 'Fiddle123'
}

const VIEWS_PATH = path.join(__dirname,'/views')

app.engine('mustache', mustacheExpress(VIEWS_PATH + '/partials', '.mustache'))
app.set('views', VIEWS_PATH)
app.set('view engine', 'mustache')

app.use('/css',express.static('css'))

app.use(session({
  secret: 'rad',
  resave: false,
  saveUninitialized: false
}))

app.use(bodyParser.urlencoded({extended: false}))

app.use((req, res, next) => {
    res.locals.authenticated = req.session.user == null ? false : true
    next()
})

db = pgp(options)

app.use('/', indexRoutes)
app.use('/users', checkAuthorization, userRoutes)

app.listen(PORT, () => {
    console.log(`Server has started on ${PORT}`)
})

module.exports = db;
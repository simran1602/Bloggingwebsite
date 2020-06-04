const path = require ('path')
const { engine } = require('express-edge');
const express = require ('express')
const edge = require("edge.js")
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const Post = require('./database/models/Post.js')
const fileUpload = require('express-fileupload')
const expreesSession = require('express-session')
const connectMongo = require('connect-mongo')
const connectFlash = require('connect-flash')

const createPostController = require('./controllers/createPost')
const homePageController = require('./controllers/homePage')
const storePostController = require('./controllers/storePost')
const getPostController= require('./controllers/getPost')
const createUserController = require('./controllers/createUser')
const storeUserController = require('./controllers/storeUser')
const loginController = require('./controllers/login')
const loginUserController = require('./controllers/loginUser')
const logoutController = require('./controllers/logout')
const app = new express()
mongoose.connect("mongodb://localhost/blogip",{useUnifiedTopology: true})

app.use(connectFlash())
const mongoStore = connectMongo(expreesSession)
app.use(expreesSession({
 secret: 'secret',
 store: new mongoStore({
    mongooseConnection: mongoose.connection 
 })
}))
mongoose.connect('mongodb://localhost/blogip')
app.use(fileUpload());

app.use(express.static('public'));
app.use(engine);

app.set('views',`${__dirname}/views`);

app.use('*', (req,res,next)=>{
    edge.global('auth', req.session.userId)
    next()
})

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))

const storePost = require('./middleware/storePost')
const auth = require('./middleware/auth')
const redirectIfAuthenticated = require('./middleware/redirectifAuthenticated')

app.get('/', homePageController)
app.get('/posts/new', auth, createPostController)
app.get('/auth/logout',auth , logoutController)
app.post('/posts/store', auth, storePost, storePostController)
app.get('/auth/login', redirectIfAuthenticated , loginController)
app.post('/users/login', redirectIfAuthenticated , loginUserController)
app.get('/auth/register', redirectIfAuthenticated , createUserController)
app.get('/post/:id', getPostController)
app.post('/users/register', redirectIfAuthenticated , storeUserController)
app.use((req,res) => res.render('not-found'))
app.listen(4000,() =>{
    console.log('App listening on port 4000')
})
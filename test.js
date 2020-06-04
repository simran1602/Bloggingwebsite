const mongoose = require('mongoose')
const Post = require('./database/models/Post')

mongoose.connect('mongodb://localhost/blogip-test')
Post.find({},(error,posts)=>{
    console.log(error,posts)
    })/*
Post.create({
    title: 'My second Blog Post',
    subtitle: 'second Blog post description',
    content: 'hello.' 
},(error,post) =>{
   console.log(error,post); 
})*/
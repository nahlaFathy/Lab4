const express = require('express');
const app = express();
const port=3000;
const mongoose = require('mongoose');
const user =require('./routes/user')
const {Todo,todo}=require('./routes/post')
mongoose.connect('mongodb://localhost/nodedb',{useNewUrlParser: true , useUnifiedTopology: true})
.then(()=> console.log('connected to MongodDB ...'))
.catch((err)=>console.error('can not connect to MongoDB',err))



// a middleware that logs the request url, method, and current time 

app.use((req, res, next) => {
    var time = new Date();
    console.log('Time:', time.getHours(), ':', time.getMinutes(), ':', time.getSeconds())
    console.log('Method:', req.method)
    console.log('URL:', req.url)
    next()
  })
  
  // a global error handler that logs the error 
  
  app.use((err,req, res, next) => {
    console.error(err)
    res.status(500).send({ error: 'internal server error' })
    next(err);
  });
  
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use('/api/users',user)
  app.use('/api/todos',todo)

app.listen(port)



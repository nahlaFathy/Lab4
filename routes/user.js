const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const { body, validationResult } = require('express-validator');
const {Todo,todo}=require('./post')

const userSchema=new mongoose.Schema({
    username:{type:String,required:true},
    password:{type:String,required:true} ,
    firstname:{type:String,required:true},
    age:Number
})
 const  User=mongoose.model('users',userSchema)

//////////////////////////////////////////  1 ///////////////////////////////////////

router.post('/register',body('username').isLength({ min: 1 })
.withMessage('username is required'),
body('password').isLength({ min: 1 })
.withMessage('password is required')
, body('firstname').isLength({ min: 1 })
.withMessage('firstname is required')
, async(req, res) => {
       const errors = validationResult(req); 
       if (!errors.isEmpty()) return res.status(400).send({error: errors.errors[0].msg });        
  
       const user =new User({
        username:req.body.username,
        password:req.body.password,
        firstname:req.body.firstname,
        age:req.body.age
    })
    try{
        await user.save()
       res.send({message:'user was registered successfully'}) 
    }
    catch(err){
        res.send({error:err}) 
    }
    
  })

/////////////////////////////////////2/////////////////////////////////////////

router.post('/login',body('username').isLength({ min: 1 })
.withMessage('username is required'),
body('password').isLength({ min: 1 })
.withMessage('password is required')
, async(req, res) => {
       const errors = validationResult(req); 
       if (!errors.isEmpty()) return res.status(400).send({error: errors.errors[0].msg });        
  

       const registered=await User.find({$and:[{"username":req.body.username},{"password":req.body.password}]});
         console.log(registered[0]._id)
        const todos=await Todo.find({userId:registered[0]._id})
        console.log(todos)
       if(registered.length==0) return res.send({error:'invalid credentials'}) 
         return res.send({message:'user was logined successfully',username:registered[0].username,
         latestTodos:todos}) 
    
  })

///////////////////////////////////////// 3 ////////////////////////////////////////////
  router.get('/',  async(req, res)=> {
    
    const users= await User.find().select({firstname:1,_id:1})
     return res.send('registered users :' + users)
 
    })


////////////////////////// 4  /////////////////////////////////////////////

   router.patch('/:id', async(req, res) => {
    const user= await User.findByIdAndUpdate(req.params.id,{
        $set:{
         username:req.body.username,
         password:req.body.password,
         firstname:req.body.firstname,
         age:req.body.age
        }
    },{new:true});
        if(user)
          return res.send({message:'user was edited successfully',user:user})
        else
          return  res.send({message:'This user id is not exist'})

   })

  ////////////////////////////// 5 //////////////////////////

   router.delete('/:id', async(req, res) => {

        const user= await User.findByIdAndRemove(req.params.id);
        if(user) return res.send({message:'user deleted successfuly'})
        else return res.send({error:'this user id is not exist'})
   })
  
    module.exports=router
   // exports.User=User
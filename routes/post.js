const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const { body, validationResult } = require('express-validator');
//const {User,user} =require('./user')

const todoSchema=new mongoose.Schema({
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'users'  ,
        required:true 
    },
    title:{type:String,required:true,minlength:10,maxlength:20},
    body:{type:String,required:true,minlength:10,maxlength:500},
    tags:[{
        type:String,
        maxlength:10,
        required:false
    }],
    createdAt:{type:Date,default:Date.now},
    updatedAt:{type:Date}
  
})

const Todo=mongoose.model('todo',todoSchema)

//////////////////////////////////////////  1 ///////////////////////////////////////

router.post('/',body('userId').isLength({ min: 1 })
.withMessage('userId is required'),
body('title').isLength({ min: 1 })
.withMessage('title is required')
, body('body').isLength({ min: 1 })
.withMessage('body is required')
, async(req, res) => {
       const errors = validationResult(req); 
       if (!errors.isEmpty()) return res.status(400).send({error: errors.errors[0].msg }); 

       if(!mongoose.Types.ObjectId.isValid(req.body.userId))
       return res.status(400).send({error: 'invalid user id' }); 
      /* const userid= await todoUser.findById(req.body.userId)
       if(!userid)   return res.status(400).send({error: 'this  user id is not exist' }); 
  */
       const todo =new Todo({
        userId:req.body.userId,
        title:req.body.title,
        body:req.body.body,
        tags:req.body.tags
    })
    try{
        await todo.save()
       res.send({message:'a new todo is added successfully'}) 
    }
    catch(err){
        res.send({error:err}) 
    }
    
  })

  //////////////////////////////////////// 2 ////////////////////////////////////////////
  router.get('/:userId',  async(req, res)=> {
    
    const todo= await Todo.find({userId:req.params.userId})
      if(todo) return res.send('Todo for user id :' + 
      req.params.userId+' is ' +todo)
 
    })

/////////////////////////////////3/////////////////////////////////

router.get('/',  async(req, res)=> {
     console.log(req.query)
    const todo= await Todo.find().limit(parseInt(req.query.limit) )
    .skip(parseInt( req.query.skip))
      if(todo) return res.send('Todos list :'  +todo)
 
    })

////////////////////////// 4  /////////////////////////////////////////////

router.patch('/:id', async(req, res) => {
    const todo= await Todo.findByIdAndUpdate(req.params.id,{
        $set:{
         userId:req.body.userId,
         title:req.body.title,
         body:req.body.body,
         tags:req.body.tags,
         updatedAt:new Date()
        }
    },{new:true});
        if(todo)
          return res.send({message:'Todo was edited successfully',todo:todo})
        else
          return  res.send({message:'This todo id is not exist'})

   })

  ////////////////////////////// 5 //////////////////////////

   router.delete('/:id', async(req, res) => {

        const todo= await Todo.findByIdAndRemove(req.params.id);
        if(todo) return res.send({message:'todo deleted successfuly'})
        else return res.send({error:'this todo id is not exist'})
   })

  exports.todo=router
  exports.Todo=Todo
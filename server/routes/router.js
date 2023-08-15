const express = require('express');
const router = express.Router();
const {collection ,collection2}= require('../../models/mongodb');
const bcrypt = require('bcryptjs');
const { ObjectId } = require('mongodb');
const controller = require("../controller/controler")





//login and register
router.get('/',(req,res)=>{
    res.render("login")
});

router.get('/signup',(req,res)=>{
    res.render("signup")
});
// router.get('/index',isAuth,(req,res)=>{
//     res.render("index");
// });

router.post("/signup",async(req,res)=>{
 const{username,email,password} = req.body;
    

 let user = await collection.findOne({email});
 if(user){
    return res.redirect('/signup');
 }
 const hashedPassword = await bcrypt.hash(password,12);

user =new collection({
    username,
    email,
    password:hashedPassword
});


 try {
    await user.save();
    
    console.log('Data inserted successfully');
    res.redirect("/");
  } catch (error) {
    console.error('Error inserting data:', error);
    // Handle the error and send an appropriate response to the client
  }

});

router.post("/login",async(req,res)=>{
    
   
const {username,password}= req.body;
const user = await collection.findOne({username});
req.session.userId = user._id;
if(!user){
return res.redirect('/');
}
const isValid = await bcrypt.compare(password,user.password);
    if(!isValid){
        return res.redirect('/',{error:"create an account"})
    }
    try{
        // req.session.isAuth  = true ;
        // req.session.userId = user._id;
        res.redirect('/todopage')
       
    }catch(error){
        console.log(error);
        
    }
   });


    router.get('/todopage',controller.sessionChecker,async(req,res)=>{
        const userId = req.session.userId
        const data = await collection2.find({userId : userId})
        console.log(data)
        res.render('index', {data, userId})
    })
   //logout
   
    router.get('/logout', (req, res) => {
        console.log('Reached the logout page');
        req.session.destroy((err) => {
          if (err) {
           throw err;
          }
       
          res.redirect('/');
        })});
      

    //     //new ex
    //     if(req.session){
    //         req.session.destroy((err) => {
    //             req.session=null;
    //             if (err) {return err};
    //             res.redirect('/');
    //     })
    // }});
      
   ///todo routes
   //create new todos------
   router.get('/addtodo',controller.sessionChecker,(req,res)=>{

    // const userId = req.session.userId;
    res.render('addtodo')
   });

// //post new todo
router.post('/api/todos',  async(req, res)=> {
    try{
        const userId = req.session.userId;
      
          const todo={
              userId: userId,
              title:  req.body.title,
              description : req.body.description
          }

          //giving data to mongoDB
          await collection2.insertMany([todo])
          console.log(todo)
         
          res.redirect("/addtodo")

    }
    catch(err){
          console.log(err)
          res.redirect(`/addtodo`)
    }
}
);

// -------- update todo --------
//get  update todo
router.get('/update-user/:id',controller.sessionChecker,async(req,res)=>{
    const userId = req.session.userId
      const todoId = req.params.id
      const todo = await collection2.findOne({_id:todoId})
      res.render('updatetodo', {todo,userId})
    // const userId = req.session.userId;
  
   });

   //put update todo
   router.put('/api/todos/:id',async(req, res) => {
    const todoId = req.params.id;
    
    console.log(todoId)
    const update = { $set: {title:req.body.title, description:req.body.description, completed:req.body.completed} };

    await collection2.updateOne({_id: new ObjectId(todoId)}, update)
     .then(result => {
          console.log('Document updated successfully');
          console.log(result.modifiedCount); // Number of documents modified
          res.status(200).send('<script>alert(Data Updated Successfully!);</script>')
        })
        .catch(error => {
          console.error('Failed to update document:', error);
        });
}
);

//-----------delete todo -----------
router.delete('/api/todo/:id',async(req,res)=>{
    const todoId = req.params.id;
    await collection2.deleteOne({_id: new ObjectId(todoId)});
    res.status(200).send('<script>alert(Data Deleted Successfully!);</script>')
   
})




module.exports = router;
const db = require("../models");
const jwt  = require('jsonwebtoken');
const bcrypt = require('bcrypt');
require('dotenv').config()
const handleValidationErr = (error)=>{
    const allErr = []
    error.map(err=>{
        if (err.type == "Validation error") {
            allErr.push({type:err.type,path:err.path,message:err.message})
        }
    })

    return allErr
}

const JWT_SECRET = process.env.JWT_SECRET;

function signJwt (id){
    return jwt.sign({id},JWT_SECRET,{expiresIn:'1h'} )
    
  }


  

exports.Singup = async (req,res)=>{
    const { email, password,first_name,last_name,phonenumber,address,role} = req.body;
  
    try {
      // Check if the user already exists
      const existingUser = await db.Users.findOne({ where: { email } });
      if (existingUser) {
        return res.status(500).json({errorMessage:{errors:[{ message: 'Email already in use' ,path:"email"}]}});
      }
      // Hash the password
      const hashedPassword = await bcrypt.hash(password,10);
      // Create a new user
      const newUser = await db.Users.create({
        email,
        password: hashedPassword,
        first_name,
        last_name,
        phonenumber,
        address,
        role
      });
  

      // Return success response
      const token = signJwt(newUser.user_id)
      
   
      res.status(201).json({email,token});
    } catch (error) {
      console.error(error.message);
      res.status(500).json({ message: 'An error occurred while registering the user' ,errorMessage:error});
    }
}

exports.getlogin = async (req,res)=>{
  try {
    res.render('login')
  } catch (error) {
    console.log(error)
  }
}

exports.login = async (req,res)=>{
  const { email, password } = req.body;
  console.log(req.body);
  
    try {
      // Check if the user exists
      const user = await db.Users.findOne({ where: { email } });
      if (!user) {
        return res.status(400).json({ error: 'Invalid email or password' });
      }else{
        console.log(req.cookies);
        
      }

      console.log({password,hashedPassword:user.password});
      
  
      // Compare the provided password with the stored hashed password
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return res.status(400).json({ error: 'Invalid email or password' });
      }
  
      // Generate a JWT token
      const token = signJwt(user.user_id)
      
      //console.log(profileIsSetUp);
      const myCookie = res.cookie('token', token, { httpOnly: true, secure: true, maxAge:360000 }); 

      // console.log(myCookie);
      
      // Return the token
      res.status(201).json({message:"success",redirect:"/api/customers"});
    } catch (error) {
      error.erros?res.status(500).json({error:handleValidationErr(error.errors),type:"validation"}):res.status(500).json({ error: 'An error occurred while logging in',type:"invalid" });
    }
}
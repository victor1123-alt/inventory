const jwt = require('jsonwebtoken');
require('dotenv').config()
const JWT_SECRET = process.env.JWT_SECRET || "jwtSecret"
const { Users } = require('../models');


// console.log(JWT_SECRET);

const verifyCookies = (req, res, next) => {
  const token = req.cookies.token; // Get token from the cookie

  console.log({token,JWT_SECRET});
  
  if (!token) {
      return res.status(403).redirect("/api/users/login")
  }

  // Verify the token
  jwt.verify(token, JWT_SECRET, async(err, decoded) => {
    console.log(decoded);

      if (err) {
          return res.status(403).redirect('/api/users/login')
      }

      

      const user = await Users.findOne({where:{user_id:decoded.id}})
      // console.log(user);
      
      req.user = user; // Attach decoded token data to req object
      next(); // Proceed to the next middleware
  });
};

const isStaff = (req, res, next) => {
  if (req.user.role == 'staff' || req.user.role == "admin") {
    next(); // Proceed if the user is an admin

  }else{
    console.log(req.user.role == "admin");
    
      return res.status(403).redirect("/api/users/login")
  }
};

const isAdmin = (req, res, next) => {
  if (req.user.role !== 'admin') {
    console.log(req.user);
    
      return res.status(403).redirect("/api/users/login")
  }
  next(); // Proceed if the user is an admin
};

  module.exports = {verifyCookies,isAdmin,isStaff}

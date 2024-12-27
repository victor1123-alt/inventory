const express = require('express');
const app = express();
const db = require('./models');
require('dotenv').config()
app.use(express.json());
app.use(express.static('statics'));
const cookieParser = require('cookie-parser');

app.use(cookieParser())

app.set('view engine','ejs')
const PORT = process.env.PORT || 5000

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
  
// Import Routes
app.get('/',(req,res)=>{res.redirect('/api/customers')})
const customerRoutes = require('./routes/customer.routes');
const userRoutes = require('./routes/user.routes');
const { verifyCookies } = require('./middleware/verifyjwt');
app.use('/api/customers', verifyCookies,customerRoutes);
app.use('/api/users',userRoutes);

// Sync database and start server
db.sequelize.sync().then(() => {
    app.listen(3000, () => {
        console.log('Server is running on port 3000');
    });
});



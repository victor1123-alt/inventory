const db = require("../models");
const Customer = db.Customer;
const Sale = db.Sale;
const Phone = db.phoneBrand;
const ExcelJS = require('exceljs');
const bcrypt = require('bcrypt');


const handleValidationErr = (error)=>{
    const allErr = []
    error.map(err=>{
        if (err.type == "Validation error") {
            allErr.push({type:err.type,path:err.path,message:err.message})
        }
    })

    return allErr
}
// Add a new customer
exports.addCustomer = async (req, res) => {
    const user = req.user
    const {first_name,last_name,email,address,phone_number} = req.body;
    try {
        const adminactivity = await db.AdminActivity.create({admin_activity:"added customer",user_id:req.user.user_id})
        

        const customer = await Customer.create({admin_id:req.user.user_id,first_name,last_name,email,address,phone_number});
        res.status(201).send(customer);

    } catch (error) {
        res.status(500).send(handleValidationErr(error.errors));
    }
};

// Get all customers
exports.getCustomers = async (req, res) => {
    try {
        const customers = await Customer.findAll({include:[{model:db.Users}]});
        
        res.status(200).render('customer',{customers})
    } catch (error) {
        res.status(500).send({ message: error.message }); 
    }
};

// Get customer orders
exports.getCustomerOrders = async (req, res) => {
    try {
        const customerId = req.params.customerId;
        const orders = await Sale.findAll({
            where: { customer_id: customerId },
            include: [{ model: Customer },{model:db.Users}]
        });
        res.status(200).render('signlecustomer',{orders});
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
};

exports.getCustomerInventory = async (req, res) => {
    try {
        const Inventory= req.params.inventoryId;
        const orders = await Sale.findOne({
            where: { sale_id: Inventory },
            include: [{ model: Customer },{model:db.Users}]

        });        

        const phones = await Phone.findAll()
        res.status(200).render('singleinventory',{orders,phones});
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
};

exports.PostCustomerOrders = async (req, res) => {
    try {
        console.log(req.body);
        
        const sales = await Sale.create({...req.body,admin_id:req.user.user_id});
        const adminactivity = await db.AdminActivity.create({admin_activity:"added sales",user_id:req.user.user_id})

         // Fetch the updated list of sales
        
        res.status(200).json(sales)
    } catch (error) {
        console.log({error:error.message});
        
       error.errors ? res.status(500).json(handleValidationErr(error.errors)) :res.status(500).json({general:true,message:"error uploading sales"})
    }
};

exports.getSales = async (req,res) =>{
    try {
        const updatedSales = await Sale.findAll({
            include:[{model:Customer},{model:db.Users}]
        }); // Or any other query to get sales

        res.status(200).json(updatedSales)
    } catch (error) {
        console.log(error);
        
    }
}

exports.getAllPhones = async (req,res) =>{
    try {
        const updatedPhone = await Phone.findAll({include:[{model:db.PhoneModel}]}); // Or any other query to get sales

        res.status(200).json(updatedPhone)
    } catch (error) {
        console.log(error);
        
    }
}

exports.getAllCustomers = async (req,res) =>{
    try {
        const customers = await Customer.findAll({include:[{model:db.Users}]}); // Or any other query to get sales

        res.status(200).json(customers)
    } catch (error) {
        console.log(error);
        
    }
}

exports.getmyphonemodels = async (req,res) =>{
    try {
        const phonemodel = await db.PhoneModel.findAll({include:[{model:db.Users}]}); // Or any other query to get sales

        res.status(200).json(phonemodel)
    } catch (error) {
        console.log(error);
        
    }
}
exports.getmyadminactivity = async (req,res) =>{
    try {
        const adminactivity = await db.AdminActivity.findAll({include:[{model:db.Users}]}); // Or any other query to get sales

        res.status(200).render('adminaction',{adminactivity})
    } catch (error) {
        console.log(error);
        
    }
}

exports.addAdmin = async (req,res) =>{
    try {
        // const adminactivity = await db.AdminActivity.findAll({include:[{model:db.Users}]}); // Or any other query to get sales
        
        res.status(200).render('addadmin',{admin:req.user})
    } catch (error) {
        console.log(error);
        
    }
}

// exports.adminAction = async (req,res) =>{
//     try {
//         const adminactivity = await db.AdminActivity.findAll({include:[{model:db.Users}]}); // Or any other query to get sales

//         res.status(200).render('adminaction',{adminactivity})
//     } catch (error) {
//         console.log(error);
        
//     }
// }

exports.viewAllAdmins = async (req,res) =>{
    try {
        const admins = await db.Users.findAll({where:{role:{[Op.or]:["staff","admin"]},user_id:{[Op.ne]:req.user.user_id}}}); // Or any other query to get sales

        res.status(200).render('viewadmin',{admins})
    } catch (error) {
        console.log(error);
        
    }
}

exports.myprofile = async (req,res) =>{
    try {
        // const adminactivity = await db.AdminActivity.findAll({include:[{model:db.Users}]}); // Or any other query to get sales

        res.status(200).render('profile',{user:req.user})
    } catch (error) {
        console.log(error);
        
    }
}

exports.editProfile =  async (req, res) => {
    const userId = req.params.id; // Extract user ID from the request URL
    const updates = req.body; // Extract updates from the request body

    try {
        // Find user by ID
        const user = await db.Users.findByPk(userId);
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        // Update user details
        await user.update(updates);

        // Return updated user
        res.status(200).json({ message: "User updated successfully", user });
    } catch (error) {
        // Handle validation or other errors
        res.status(400).json({ error: error.message });
    }
}


// Download orders in Excel
exports.downloadOrders = async (req, res) => {
    try {
        const { sale_id } = req.params;

        // Fetch the specific sale
        const sale = await Sale.findOne({where:{sale_id}});

        if (!sale) {
            return res.status(404).send({ message: 'Sale not found' });
        }

        // Create a workbook and worksheet
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('Sale Report');

        // Define columns
        worksheet.columns = [
            { header: 'Sale ID', key: 'sale_id', width: 10 },
            { header: 'Customer ID', key: 'customer_id', width: 15 },
            { header: 'Item Details', key: 'items', width: 30 },
            { header: 'Status', key: 'status', width: 15 },
            { header: 'Created At', key: 'created_at', width: 20 },
            { header: 'Updated At', key: 'updated_at', width: 20 },
        ];

        // Parse `allitems` JSON field
        const allitems = sale.allitems || [];
        const items = Array.isArray(allitems)
            ? allitems.map(item => `${item.name || 'N/A'} x${item.quantity || 0}`).join(', ')
            : 'N/A';

        // Add row for the single sale
        worksheet.addRow({
            sale_id: sale.sale_id,
            customer_id: sale.customer_id,
            items: items,
            status: sale.status,
            created_at: sale.createdAt.toISOString(),
            updated_at: sale.updatedAt.toISOString(),
        });

        // Set response headers for file download
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        res.setHeader(
            'Content-Type',
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        );
        res.setHeader(
            'Content-Disposition',
            `attachment; filename=SaleReport-${sale_id}-${timestamp}.xlsx`
        );

        // Write workbook to response
        await workbook.xlsx.write(res);
        res.status(200).end();
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: 'An error occurred while generating the sale report.' });
    }
};

exports.dashboard = async (req,res)=>{
    
 try {
    const phones =await Phone.findAll({
        include:[{model:db.PhoneModel}]
    });

    const customers =await Customer.findAll();
    const totalcustomers = await Customer.count()
    const totalinventory= await Phone.count()
    const totalsales = await Sale.count()

    console.log(customers);
    
    const sales =  await Sale.findAll({
        include:[{model:Customer},{model:db.Users}]
    })
    res.render('index',{sales,phones,customers,totalcustomers,totalinventory,totalsales})
 } catch (error) {
    console.log(error);
    
 }
}

exports.getPhones = async (req, res) => {
    try {
        const phones = await Phone.findAll({include:[{model:db.PhoneModel}]});
        console.log(phones);
        
        res.status(200).render('phones',{phones})
    } catch (error) {
        res.status(500).send({ message: error.message }); 
    }
};

exports.getPhonesModels = async (req, res) => {
     const id = req.params.id;
     console.log(id);
     
    try {

        const selectedphone = await Phone.findOne({where:{phone_id:id}})

        const myphone = await db.PhoneModel.findAll({
            where:{
                phoneBrandId:id
            },
            include:[{model:Phone},{model:db.Users}]
        })
        // const phones = await Phone.findAll();
        console.log({myphone,selectedphone});
        
        res.status(200).render('phonemodels',{myphone,selectedphone })
    } catch (error) {
        res.status(500).send({ message: error.message }); 
    }
};

const path = require('path');
const phoneModel = require("../models/phone.model");
const saleModel = require("../models/sale.model");
const { Op } = require("sequelize");
const customerModel = require("../models/customer.model");

// Create a new phone brand with an uploaded image
exports.createPhoneBrand = async (req, res) => {
  
    try {
      const { brand, description, os } = req.body;
  
      // Validate required fields
      if (!brand || !description || !os) {
        return res.status(400).json({ validationerror: true, error: "All fields are required." });
      }

      console.log({brand,description,os});
      
  
      // Create Phone brand
      const phoneBrand = await db.phoneBrand.create({
        admin_id: req.user?.user_id, // Ensure `req.user` is defined
        brand,
        description,
        os,
      });
  
      // Log admin activity
      await db.AdminActivity.create({
        admin_activity: "added inventory",
        details: `Admin added ${brand}, operating system: ${os}`,
        user_id: req.user?.user_id,
      });
  
      res.status(201).json(phoneBrand);
    } catch (error) {
      console.error(error.message);
  
      // Handle validation errors gracefully
      if (error.errors) {
        return res.status(400).json({
          validationerror: true,
          error: handleValidationErr(error.errors),
        });
      }
  
      // General server error
      res.status(500).json({ error: "Internal server error" });
    }
  };

exports.createPhoneModel = async (req,res)=>{
    
    try {
        console.log(req.body);
        
        const phoneModel = db.PhoneModel.create({...req.body,admin_id:req.user.user_id});
        const adminactivity = await db.AdminActivity.create({admin_activity:"added phone",user_id:req.user.user_id})

        res.status(200).json(phoneModel)
    } catch (error) {
        console.log(error);
        
        res.status(500).json(handleValidationErr(error.errors))
    }
}

exports.deletePhone = async (req, res) => {
  const phoneId = req.params.id; // Get the ID from the route parameter
  const { password } = req.body; // Get the password from the request body
  const user = req.user  
  try {
    const isPasswordValid = await bcrypt.compare(password, user.password);

    // Check if password is correct
    if (!isPasswordValid) {
      return res.status(401).json({ success: false, message: 'Invalid password.' });
    }

    // Delete the phone from the database
    const result = await Phone.destroy({
      where: { phone_id: phoneId }, // Match the ID column
    });

    if (result) {
      res.status(200).json({ success: true, message: 'Phone deleted successfully.' });
    } else {
      res.status(404).json({ success: false, message: 'Phone not found.' });
    }
  } catch (error) {
    console.error('Error deleting phone:', error);
    res.status(500).json({ success: false, message: 'Internal Server Error.' });
  }
};

exports.toggleStockStatus = async (req, res) => {
    const { id } = req.params;
    const { newStockStatus, password } = req.body;
    const user = req.user
    const isPasswordValid = await bcrypt.compare(password, user.password);

    // Replace this with your admin password validation logic
    const adminPassword = "secure_password"; // Example password
    if (!isPasswordValid) {
        return res.status(401).json({ success: false, message: "Invalid password." });
    }

    try {
        const phone = await db.PhoneModel.findOne({where:{id}});
        if (!phone) {
            return res.status(404).json({ success: false, message: "Phone model not found." });
        }

        phone.stockstatus = newStockStatus;
        await phone.save();

        res.status(200).json({
            success: true,
            message: `Stock status updated to ${newStockStatus === 1 ? "In Stock" : "Out of Stock"}.`,
        });
    } catch (error) {
        console.error("Error updating stock status:", error);
        res.status(500).json({ success: false, message: "Internal server error." });
    }
};


exports.deletePhoneModel = async (req, res) => {
    const { id } = req.params;
    const { password } = req.body;
    const user = req.user
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!password) {
        return res.status(400).json({ success: false, message: "Password is required." });
    }

    try {
        // Replace with actual password verification logic
        if (!isPasswordValid) {
            return res.status(403).json({ success: false, message: "Invalid password." });
        }

        const phone = await db.PhoneModel.findOne({where:{id}});

        if (!phone) {
            return res.status(404).json({ success: false, message: "Phone model not found." });
        }

        await phone.destroy();

        res.status(200).json({ success: true, message: "Phone model deleted successfully." });
    } catch (error) {
        console.error("Error deleting phone model:", error);
        res.status(500).json({ success: false, message: "Internal server error." });
    }
};



exports.updateCustomer = async (req, res) => {
    const { id } = req.params;
    const { first_name, last_name, email, phone_number, address } = req.body;

    try {
        const customer = await Customer.findOne({where:{customer_id:id}});
        if (!customer) {
            return res.status(404).json({ message: "Customer not found" });
        }

        await customer.update({ first_name, last_name, email, phone_number, address });
        res.status(200).json({ message: "Customer updated successfully" });
    } catch (err) {
        console.error("Error updating customer:", err);
        res.status(500).json({ message: "Internal server error" });
    }
};

exports.deleteCustomer = async (req, res) => {
    const { id } = req.params;
    const { password } = req.body;

    const user = req.user
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {

        return res.status(403).json({ message: "Invalid password. Deletion not allowed." });
    }

    try {
        const customer = await Customer.findOne({where:{customer_id:id}});
        if (!customer) {
            return res.status(404).json({ message: "Customer not found" });
        }

        await customer.destroy();
        res.status(200).json({ message: "Customer deleted successfully" });
    } catch (err) {
        console.error("Error deleting customer:", err);
        res.status(500).json({ message: "Internal server error" });
    }
};

exports.logout =  (req, res) => {
    // Clear the JWT token stored in the cookie
    res.clearCookie('token', {
        httpOnly: true, 
        secure: true, // Set this to `true` if using HTTPS
        sameSite: 'strict', // Helps prevent CSRF
    });

    res.redirect('/api/users/login')
}

exports.deleteAdmin =async (req,res) =>{
    const { id } = req.params;
    const { password } = req.body;
    const user = req.user
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!password) {
        return res.status(400).json({ success: false, message: "Password is required." });
    }

    try {
        // Replace with actual password verification logic
        if (!isPasswordValid) {
            return res.status(403).json({ success: false, message: "Invalid password." });
        }

        const admin = await db.Users.findOne({where:{user_id:id}});

        if (!admin) {
            return res.status(404).json({ success: false, message: "Admin not found" });
        }

        await admin.destroy();

        res.status(200).json({ success: true, message: "deleted successfully." });
    } catch (error) {
        console.error("Error deleting user model:", error);
        res.status(500).json({ success: false, message: "Internal server error." });
    }
}

// Other controllers (e.g., createPhoneModel, createPhone) remain unchanged

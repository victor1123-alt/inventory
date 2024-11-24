const db = require("../models");
const Customer = db.Customer;
const Sale = db.Sale;
const Phone = db.phoneBrand;
const ExcelJS = require('exceljs');

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

    const {first_name,last_name,email,address,phone_number} = req.body
    try {
        const customer = await Customer.create({first_name,last_name,email,address,phone_number});
        res.status(201).send(customer);
    } catch (error) {
        res.status(500).send(handleValidationErr(error.errors));
    }
};

// Get all customers
exports.getCustomers = async (req, res) => {
    try {
        const customers = await Customer.findAll();
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
            // include: [{ model: Phone, attributes: ['brand', 'model', 'price'] }]
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
            include: [{ model: Customer }]

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
        
        const sales = await Sale.create(req.body);
         // Fetch the updated list of sales
        
        res.status(200).json(sales)
    } catch (error) {
        console.log(error);
        
       error.errors ? res.status(500).json(handleValidationErr(error.errors)) :""
    }
};

exports.getSales = async (req,res) =>{
    try {
        const updatedSales = await Sale.findAll({
            include:[{model:Customer}]
        }); // Or any other query to get sales

        res.status(200).json(updatedSales)
    } catch (error) {
        console.log(error);
        
    }
}

exports.getAllPhones = async (req,res) =>{
    try {
        const updatedPhone = await Phone.findAll(); // Or any other query to get sales

        res.status(200).json(updatedPhone)
    } catch (error) {
        console.log(error);
        
    }
}

exports.getAllCustomers = async (req,res) =>{
    try {
        const customers = await Customer.findAll(); // Or any other query to get sales

        res.status(200).json(customers)
    } catch (error) {
        console.log(error);
        
    }
}

exports.getmyphonemodels = async (req,res) =>{
    try {
        const phonemodel = await db.PhoneModel.findAll(); // Or any other query to get sales

        res.status(200).json(phonemodel)
    } catch (error) {
        console.log(error);
        
    }
}
// Download orders in Excel
exports.downloadOrders = async (req, res) => {
    try {
        const customerId = req.params.customerId;
        const orders = await Sale.findAll({
            where: { customer_id: customerId },
            include: [{ model: Phone, attributes: ['brand', 'model', 'price'] }]
        });

        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('Orders');

        worksheet.columns = [
            { header: 'Order ID', key: 'sale_id', width: 10 },
            { header: 'Brand', key: 'brand', width: 15 },
            { header: 'Model', key: 'model', width: 20 },
            { header: 'Quantity', key: 'quantity_sold', width: 10 },
            { header: 'Total Price', key: 'total_price', width: 15 },
            { header: 'Sale Date', key: 'sale_date', width: 15 }
        ];

        orders.forEach(order => {
            worksheet.addRow({
                sale_id: order.sale_id,
                brand: order.Phone.brand,
                model: order.Phone.model,
                quantity_sold: order.quantity_sold,
                total_price: order.total_price,
                sale_date: order.sale_date
            });
        });

        res.setHeader(
            'Content-Type',
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        );
        res.setHeader(
            'Content-Disposition',
            'attachment; filename=' + 'CustomerOrders.xlsx'
        );

        await workbook.xlsx.write(res);
        res.status(200).end();
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
};

exports.dashboard = async (req,res)=>{
 try {
    const phones =await Phone.findAll({
        include:[{model:db.PhoneModel}]
    });

    const customers =await Customer.findAll();
    console.log(customers);
    
    const sales =  await Sale.findAll({
        include:[{model:Customer}]
    })
    res.render('index',{sales,phones,customers})
 } catch (error) {
    console.log(error);
    
 }
}

exports.getPhones = async (req, res) => {
    try {
        const phones = await Phone.findAll();
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
        const myphone = await Phone.findOne({
            where:{
                phone_id:id
            },
            include:[{model:db.PhoneModel}]
        })
        // const phones = await Phone.findAll();
        console.log({myphone});
        
        res.status(200).render('phonemodels',{myphone})
    } catch (error) {
        res.status(500).send({ message: error.message }); 
    }
};

const path = require('path');
const phoneModel = require("../models/phone.model");
const saleModel = require("../models/sale.model");

// Create a new phone brand with an uploaded image
exports.createPhoneBrand = async (req, res) => {
    console.log(req.body);
    
  try {
    const { name, description } = req.body;

    // Check if the image file exists in the request
    const imageUrl = req.file ? req.file.filename : null;  // Store the relative file path

    // Create the phone brand with the image URL
    const phoneBrand = await Phone.create({ brand:name, description, imageUrl });

    res.status(201).json(phoneBrand);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: 'Error creating phone brand', error: error.message });
  }
};

exports.createPhoneModel = async (req,res)=>{
    
    try {
        console.log(req.body);
        
        const phoneModel = db.PhoneModel.create(req.body);

        res.status(200).json(phoneModel)
    } catch (error) {
        console.log(error);
        
        res.status(500).json(handleValidationErr(error.errors))
    }
}

// Other controllers (e.g., createPhoneModel, createPhone) remain unchanged

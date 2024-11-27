const express = require('express');
const customerController = require('../controllers/customer.controller');
const upload = require('../multer/utils');
const router = express.Router()
router.post('/add', customerController.addCustomer);
router.get('/listcustomers', customerController.getCustomers);
router.get('/orders/:customerId', customerController.getCustomerOrders);
router.get('/myorders/:inventoryId', customerController.getCustomerInventory);
router.get('/download/:customerId', customerController.downloadOrders);
router.get('/phones',customerController.getPhones);
router.post('/phone-brands', upload.single('image'),customerController.createPhoneBrand);
router.get('/models/:id',customerController.getPhonesModels);
router.post('/createmodel',customerController.createPhoneModel);
router.post('/createsale',customerController.PostCustomerOrders);
router.get('/sales',customerController.getSales);
router.get('/getallphones',customerController.getAllPhones)
router.get('/getcustomers',customerController.getAllCustomers)
router.get('/getphonemodels',customerController.getmyphonemodels);
router.get('/adminactivity',customerController.getmyadminactivity);
router.get('/addadmin',customerController.addAdmin)
router.get('/viewadmin',customerController.viewAllAdmins)
router.get('/myprofile',customerController.myprofile)
router.put("/users/:id",customerController.editProfile)
// home page view routes

router.get('/',customerController.dashboard)
module.exports = router;

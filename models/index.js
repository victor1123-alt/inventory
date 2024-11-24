const { Sequelize, DataTypes } = require("sequelize");
const dbConfig = require("../config/db.config.js");


const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
    host: dbConfig.HOST,
    dialect: dbConfig.dialect,
});

const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;

// Import models
db.Customer = require("./customer.model.js")(sequelize, DataTypes);
db.Phone = require("./phone.model.js")(sequelize, DataTypes);
db.Sale = require("./sale.model.js")(sequelize, DataTypes);
db.PhoneModel = require("./phone.model.js")(sequelize, DataTypes);
db.phoneBrand = require("./phone.brand.js")(sequelize, DataTypes);
db.Users = require("./user.model.js")(sequelize, DataTypes);

// Define relationships
db.Customer.hasMany(db.Sale, { foreignKey: 'customer_id' });
// db.phoneBrand.hasMany(db.Sale, { foreignKey: 'phone_id' });
db.Sale.belongsTo(db.Customer, { foreignKey: 'customer_id' });
// db.Sale.belongsTo(db.phoneBrand, { foreignKey: 'phone_id' });

db.PhoneModel.belongsTo(db.phoneBrand, { foreignKey: 'phone_id' });
db.phoneBrand.hasMany(db.PhoneModel, { foreignKey: 'phoneBrandId' });
module.exports = db;

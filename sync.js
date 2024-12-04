const db = require('./models');

db.sequelize.sync({ force: true }).then(() => {
    console.log("Database synced successfully.");
}).catch(err => {
    console.log("Error syncing database: " + err.message);
});

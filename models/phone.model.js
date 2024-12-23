const { phoneBrand } = require("./phone.brand");

module.exports = (sequelize, DataTypes) => {
  return sequelize.define("phoneModel", {
    admin_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notNull: { msg: "Admin ID is required" },
        notEmpty: { msg: "Admin ID must not be empty" },
      },
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: { msg: "Name is required" },
        notEmpty: { msg: "Name must not be empty" },
      },
    },
    parts: {
      type: DataTypes.STRING, // Use TEXT or LONGTEXT for larger inputs in older MySQL versions
      allowNull: false,
      validate: {
        notNull: { msg: "Please add a part" },
        notEmpty: { msg: "Parts must not be empty" },
      },
    },
    stockstatus: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1,
      validate: {
        notNull: { msg: "Stock status is required" },
        notEmpty: { msg: "Stock status must not be empty" },
      },
    },
    selling_price: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notNull: { msg: "Selling price is required" },
        notEmpty: { msg: "Selling price must not be empty" },
        isNumeric: { msg: "Selling price must be a valid number" },
      },
    },
    phoneBrandId: {
      type: DataTypes.INTEGER,
      references: {
        model: phoneBrand,
        key: "phone_id",
      },
      allowNull: false,
      validate: {
        notNull: { msg: "Phone Brand ID is required" },
        notEmpty: { msg: "Phone Brand ID must not be empty" },
      },
    },
  });
};

const { phoneBrand } = require("./phone.brand")

module.exports = (sequelize, DataTypes) => {
  return sequelize.define("phoneModel",{
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    parts: {
      type: DataTypes.STRING,  // Use TEXT or LONGTEXT for older MySQL versions
      allowNull: false,
    
  },
    stockstatus: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1
    },
    selling_price :{
      type:DataTypes.INTEGER,
      allowNull:false
    },
    phoneBrandId: {
      type: DataTypes.INTEGER,
      references: {
        model: phoneBrand,
        key: 'phone_id',
      },
      allowNull: false,
    },

  }
  )
}


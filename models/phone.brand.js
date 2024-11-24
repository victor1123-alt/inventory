module.exports = (sequelize, DataTypes) => {
    return sequelize.define("Phone", {
        phone_id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
        brand: { type: DataTypes.STRING, allowNull: false },
        imageUrl:{type:DataTypes.STRING,allowNull:false},
        description: { type: DataTypes.STRING},
        date_added: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
    }, { timestamps: false });
};

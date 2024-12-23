module.exports = (sequelize, DataTypes) => {
    return sequelize.define("Sale", {

        sale_id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
        admin_id: {
            type: DataTypes.INTEGER, allowNull: false, validate: { notNull: "admin is required to post irem" }
        },

        customer_id: {
            type: DataTypes.INTEGER, allowNull: false, validate: { notNull: "customer should exist before creating product" }
        },
        allitems: {
            type: DataTypes.TEXT, allowNull: false,
            get() {
                const rawvalue = this.getDataValue('allitems');
                return rawvalue ? JSON.parse(rawvalue) : null
            },
            set(value) {
                this.setDataValue('allitems', JSON.stringify(value))
            },
            validate: { notNull: "an item is required" }

        },
        status: { type: DataTypes.STRING, allowNull: false },
    }, { timestamps: true });   
};

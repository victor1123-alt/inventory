module.exports = (sequelize, DataTypes) => {
    return sequelize.define("Sale", {

        sale_id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
        admin_id: {type:DataTypes.INTEGER,allowNull:false},

        customer_id: { type: DataTypes.INTEGER, allowNull: false },
        allitems: { type: DataTypes.TEXT, allowNull: false ,
            get(){
                const rawvalue = this.getDataValue('allitems');
                return rawvalue ? JSON.parse(rawvalue) : null
            },
            set(value) {
                this.setDataValue('allitems',JSON.stringify(value))
            }
        },
        status: { type: DataTypes.STRING, allowNull: false },
    }, { timestamps: true });
};

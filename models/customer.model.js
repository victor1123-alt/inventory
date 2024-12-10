module.exports = (sequelize, DataTypes) => {
    const Customers = sequelize.define("Customer", {
        customer_id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
        admin_id: {type:DataTypes.INTEGER,allowNull:false},
        first_name: {
            type: DataTypes.STRING, allowNull: false, validate: {
                notEmpty: { msg: "firstname is required" },
                notNull: { msg: 'firstname  is required' }, // Custom error message
            }
        },
        last_name: {
            type: DataTypes.STRING, allowNull: false, validate: {
                notEmpty: { msg: "lastname is required" },
                notNull: { msg: 'lastname is required' }, // Custom error message
            }
        },
        phone_number: {
            type: DataTypes.STRING, allowNull: false, validate: {
                notEmpty:{msg:"your phonenumber is required"},
                notNull: { msg: 'phone number is required' }, // Custom error message
            },
        },
        email: {
            type: DataTypes.STRING, unique: true, allowNull: false, validate: {
                notEmpty:{msg:"email is required"},
                notNull: { msg: 'email is required' }, // Custom error message
            },
        },
        address: {
            type: DataTypes.STRING, allowNull: false, validate: {
                notEmpty:{msg:"physical address is required"},
                notNull: { msg: 'address is required' }, // Custom error message
            },
        },
        created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
    }, { timestamps: false });

    return Customers
};

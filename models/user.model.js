module.exports = (sequelize, DataTypes) => {
    const Users = sequelize.define("Users", {
        user_id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
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
        phonenumber: {
            type: DataTypes.STRING, allowNull: false, validate: {
                notEmpty:{msg:"your phonenumber is required"},
                notNull: { msg: 'phone_number is required' }, // Custom error message
            },
        },
        email: {
            type: DataTypes.STRING, unique: true, allowNull: false, validate: {
                notEmpty:{msg:"email is required"},
                notNull: { msg: 'email is required' }, // Custom error message
            },
        },
        password: {
            type: DataTypes.STRING, allowNull: false, validate: {
                notEmpty:{msg:"password is required"},
                notNull: { msg: 'password is required' }, // Custom error message
            },
        },
        address: {
            type: DataTypes.STRING, allowNull: false, validate: {
                notEmpty:{msg:"physical address is required"},
                notNull: { msg: 'address is required' }, // Custom error message
            },
        },
        role:{
            type: DataTypes.ENUM('staff','admin','user'),
            allowNull:false,
            defaultValue:"user",
        },
        created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
    }, { timestamps: false });

    return Users
};

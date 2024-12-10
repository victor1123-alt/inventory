module.exports = (sequelize, DataTypes) => {
    return sequelize.define("Phone", {
        phone_id: { 
            type: DataTypes.INTEGER, 
            primaryKey: true, 
            autoIncrement: true 
        },
        admin_id: { 
            type: DataTypes.INTEGER, 
            allowNull: false, 
            validate: { 
                notNull: { msg: "admin id is needed to post item" },
                notEmpty: { msg: "admin id must not be empty" } 
            } 
        },
        brand: { 
            type: DataTypes.STRING, 
            allowNull: false, 
            validate: { 
                notNull: { msg: "brand name is required" },
                notEmpty: { msg: "brand must not be empty" } 
            } 
        },
        os: { 
            type: DataTypes.STRING, 
            allowNull: false, 
            validate: { 
                notNull: { msg: "os name is required" },
                notEmpty: { msg: "os must not be empty" } 
            } 
        },
        description: { 
            type: DataTypes.STRING, 
            allowNull: false, 
            validate: { 
                notNull: { msg: "description is required" },
                notEmpty: { msg: "description must not be empty" } 
            } 
        },
        date_added: { 
            type: DataTypes.DATE, 
            defaultValue: DataTypes.NOW, 
            allowNull: false, 
            validate: { 
                notNull: { msg: "date added is required" } 
            } 
        }
    }, { 
        timestamps: false 
    });
};

module.exports = (sequelize, DataTypes) => {
    const adminactivity = sequelize.define("adminactivity", {
        admin_id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
        admin_activity :{
            type:DataTypes.ENUM("added customer","added sales","added inventory","edited customer","edited sales","edited inventory","deleted sales","deleted customer","deleted inventory","logedin"),
            allowNull:false,
        },
        user_id:{
            type:DataTypes.INTEGER,
            allowNull:false
        },
        created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
    }, { timestamps: false });

    return adminactivity
};

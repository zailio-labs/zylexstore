const {
    db
} = require('../../config');
const {
    DataTypes
} = require("sequelize");

const Cart = db.define('Cart', {
    user: {
        type: DataTypes.STRING,
        allowNull: false
    },
    id: {
        type: DataTypes.STRING,
        allowNull: false,
        primaryKey: true
    },
    purchased: {
        type: DataTypes.BOOLEAN,
        allowNull: false
    },
    date: {
        type: DataTypes.DATE,
        allowNull: false
    }
});

const saveToCart = async (json) => {
    const db = json.user.charAt(0);
    await Cart.create(json);
    return true;
}
const getFromCart = async (json) => {
    const db = json.user.charAt(0);
    return await Cart.findAll();
}

const removeFromCart = async (json) => {
    const object = await Cart.findOne({
        where: {
            ...json
        }
    });
    if (!object) return false;
    await product.destroy({
        where: {
            ...json
        }
    });
    return true;
};

module.exports = {
    saveToCart,
    getFromCart,
    removeFromCart
};

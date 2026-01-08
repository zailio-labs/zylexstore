const {db} = require('../../config');
const { DataTypes } = require("sequelize");

const Product = db.define('newProduct', {
  admin_id: {
    type: DataTypes.STRING,
    allowNull: false
  },
  id: {
    type: DataTypes.STRING,
    allowNull: false,
    primaryKey: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: true,
    defaultValue: 'watch'
  },
  img: {
    type: DataTypes.STRING,
    allowNull: true
  },
  subtitle: {
    type: DataTypes.STRING,
    allowNull: true
  },
  description: {
    type: DataTypes.STRING,
    allowNull: true
  },
  price: {
    type: DataTypes.INTEGER,
    allowNull: true,
    defaultValue: 0
  },
  firstBuyDiscount: {
    type: DataTypes.INTEGER,
    allowNull: true,
    defaultValue: 0
  },
  discountPrice: {
    type: DataTypes.INTEGER,
    allowNull: true,
    defaultValue: 0
  },
  LoginDiscount: {
    type: DataTypes.INTEGER,
    allowNull: true,
    defaultValue: 0
  },
  LastPrice: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  countOfProduct: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  tags: {
    type: DataTypes.STRING,
    allowNull: true
  },
  gender: {
    type: DataTypes.STRING,
    allowNull: true
  },
  returnPolicy: {
    type: DataTypes.STRING,
    allowNull: true
  },
  sizeCategory: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  size: {
    type: DataTypes.STRING,
    allowNull: true
  },
  cashOnDelivery: {
    type: DataTypes.STRING,
    allowNull: true
  },
  freeDelivery: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  category: {
    type: DataTypes.STRING,
    allowNull: true
  },
  colorSelections: {
    type: DataTypes.STRING,
    allowNull: true
  },
  showOnOffer: {
    type: DataTypes.BOOLEAN,
    allowNull: true
  },
  isComboOffer: {
    type: DataTypes.STRING,
    allowNull: true
  },
  comments: {
    type: DataTypes.JSONB,
    allowNull: true
  },
  offers: {
    type: DataTypes.JSONB,
    allowNull: true
  }
});

const productDef = async(id, newValue, typo) => {
  try {
  const record = await Product.findByPk(id);
  if(typo.type == 'set') {
    if (record) {
            record[typo.typo] = newValue;
            await record.save();
            console.log('Data updated successfully:');
        } else {
            console.log('Record not found.');
    }
  } else if(typo.type == 'remove') {
    const [element, sub] = typo.typo.split(':');
    if (record) {
            const values = record[element][sub];
            const NewRecord = values.filter(a=>a.id !== newValue.id);
            record[element] = { [sub]: NewRecord };
            await record.save();
            console.log('Data updated successfully:');
        } else {
            console.log('Record not found.');
    }
  } else if(typo.type == 'save') {
  const [element, sub] = typo.typo.split(':');
  if (record) {
            record[element] = { [sub]: [...record[element][sub], newValue] }
            await record.save();
            console.log('Data updated successfully:');
        } else {
            console.log('Record not found.');
        }
  } else if(typo.type == 'get') {
    return record;
  }
    } catch (error) {
        console.error('Error updating data:', error);
    }
};
const saveProduct = async(json)=> {
   console.log('addig a product:', JSON.stringify(json));
   await Product.create(json);
   return true;
}
const getProduct = async(json)=> {
   return await Product.findAll();
}
const productById = async(id) => {
   const product = await Product.findOne({
      where: {
          id
      }
   });
   if(product) {
     return {
        status: true,
        product: product.dataValues
     }
   } else return {status: false};
}
const updateProduct = async(id, json) => {
  const product = await Product.findOne({
    where: {
      id
    }
  });
  if(!product) return false;
  await product.update(json);
  return true;
}
const removeProduct = async(id) => {
   await Product.destroy({
      where: {
        id
      }
    }, {truncate: false});
  return true;
}

module.exports = { 
     productDef,
     saveProduct,
     getProduct,
     productById,
     updateProduct,
     removeProduct
};

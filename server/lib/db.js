const axios = require('axios')
const {gist, git, db} = require('../config');
const { Sequelize, DataTypes } = require("sequelize");

const Admin = db.define('Admin', {
  status_web: {
    type: DataTypes.STRING,
    allowNull: true,
    defaultValue: 'last seen not found'
  },
  see: {
    type: DataTypes.STRING,
    allowNull: true,
    defaultValue: 'false'
  },
  img: {
    type: DataTypes.STRING,
    allowNull: true,
    defaultValue: 'https://i.imgur.com/JOkWGYr.jpeg'
  }
});

const Users = db.define('UsersBase', {
  username: {
    type: DataTypes.STRING,
    allowNull: true
  },
  password: {
    type: DataTypes.STRING,
    allowNull: true
  },
  mail: {
    type: DataTypes.STRING,
    allowNull: true
  },
  date: {
    type: DataTypes.DATE,
    allowNull: true
  },
  time: {
    type: DataTypes.TIME,
    allowNull: true
  },
  id: {
    type: DataTypes.INTEGER,
    allowNull: true,
    primaryKey: true
  },
  from_ref_id: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  next_my_ref: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  token: {
    type: DataTypes.STRING,
    allowNull: true
  },
  resisted: {
    type: DataTypes.BOOLEAN,
    allowNull: true
  },
  forgot: {
    type: DataTypes.STRING,
    allowNull: true
  },
  img: {
    type: DataTypes.STRING,
    allowNull: true
  },
  typeLogin: {
    type: DataTypes.STRING,
    allowNull: true
  },
  status_web: {
    type: DataTypes.STRING,
    allowNull: true
  },
  see: {
    type: DataTypes.STRING,
    allowNull: true
  },
  cart: {
    type: DataTypes.JSONB,
    allowNull: true
  }
});
const Chat = db.define('Chat', {
  auth: {
    type: DataTypes.STRING,
    allowNull: true
  },
  typo: {
    type: DataTypes.STRING,
    allowNull: true
  },
  chat: {
    type: DataTypes.STRING,
    allowNull: true
  }
});

async function getChat(id) {
  return await Chat.findAll(
    {
      where: {
        auth: id
      }
    }
  );
};
async function setChat(id, typo,msg) {
  return await Chat.create(
    {
      auth: id,
      typo: typo,
      chat: JSON.stringify(msg)
    }
  );
};
/*
const {Octokit} = require("@octokit/core");
const octokit = new Octokit({
  auth: git
})
*/
async function getUsers() {
  return await Users.findAll();
}

async function updateImg(img, a) {
  const data = await Users.findOne({
    where: {
      token: a
    }
  })
  return await data.update({img});
}
async function registerUser(id, options){
  formatter = new Intl.DateTimeFormat([], {
  timeZone: 'Asia/Kolkata',
  year: 'numeric',
  month: 'numeric',
  day: 'numeric',
  hour: 'numeric',
  minute: 'numeric',
  second: 'numeric'
});
  const [date, time] = formatter.format(new Date()).split(',')
  Users.create({
     username: options.username,
     mail: options.mail,
     password: options.password,
     time,
     date,
     id: options.id,
     token: id,
     from_ref_id: options.from_ref_id,
     next_my_ref: options.next_my_ref,
     resisted: false,
     typeLogin: options.typeLogin
  })
  return true;
}
async function verifiedUsers() {
  return await Users.findAll({
    where: {
      resisted: true
    }
  })
}
async function unverifiedUsers() {
  return await Users.findAll({
    where: {
      resisted: false
    }
  })
}
async function updateByCode(token, update) {
  const db = await Users.findOne({
    where: {
      token
    }
  })
  await db.update(update);
  return db;
}
async function updateUserStatus(id) {
  await Users.update({resisted: true},{
    where: {
      token: id
    }
  })
  await Users.destroy({
    where: {
      token: id,
      resisted: false
    }
  }, {truncate: false});
  return true;
}
const updateAdminCode = async(code) => {
  const db = await Admin.findOne();
  if(!db) Admin.create(code);
  db.update(code);
};
const getAdminInfo = async() => {
  console.log("humhiho");
  //eventEmitter.emit('hehehe', "inrl is best");
  const db = await Admin.findOne();
  if(!db) return {
    dataValues: {
      status_web: 'last seen not found',
      see: 'false',
      img: 'https://i.imgur.com/JOkWGYr.jpeg'
    }
  };
  return db;
}
module.exports = {
  getUsers,
  registerUser,
  updateUserStatus,
  verifiedUsers,
  updateByCode,
  unverifiedUsers,
  updateImg,
  setChat,
  getChat,
  updateAdminCode,
  getAdminInfo
}

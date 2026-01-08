const { Sequelize, DataTypes } = require("sequelize");

module.exports = {
  URL: "https://www.inrl.online",//process.env.URL || 'https://e7c0c6c4-3705-48f9-9b0e-6b67c0e7eb09-00-2444zy4fky691.sisko.replit.dev/',
  git: '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',
  gist: 'c8486182cce257d58d9a5c69ef7c3bb0',
  imgur: '3ca8036b07e0f25',
  ADMIN_ID: 'tonoccds',
  admin_suid: 'toehonguhes',
  mail: 'inrlwabots@gmail.com',
  db: new Sequelize('postgresql://postgres:bDAlGwwNEjxTDPitPtIAHzoNoQRYnntc@roundhouse.proxy.rlwy.net:35371/railway',{
    dialect: 'postgres',
    ssl: true,
    protocol: 'postgres',
    dialectOptions: {
      native: true,
      ssl: {
        require: true,
        rejectUnauthorized: false
      }
    }, logging: false })
  /*new Sequelize({
          dialect: "sqlite",
          storage: "./database.db",
          logging: false
  })
  */
}

//"https://api.github.com/gists/c8486182cce257d58d9a5c69ef7c3bb0"

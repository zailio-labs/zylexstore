const {
       productDef,
       saveProduct,
       getProduct,
       productById,
       updateProduct,
       removeProduct
} = require('./db/product');
const {searchCurrect} = require('./search/search');
const pincode = require('./db/pincode');
const {sendMail} = require('./register');
const {
       getUsers,
       registerUser,
       updateUserStatus,
       verifiedUsers,
       updateByCode,
       unverifiedUsers,
       updateImg,
       getChat,
       setChat,
       updateAdminCode,
       getAdminInfo
} = require('./db');
const {
       makeid,
       filterMostSuitable
} = require('./fn')

module.exports = {
       searchCurrect,
       pincode,
       sendMail,
       getUsers,
       registerUser,
       updateUserStatus,
       verifiedUsers,
       updateByCode,
       unverifiedUsers,
       getChat,
       setChat,
       updateImg,
       makeid,
       filterMostSuitable,
       updateAdminCode,
       getAdminInfo,
       productDef,
       saveProduct,
       getProduct,
       productById,
       updateProduct,
       removeProduct
};

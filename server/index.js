const express = require("express")
const http = require("http")
const { Server } = require("socket.io")
const cors = require("cors");
const path = require('path');
const config = require('./config');

const descc = 'We are here for unbeatable deals...';

const {
       sendMail,
       registerUser,
       updateUserStatus,
       verifiedUsers,
       unverifiedUsers,
       updateByCode,
       makeid,
       filterMostSuitable,
       setChat,
       getChat,
       updateAdminCode,
       getAdminInfo,
       getProduct,
       saveProduct,
       productDef,
       searchCurrect
} = require('./lib');
const fileUpload = require('express-fileupload');
config.db.sync();

const app = express()
app.use(cors())
app.use(fileUpload());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const server = http.createServer(app)
/*
app.use((req, res, next) => {
  if(!host_url) {
    host_url = req.protocol + '://' + req.get('host');
  }
  next();
});
*/
const io = new Server(server, {
    cors: {
           origin: undefined,
           methods: ["GET", "POST"]
    }
});

module.exports = { io };


let host_url = config.URL;
app.use('/api',require('./router/api'));
app.use('/icon', require('./router/icon'));
app.use('/notification', require('./router/notification'));
io.on("connection", async(socket) => {
       const clientIpAddress = socket.handshake.address;
       console.log(`Client connected from IP address: ${clientIpAddress}`);
       let verified = (await verifiedUsers()).map(a=>a.dataValues) || [];
       let unverified = (await unverifiedUsers()).map(a=>a.dataValues) || [];
       let products = (await getProduct()).map(a=>a.dataValues) || [];
       io.emit('connection-success', true) 
socket.on('check-register', async({username, mail})=>{
    let res = true;
    for(const i in verified) {
      if(verified[i].username == username) {
        res = 'already used username';
        break;
      } else if(verified[i].mail == mail) {
        res = 'already used mail';
        break;
      }
    }
    io.emit('checked-register',res)
  })
    socket.on('mail-register', async({mail,id, password, username,typeLogin, next_my_ref, from_ref_id })=>{
      const otp = makeid(6,'int');
      const status = await sendMail(mail, id, otp, {need: 'register', method: 'email'}, host_url);
      if(status == true) await registerUser(id, {mail, password, username, id: otp, typeLogin, next_my_ref, from_ref_id })
      io.emit('register-send',status)
  });
  socket.on('authentication-send', (a)=>{
    if(!unverified.map(a=>a.token).includes(a)) {
      io.emit('authentication-not-found', true)
    }
  });

  socket.on('authentication-validate', async({mail, password, otp, code})=>{
    const infoUser = unverified.filter(a=>a.token == code)[0];
    if(infoUser.mail != mail) {
      io.emit('authentication-error','Internal Server Error!')
    } else if(infoUser.password != password) {
      io.emit('authentication-error','invalid password!')
    } else if(infoUser.id != otp) {
      io.emit('authentication-error','request failed with status code 404!')
    } else {
      const json = { 
             from_ref_id: infoUser.from_ref_id,
             next_my_ref: infoUser.next_my_ref,
             reg_pkocd: infoUser.token
      };
      await updateUserStatus(code);
      io.emit('authentication-success', json);
      verified = await verifiedUsers();
      unverified = await unverifiedUsers();
    }
  })
  socket.on('login-confirm',({mail, password})=>{
    const user = verified.filter(a=> (a.mail == mail)|| (a.username == mail));
    if(!user || !user[0]) {
      io.emit('login-validate', 'user not found')
    } else if(user[0].password != password) {
      io.emit('login-validate', 'password mismatch')
    } else {
      io.emit('login-validate', {
             from_ref_id: user[0].from_ref_id,
             next_my_ref: user[0].next_my_ref,
             reg_pkocd: user[0].token
      });
    }
  });
  socket.on('check-forgot', async({mail})=>{
    const userInfo = verified.filter(a=>a.mail == mail);
    if(!userInfo[0]) {
      return io.emit('forgot-info', 'no mail');
    } else {
      const {token, typeLogin} = userInfo[0];
      const id = makeid(8);
      await sendMail(mail, token, id, {need: 'reset', method: typeLogin }, host_url);
      await updateByCode(token,{forgot:id});
      io.emit('forgot-info', true)
        }
  })
  socket.on('reset-data', ({code,forgot})=> {
    const info = verified.filter(a=>a.token == code);
    if(!info[0] || !info[0].forgot || info[0].forgot != forgot) {
      io.emit('reset-responce', false)
    }
  });
  socket.on('reset-pass', async({code, password})=>{
    const info = verified.filter(a=>a.token == code);
    if(info[0] && info[0].forgot) {
      if(info[0].password  == password) {
        return io.emit('reset-status', false)
      } else {
        await updateByCode(code,{forgot:null, password});
        return io.emit('reset-status', true)
      }
    }
  });
socket.on('home-updates', async(user)=>{
       console.log(user);
       const info = user.auth && user.auth.reg_pkocd ? verified.filter(b=>b.token == user.auth.reg_pkocd) : false;
       if(info[0]) console.log(info[0].username);
       io.emit('top-today-offers', {
        status: true,
        time: '23:20:45',
        img: 'https://i.imgur.com/lVVR1Nb.jpeg',
        title: 'test',
        desc: 'not dound',
        price: 'get it low as 399'
      });
       const lists = products.map(a => ({...a, type: 'loaded'})) || [];
       const today = lists.filter(a=>a.category === 'today');
       const firstFiveToday = today.slice(0, 5);
       firstFiveToday.push({type: 'loading'});
       const shoes = lists.filter(a=>a.category === 'shoes');
       const firstFiveShoes = shoes.slice(0, 5);
       firstFiveShoes.push({type: 'loading'});
       const watch = lists.filter(a=>a.category === 'watch');
       const firstFiveWatch = watch.slice(0, 5);
       firstFiveWatch.push({type: 'loading'});
       io.emit('lists-of-products-home', {
              client: info && info[0] ? info[0] : false,
              description: descc,
              status: true,
              1: {
                     scroll: 2,
                     px: 0,
                     head: "Today Offer's",
                     list: firstFiveToday.map(a=>({
                            img: a.img,
                            name: a.name,
                            description: a.description,
                            LastPrice: a.LastPrice,
                            id: a.id,
                            type: a.type
                     }))
              },
              2: {
                     scroll: 2,
                     px: 0,
                     head: "Shoes",
                     list: firstFiveShoes.map(a=>({
                            img: a.img,
                            name: a.name,
                            description: a.description,
                            LastPrice: a.LastPrice,
                            id: a.id,
                            type: a.type
                     }))
              },
              3: {
                     scroll: 2,
                     px: 0,
                     head: "Watches",
                     list: firstFiveWatch.map(a=>({
                            img: a.img,
                            name: a.name,
                            description: a.description,
                            LastPrice: a.LastPrice,
                            id: a.id,
                            type: a.type
                     }))
              }
       });
});
socket.on('get-searched-output', (key) => {
       if(!key.sid) return;
       const sortedData = filterMostSuitable(key.sid, products);
       if(!sortedData.length) {
              socket.emit('search-results',{
                     status: true,
                     category: [{display: 'watch', category: 'watch'},{display:'shoes', category: 'watch'}, {display: 'shirts', category: 'watch'},{display: 'toys', category: 'watch'}, {display: 'wears', category: 'watch'},{display: 'headset', category: 'watch'} ],
                     message: `there have no any products with ${key}`,
                     list: []
              });
       } else {
              const list = sortedData.slice(0,14).map(a=> {
                     return {
                            id: a.id,
                            img: a.img.split(',')[0],
                            title: a.name,
                            type: 'info',
                            price: a.price,
                            freeDelivery: a.freeDelivery,
                            LastPrice: a.LastPrice,
                            discountPrice: a.discountPrice,
                            isTrusted: true,
                            buys: 780,
                            isAvailable: true
                     }
              });
              if(list.length == 14) list.push({type: 'loading'});
              socket.emit('search-results', {
                     status: true,
                     message: 'true',
                     category: [{display: 'watch', category: 'watch'},{display:'shoes', category: 'watch'}, {display: 'shirts', category: 'watch'},{display: 'toys', category: 'watch'}, {display: 'wears', category: 'watch'},{display: 'headset', category: 'watch'} ],
                     list: list
              });
       }
//
});
socket.on('show-more-product-home', async(json)=> {
       let updatedProducts;
       for (let i = 1; i <= json.scroll; i++) {
              let start = (i - 1) * 5;
              let end = i * 5;
              if(json.scroll == i) {
                     const total = json.scroll+i*5;
                     const lists = products.length ? products.map(a => ({...a, type: 'loaded'})) : [];
                     json.list == 1 ? 
                            updatedProducts = lists.filter(a=>a.category === 'today').slice(start, end) :
                     json.list == 2 ? 
                            updatedProducts = lists.filter(a=>a.category === 'shoes').slice(start, end) :
                            updatedProducts = lists.filter(a=>a.category === 'watch').slice(start, end);
                     products.length > total ? updatedProducts.push({type: 'loading'}) : updatedProducts.push({type: 'done'});
                     io.emit('new-more-products-home', {
                            scroll: json.scroll + 1,
                            px: json.px,
                            id: json.list,
                            list: updatedProducts.map(a=>({
                                   img: a.img,
                                   name: a.name,
                                   description: a.description,
                                   LastPrice: a.LastPrice,
                                   id: a.id,
                                   type: a.type
                            }))
                     });
                     break;
              }
       }
});
socket.on('close-home-top-offer', id => {
       
});
socket.on('cart-update', ({auth})=>{
       io.emit('cart-updates', {
              status: true,
              msg: true,
              list: [{
     id: 'ljsjsjshshhsj',
     name: 'wadnnsnndsnjtch',
     price: '100',
     img: 'https://image.png',
     quantity: 1,
     total: '20',
     desc: 'beter then your emaginatndnndnnddddion',
     discount:false,
     type: 'cart'
   },
{
     id: 'oekdjsjsjshshhsj',
     name: 'watch',
     price: '100',
     img: 'https://image.png',
     quantity: 1,
     total: '20',
     desc: 'beter then your emagination',
     discount: true,
     type: 'done'
  },
{
     id: 'paokdjsjsjshshhsj',
     name: 'watch',
     price: '100',
     img: 'https://image.png',
     quantity: 1,
     total: '20',
     desc: 'beter then your emagination',
     discount: true,
     type: 'cart'
}]
       });
});
       socket.on('search-update', async(msg) => {
              console.log(searchCurrect(msg));
              console.log(await searchCurrect(msg));
       });
       socket.on('get-product-info', async(data) => {
              const {auth, pid} = data;
              if(!pid) return false;
              const json = {
                     isAvailable: true,
                     category: [{display: 'watch', category: 'watch'},{display:'shoes', category: 'watch'}, {display: 'shirts', category: 'watch'},{display: 'toys', category: 'watch'}, {display: 'wears', category: 'watch'},{display: 'headset', category: 'watch'} ],
                     status: true,
                     isPurchased: false,
                     userInfo: {} 
              };
              if(auth && auth.reg_pkocd) {
                     const info = verified.filter(b=>b.token == auth.reg_pkocd);
                     if(info && info[0]) {
                            json.userInfo = { 
                                   username: info[0].username,
                                   img: info[0].img || 'https://i.imgur.com/JOkWGYr.jpeg',
                                   id: info[0].id
                            }
                     }
              };
              const productInfo = await productDef(pid, {}, { type: 'get'});
              json.item = {
                     subtitle: productInfo.subtitle,
                     keywords: productInfo.tags,
                     img: productInfo.img.split(','),
                     price: productInfo.price,
                     discountPrice: productInfo.discountPrice,
                     LastPrice: productInfo.LastPrice,
                     cashOnDelivery: productInfo.cashOnDelivery,
                     freeDelivery: productInfo.freeDelivery,
                     returnPolicy: productInfo.returnPolicy,
                     description: productInfo.description,
                     sizeCategory: productInfo.sizeCategory,
                     size: productInfo.size,
                     colorSelections: productInfo.colorSelections,
                     offers: productInfo.offers.ofr
              };
              const cmnts = productInfo.comments.cmt.slice(0,10);
              json.comments = cmnts.map(a=> {
                     if(a.userId == auth.reg_pkocd) {
                            if(a.likes.includes(auth.reg_pkocd)) {
                                   return { ...a, me: true, liked: true };
                            }
                            return { ...a, me: true, liked: false };
                     }
                     return { ...a, me: false, liked: false };
              });
              if(cmnts.length == 10) json.comments.push({type: 'promise'});
              json.sellerInfo = {
                     name: 'Inrl test',
                     wa: 'https://wa.me/917025099154',
                     ig: 'https://www.instagram.com/inrl.cc',
                     img: 'https://img.com',
                     isTrusted: true
              };
              return io.emit('product-info', json);
       });
       socket.on('add-a-comment', async(cmt)=> {
              const json = cmt[0];
              if(!json || !json.pid) return;
              delete json.me;
              return await productDef(json.pid, json, {type: 'save', typo: 'comments:cmt' });
       });
       socket.on('remove-a-cmt', async({id, pid, auth}) => {
              if(!id || !pid || !auth) return;
              return await productDef(pid, {id}, {type: 'remove', typo: 'comments:cmt' });
       });
       socket.on('load-comments', async({ id, count, auth}) => {
              if(!id || !count || !auth) return;
              const product = await productDef(id, {}, {type: 'get'});
              const cmts = product.comments.cmt.slice(count,count+10);
              const comments = cmts.map(a=> {
                     if(a.userId == auth.reg_pkocd) {
                            if(a.likes.includes(auth.reg_pkocd)) {
                                   return { ...a, me: true, liked: true };
                            }
                            return { ...a, me: true, liked: false };
                     }
                     return { ...a, me: false, liked: false };
              });
              if(comments.length == 10) comments.push({type: 'promise'});
              io.emit('new-comments', comments);
       });
       socket.on('add-cmt-like', ({ auth, id, cmtId }) => {
              console.log(auth, id, cmtId);
       });
       socket.on('remove-cmt-like', ({ auth, id, cmtId }) => {
              console.log(auth, id, cmtId);
       });
       socket.on('add-to-cart', ({ auth, id }) => {
              console.log(auth, id);
       });
  //upload-product
  socket.on('uploade-products', async(json) => {
         if(!json.auth || !json.admin_id ||  json.admin_id != config.admin_suid) return;
         let listId = 'none';
         if(products.length) listId = products.map(a=>a.id);
         const newId = makeid(12);
         while (listId == newId) newId = makeid(12);
         json.id = newId;
         if(json.img) json.img = json.img.join(',');
         if(json.tags) json.tags = json.tags.join(',');
         if(json.size) json.size = json.size.join(',');
         if(json.color) json.color = json.color.join(',');
         await saveProduct(json);
         console.log('one more product added now');
         return;
  });
  /*contact*/
  socket.on('load-u-to-a-chats', async(id) =>{
         if(!id || !id.id) return 'Error 40.4';
         let chat = await getChat(id.id);
         const admin = await getAdminInfo();
         const msgs = [];
         chat = chat.map(a=>a.dataValues).map(a=>msgs.push({[a.typo]: JSON.parse(a.chat)}));
         io.emit('user-admin-chats', {
                msgs: msgs,
                user: verified.filter(b=>b.token== id.id)[0],
                admin: admin.dataValues
         });
  });
  socket.on('user-to-admin', async(json) => {
    if(!json || !json.id || !json.typo) return 'Error 40.4';
    await setChat(json.id, json.typo, json.chat);
    let chat = await getChat(json.id);
    const admin = await getAdminInfo();
    const msgs = [];
    chat = chat.map(a=>a.dataValues).map(a=>msgs.push({[a.typo]: JSON.parse(a.chat)}));
    io.emit('user-admin-chats', {
           msgs: msgs,
           user: verified.filter(b=>b.token==json.id)[0],
           admin: admin.dataValues
    });
  });
    socket.on('admin-updates', async(json)=>{
           console.log('got a admin request', json);
           if(!json) return;
           if(json.type == 'check') {
                  if(json.id == config.ADMIN_ID) {
                         io.emit('admin-info', {status: true});
                  } else {
                         io.emit('admin-info', {status: false});
                  }
           } else if(json.type == 'update') {
                  if(json.id != config.ADMIN_ID) return;
                  delete json.id;
                  delete json.type;
                  await updateAdminCode(json);
                  io.emit('admin-events', true);
           }
    });
       socket.on('disconnect', () => {
              console.log(`User disconnected ${clientIpAddress}`);
       });
});

const dirName = __dirname.slice(0, -7)
app.use(express.static(path.join(dirName, '/client/build')))
// '*' - any route that is not declared in the api routes
console.log(path.join(dirName, '/client/build'))
app.get('*', (req, res) => res.sendFile(path.resolve(dirName, 'client', 'build', 'index.html')))
// ? ----------------------------- End - While in production: -----------------------------

const PORT = process.env.PORT || 5000

server.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`)
})


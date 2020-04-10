var login = require('./login');
var driver = require('./driver');
var manager = require('./manager');

module.exports=function(app){
  //路由控制器和实现路由功能的函数都放到 index.js 里
//  主页即登录界面
  app.get('/',function(req,res){
    res.redirect('/login');
  });
  
  app.use('/login',login);
  app.use('/driver',driver);
  app.use('/manager',manager)


}

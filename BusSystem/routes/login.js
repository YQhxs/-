// 用户登录请求
const express = require('express');
const router = express.Router();
// 路由器级中间件

var operation = require('../GRUD/operation')
// 在通过url访问时，若之前没退出，则直接进入相应的主页；否则需要登录
//在相应主页刷新时会再次进入这个文件，此时是没退出的情况
router.use(function(req,res,next){
    if(req.signedCookies.haslogin == 'yes' && req.signedCookies.identify == 'manager'){
        res.redirect('/manager/index');
    }else if(req.signedCookies.haslogin == 'yes' && req.signedCookies.identify == 'driver'){
        res.redirect('/driver/querymyselfillegal');
    }else{
        next();
    }
});


router.get('/',function(req,res){
    //GET localhost：3000/login
    res.render('login');
});

router.post('/',function(req,res,next){
    //POST localhost：3000/login

    operation.isuser(req,res,next)
});

module.exports = router;
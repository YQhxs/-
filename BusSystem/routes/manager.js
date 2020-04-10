// 管理者的所有请求
const express = require('express');
const router = express.Router();

var operation = require('../GRUD/operation')
// 通过url访问时，先判断之前是否退出，若没则直接进入相应页面；否则进登录页面
router.use(function(req,res,next){
    // console.log('Signed Cookies: ', req.signedCookies);

    if(req.signedCookies.haslogin == 'yes' && req.signedCookies.identify == 'manager'){
        next();
    }
    else{
        res.redirect('/login');
    }
});
router.get('/logout',function(req,res,next){
    res.clearCookie('haslogin');
    res.clearCookie('id');
    res.clearCookie('identify');
    res.redirect('/login');
})
// get和post请求
router.get('/index',function(req,res){
    operation.getuserinfo(req,res);
});

router.get('/querydriverbase',function(req,res){
    res.render('driverinfo',{results:[]});
});
router.get('/querydriverillegal',function(req,res){
    res.render('driverillegal',{results:[]});
});
router.get('/querybusteamillegal',function(req,res){
    res.render('busteamillegal',{results:[]});
});

router.get('/insertdriverinfo',function(req,res){
    operation.getchose(req,res);
});
router.get('/insertbusinfo',function(req,res){
    operation.getchose(req,res);
});
router.get('/insertdriverillegalrecord',function(req,res){
    operation.getillegalchose(req,res);
});


router.post('/querydriverbase',function(req,res){
    operation.querydriverBybusteam(req,res);
});

router.post('/querydriverillegal',function(req,res){
    operation.queryillegalByidtime(req,res);
});

router.post('/querybusteamillegal',function(req,res){
   operation.queryillegalBybusidtime(req,res);
});

router.post('/insertdriverinfo',function(req,res){
    operation.insertdriverinfo(req,res);
});

router.post('/insertbusinfo',function(req,res){
    operation.insertbusinfo(req,res);
});

router.post('/insertdriverillegalrecord',function(req,res){
    operation.insertdriverillegalrecord(req,res);
})
module.exports = router;
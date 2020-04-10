const express = require('express');
const router = express.Router();


var operation = require('../GRUD/operation')

router.use(function(req,res,next){
    console.log('Signed Cookies: ', req.signedCookies);
    if(req.signedCookies.haslogin == 'yes' && req.signedCookies.identify == 'driver'){
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
router.get('/querymyselfillegal',function(req,res){
    operation.getuserinfo(req,res);
});
router.post('/querymyselfillegal',function(req,res){
    operation.querymyselfBytime(req,res)
});

module.exports = router;
// 对数据库做的所有查询的实现
var mysql = require('mysql');
var config = require('../config/mysql')


module.exports = {
    // 登录时判断用户身份
    isuser: function (req, res) {

        const id = req.body.id;
        const password = req.body.password;

        try {
            if (!id.length) {
                throw new Error('请填写用户名');
            }
            if (!password.length) {
                throw new Error('请填写密码');
                //  现在错误处理还不会写，先解决正确情况
            }
        } catch (e) {
            req.flash('warn', '用户名或密码不能为空');
            return res.redirect('/login');
        }

        config.pool.getConnection(function (err, connection) {
            if (err) {
                console.error('连接失败', err)
            } else {
                connection.query(config.isuesr, [id, password, id, password], function (err1, result) {
                    if (err1) {
                        console.error(err1);
                        res.redirect('/login');
                    }
                    if (result[0].length == 0 && result[1].length == 0) {
                        req.flash('warn', '用户名或密码不正确');
                        res.redirect('/login');
                    } else {
                        console.log(result[0][0]);
                        // 根据身份识别进入什么页面
                        let temp = result[0].concat(result[1]);
                        // console.log(temp);
                        if (temp[0].driver_identify == '普通司机') {
                            // console.log(result);
                            res.cookie('haslogin', 'yes', { signed: true });
                            res.cookie('identify', 'driver', { signed: true });
                            res.cookie('id', id, { signed: true });
                            res.render('driverindex', { myself: temp, results: [] });
                            // 把司机本人工号传递
                        } else {
                            res.cookie('haslogin', 'yes', { signed: true });
                            res.cookie('identify', 'manager', { signed: true });
                            res.cookie('id', id, { signed: true });
                            res.render('managerindex', { myself: temp });
                        }
                    }

                });

            }

            connection.release();
        })


    },
    // 查询司机基本信息
    querydriverBybusteam: function (req, res) {
        const busteam = req.body.busteam;
        if (busteam == '') {
            req.flash('warn', '请输入车队');
            return res.redirect('/manager/querydriverbase');
        }

        config.pool.getConnection(function (err, connection) {
            if (err) {
                console.error('连接失败', err)
            } else {
                connection.query(config.querydriverBybusteam, [busteam, busteam], function (err1, results) {
                    if (err1) {
                        console.log(err1);
                        res.redirect('/manager/querydriverbase');
                    }
                    if (results[0].length == 0 && results[1].length == 0) {
                        // 查询值为空（分为不存在和查询的关键字不对）
                        //   之后实现弹窗消息!!!!!!!
                        req.flash('warn', '无搜索结果');
                        res.redirect('/manager/querydriverbase');
                    }
                    else {
                        let temp = results[0].concat(results[1])
                        res.render('driverinfo', { results: temp });
                    }
                })
            }

            connection.release();
        })

    },
    // 查询某司机违章
    queryillegalByidtime: function (req, res) {
        const id = req.body.id;
        const starttime = req.body.starttime;
        const endtime = req.body.endtime;
        if (starttime == '' || endtime == '' || id == '') {
            req.flash('warn', '日期与工号为必填项');
            return res.redirect('/manager/querydriverillegal'); //必须加return  
        }

        config.pool.getConnection(function (err, connection) {
            if (err) {
                console.error('连接失败', err)
            } else {
                connection.query(config.queryillegalByidtime, [id, starttime, endtime], function (err1, results) {
                    if (err1) {
                        console.error(err1);
                        res.redirect('/manager/querydriverillegal');
                    }
                    if (!results.length) {
                        req.flash('warn', '无搜索结果');
                        res.redirect('/manager/querydriverillegal');
                    } else {
                        console.log(results)
                        res.render('driverillegal', { results: results });
                    }
                });
            }

            connection.release();
        })


    },
    // 查询某车队违章统计信息
    queryillegalBybusidtime: function (req, res) {
        const busteam = req.body.busteam;
        const starttime = req.body.starttime;
        const endtime = req.body.endtime;

        if (starttime == '' || endtime == '' || busteam == '') {
            req.flash('warn', '车队与日期为必填项');
            return res.redirect('/manager/querybusteamillegal')  //必须加return  
        }
        // var connection = mysql.createConnection(config.mysql);//连接mysql
        config.pool.getConnection(function (err, connection) {
            if (err) {
                console.error('连接失败', err)
            } else {
                connection.query(config.queryillegalBybusidtime, [busteam, starttime, endtime], function (err1, results) {
                    if (err1) {
                        console.error(err1);
                        res.redirect('/manager/querybusteamillegal');
                    }
                    if (!results.length) {
                        req.flash('warn', '无搜索结果');
                        res.redirect('/manager/querybusteamillegal');
                    } else {
                        res.render('busteamillegal', { results: results });
                    }
                });
            }
            //config.pool.releaseConnection(connection);
            connection.release();
        })


    },
    getchose: function (req,res) {
        config.pool.getConnection(function (err, connection) {
            if (err) {
                console.error(err);
            } else {
                connection.query(config.getchose,function(err1,results){
                    // let temp = results[0].concat(results[1])
                    console.log(results);
                    if(req.route.path == '/insertdriverinfo'){
                        res.render('insertdriver',{ chose : results })
                    }else if(req.route.path == '/insertbusinfo'){
                        res.render('insertbus',{ chose : results })
                    }

                })
            }
            connection.release();
        })
    },
    // 插入普通司机信息
    insertdriverinfo: function (req, res) {
        const id = req.body.id;
        const name = req.body.name;
        const sex = req.body.sex;
        const identify = req.body.identify;
        const busteam = req.body.busteam;
        const road = req.body.road;
        console.log(id,name,sex,identify,busteam,road);
        // return;
        // var connection = mysql.createConnection(config.mysql);//连接mysql
        config.pool.getConnection(function (err, connection) {
            if (err) {
                console.error('连接失败', err)
            } else {
                    // if(identify=='普通司机'){
                        connection.query(config.insertdriverinfo,[id,name,sex,identify,road],function(err2,result){
                            if(err2){
                                console.error(err2);
                                if (err2.errno === 3819) {
                                    req.flash('warn', '工号必须11位、姓名不能为空');
                                    res.redirect('/manager/insertdriverinfo');
                                } 
                                if (err2.errno === 1062) {
                                    req.flash('warn', '工号已存在');
                                    res.redirect('/manager/insertdriverinfo');
                                } 
                            }else{
                                req.flash('warn', '录入成功');
                                res.redirect('/manager/insertdriverinfo');
                            }
                        })
                    // }
                    // else if(identify == '路队长'){
                    //     connection.query(config.insertcapinfo,[id,name,sex,identify,busteam],function(err1,result){
                    //         if(err1){
                    //             console.error(err1)
                    //             if (err1.errno === 3819) {
                    //                 req.flash('warn', '工号必须11位、姓名不能为空或工号已存在');
                    //                 res.redirect('/manager/insertdriverinfo');
                    //             } 
                    //         }else{
                    //             req.flash('warn', '录入成功');
                    //             res.redirect('/manager/insertdriverinfo');
                    //         }
                    //     })
                    // }else{

                    // }
      
            }
            //config.pool.releaseConnection(connection);
            connection.release();
        })


    },
    // 插入汽车信息
    insertbusinfo: function (req, res) {
        const id = req.body.id;
        const company = req.body.company;
        const busteam = req.body.busteam;
        const road = req.body.road;
        const seat = req.body.seat;

        // var connection = mysql.createConnection(config.mysql);//连接mysql
        config.pool.getConnection(function (err, connection) {
            if (err) {
                console.error('连接失败', err)
            } else {
                connection.query(config.insertbusinfo, [id, road, seat], function (err, result) {
                    if (err) {
                        req.flash('warn', '公交车已存在或请保证座位数合理');
                        res.redirect('/manager/insertbusinfo');

                    } else {
                        req.flash('warn', '录入成功');
                        res.redirect('/manager/insertbusinfo');
                    }
                })
            }
            //config.pool.releaseConnection(connection);
            connection.release();
        })
    },
    getillegalchose:function(req,res){
        config.pool.getConnection(function (err, connection) {
            if (err) {
                console.error(err);
            } else {
                connection.query(config.getillegalchose,function(err1,results){
                    // let temp = results[0].concat(results[1])
                    console.log(results);
                    res.render('insertdriverillegal',{chose:results})
                })
            }
            connection.release();
        })
    },
    // 插入司机违章信息
    insertdriverillegalrecord: function (req, res) {
        const id = req.body.id;
        const busid = req.body.busid;
        const station = req.body.station;
        const date = req.body.date;
        const type = req.body.type;
  

        // var connection = mysql.createConnection(config.mysql);//连接mysql
        config.pool.getConnection(function (err, connection) {
            if (err) {
                console.error('连接失败', err)
            } else {
                connection.query(config.insertdriverillegalrecord, [id,busid,date,station,type], function (err, result) {
                    if (err) {
                        console.log(err);
                        if (err.errno === 1452) {
                            req.flash('warn', '司机工号为11位或车辆不存在请插入或司机未录入');
                            res.redirect('/manager/insertdriverillegalrecord');
                        } else if (err.errno === 1292) {
                            req.flash('warn', '请选择日期');
                            res.redirect('/manager/insertdriverillegalrecord');
                        } else if(err.errno == 1442){
                            req.flash('warn', '司机与车辆不在同一线路');
                            res.redirect('/manager/insertdriverillegalrecord');
                        }
                    } else {
                        req.flash('warn', '录入成功');
                        res.redirect('/manager/insertdriverillegalrecord');
                    }
                })
            }
            //config.pool.releaseConnection(connection);
            connection.release();
        })



    },
    // 在司机和管理员主页刷新时，需要给出本人基本信息，还有，当没点退出按钮退出时，重新url访问登录/login时
    getuserinfo: function (req, res) {
        const id = req.signedCookies.id;
        const identify = req.signedCookies.identify;

        config.pool.getConnection(function (err, connection) {
            if (err) {
                console.error(err)
            } else {
                connection.query(config.userinfo, [id, id], function (err1, results) {
                    if (err1) {
                        console.error(err1)
                    } else {
                        let temp = results[0].concat(results[1]);

                        if (identify == 'driver') {
                            res.render('driverindex', { myself: temp, results: [] });
                        } else {

                            res.render('managerindex', { myself: temp, results: [] });
                        }
                    }
                })
            }
            connection.release();
        })
    },

    // 查询本人信息及违章信息
    querymyselfBytime: function (req, res) {
        console.log(req.signedCookies);
        const id = req.signedCookies.id;
        const starttime = req.body.starttime;
        const endtime = req.body.endtime;

        if (starttime == '' || endtime == '') {
            req.flash('warn', '请选择日期');
            return res.redirect('/driver/querymyselfillegal')  //必须加return  
        }

        // var connection = mysql.createConnection(config.mysql);//连接mysql
        config.pool.getConnection(function (err, connection) {
            if (err) {
                console.error('连接失败', err)
            } else {
                connection.query(config.getmyselfill, [id,id, starttime, endtime], function (err1, results) {
                    if (err1) {
                        console.error(err1.message);
                        res.redirect('/driver/querymyselfillegal')
                        // 代做
                    }
                    if (!results.length) {
                        // 如果没有违章记录
                        req.flash('warn', '无搜索结果');
                        res.redirect('/driver/querymyselfillegal')
                    } else {
                        // 如果有记录
                        res.render('driverindex', { myself: results[0], results: results[1] });
                    }
                });
            }
            //config.pool.releaseConnection(connection);
            connection.release();
        })


    }
}
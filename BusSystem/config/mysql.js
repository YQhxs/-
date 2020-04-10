//MySQL数据库连接配置
// config/mysql.js
var mysql = require('mysql');

module.exports={
    // 创建线程池，pool
    pool:mysql.createPool({
        host:'127.0.0.1',
        user:'root',
        password:'123456',
        database:'test',
        port:3306,
        connectionLimit: 10,
        multipleStatements:true 
    }),
    isuesr:'select * from driver d,busteamtoroad b where b.road_id = d.road_id and driver_id = ? and driver_password = ?;select * from captain where driver_id = ? and driver_password = ?;',
    userinfo:'select * from driver d,busteamtoroad b where b.road_id = d.road_id and driver_id = ? ; select * from captain where driver_id = ? ;',
    querydriverBybusteam:'select * from driver d,busteamtoroad b where b.road_id = d.road_id and busteam_id = ? ; select * from captain where  busteam_id= ?;',
    queryillegalByidtime:'select * from illegalrecord i,bus,busteamtoroad b where i.i_bus_id = bus.bus_id and bus.road_id = b.road_id and i.i_driver_id = ? and i.i_time between ? and ?;',
    getmyselfill:'select * from driver d,busteamtoroad b where b.road_id = d.road_id and driver_id = ? ; select * from illegalrecord i,bus,busteamtoroad b where i.i_bus_id = bus.bus_id and bus.road_id = b.road_id and i.i_driver_id = ? and i.i_time between ? and ?;',
    queryillegalBybusidtime:'select i_type,count(i_type) nums from illegalrecord i,bus,busteamtoroad b where i.i_bus_id = bus.bus_id and bus.road_id = b.road_id and b.busteam_id = ? and i.i_time between ? and ? group by(i_type);',
    getchose:'select road_id from busteamtoroad ; select distinct(busteam_id) from busteamtoroad;',
    insertdriverinfo:'insert into driver(driver_id,driver_name,driver_sex,driver_identify,road_id) values (?,?,?,?,?)',
    insertcapinfo:'insert into captain(driver_id,driver_name,driver_sex,driver_identify, busteam_id) values(?,?,?,?,?);',
    insertbusinfo:'insert into bus(bus_id,road_id,seatnumber) values(?,?,?)',
    getillegalchose:'select station from stations;select illegal from illegaltype;',
    insertdriverillegalrecord:'insert into illegalrecord(i_driver_id,i_bus_id ,i_time,i_station,i_type) values(?,?,?,?,?);'
}
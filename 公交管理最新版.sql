#前端不填东西默认是空字符串，所以程序逻辑去解决空字符串（原本以为不写是null）的情况
use test;
drop table if exists stations,busteamtocompany,illegalrecord,illegaltype,bus,busteamtoroad,driver,captain;
#违章类型
create table illegaltype(
    illegal varchar(12) primary key
);
insert into illegaltype(illegal) values('闯红灯');
insert into illegaltype(illegal) values('未礼让斑马线');
insert into illegaltype(illegal) values('压线');
insert into illegaltype(illegal) values('违章停车');
insert into illegaltype(illegal) values('超速');

#站点表不确定要不要建，又和线路表怎么联系
create table stations(
	station varchar(12) primary key
);
insert into stations (station) values('成华大道');
insert into stations (station) values('二仙桥');

#车队->公司
create table busteamtocompany(
	busteam_id varchar(12) primary key,
	company_name varchar(12)	#例公司1
);

insert into busteamtocompany values('车队1','交管大队');
insert into busteamtocompany values('车队2','交管大队');
insert into busteamtocompany values('车队3','交管大队');

#线路->车队表
create table busteamtoroad(
    road_id varchar(12) primary key,
    busteam_id varchar(12),
    foreign key (busteam_id) references busteamtocompany(busteam_id)
);
insert into busteamtoroad values('线路1','车队1');
insert into busteamtoroad values('线路2','车队1');
insert into busteamtoroad values('线路3','车队2');
insert into busteamtoroad values('线路4','车队2');
insert into busteamtoroad values('线路5','车队3');
insert into busteamtoroad values('线路6','车队3');


#性别、身份都通过前端选项去限制非空
#开车的->线路
create table driver (
    driver_id char(11) primary key,
    driver_name varchar(10) not null,
    #字符串类型在前端不传值默认是空字符串而不是null
    driver_sex char(2),
    driver_password varchar(12) not null default '123456',
    driver_identify varchar(4),
    road_id char(12),
    foreign key (road_id) references busteamtoroad(road_id),
    check(length(driver_id) = 11 and driver_name <> ''),
    check(driver_identify = "普通司机" or driver_identify = "路队长")
    
    #check (deiver_sex = '男' or driver_sex = '女')
    #在前端通过选择去限制了男女
);
#不开车的->车队
create table captain (
    driver_id char(11) primary key,
    driver_name varchar(10) not null,
    #字符串类型在前端不传值默认是空字符串而不是null
    driver_sex char(2),
	driver_password varchar(12) not null default '123456',
    driver_identify varchar(4),
    busteam_id char(12),

    foreign key(busteam_id) references busteamtocompany(busteam_id) ,
    check(length(driver_id) = 11 and driver_name <> '')
    
    #check (deiver_sex = '男' or driver_sex = '女')
    #在前端通过选择去限制了男女
);


insert into captain(driver_id,driver_name,driver_sex,driver_identify,busteam_id ) values ('17030110101','张一','男','队长','车队1');
insert into driver(driver_id,driver_name,driver_sex,driver_identify ,road_id) values ('17030110002','张二','女','普通司机' ,'线路1');
insert into driver(driver_id,driver_name,driver_sex,driver_identify ,road_id) values ('17030110003','王一','男','路队长' ,'线路1');
insert into driver(driver_id,driver_name,driver_sex,driver_identify ,road_id) values ('17030110004','李一','男','普通司机' ,'线路2');
insert into driver(driver_id,driver_name,driver_sex,driver_identify ,road_id) values ('17030110005','李二','女','路队长' ,'线路2');

insert into captain(driver_id,driver_name,driver_sex,driver_identify, busteam_id) values ('17030110201','张一','男','队长','车队2');
insert into driver(driver_id,driver_name,driver_sex,driver_identify ,road_id) values ('17030110006','王二','男','普通司机' ,'线路3');
insert into driver(driver_id,driver_name,driver_sex,driver_identify ,road_id) values ('17030110007','张二','女','路队长' ,'线路3');
insert into driver(driver_id,driver_name,driver_sex,driver_identify ,road_id) values ('17030110008','李一','男','普通司机' ,'线路4');
insert into driver(driver_id,driver_name,driver_sex,driver_identify ,road_id) values ('17030110009','李二','女','路队长' ,'线路4');

insert into captain(driver_id,driver_name,driver_sex,driver_identify, busteam_id) values ('17030110301','张一','男','队长','车队3');
insert into driver(driver_id,driver_name,driver_sex,driver_identify ,road_id) values ('17030110010','王一','男','普通司机' ,'线路5');
insert into driver(driver_id,driver_name,driver_sex,driver_identify ,road_id) values ('17030110011','王二','男','路队长' ,'线路5');
insert into driver(driver_id,driver_name,driver_sex,driver_identify ,road_id) values ('17030110012','王一','男','普通司机' ,'线路6');
insert into driver(driver_id,driver_name,driver_sex,driver_identify ,road_id) values ('17030110013','王二','男','路队长' ,'线路6');


#汽车->车队
#现在只有一个公司，所以就先不先不参考公司了
create table bus(
	bus_id char(10) primary key,
    #要考虑车牌号位数固定么！！！
    road_id varchar(12),
    seatnumber smallint,
    foreign key (road_id) references busteamtoroad(road_id),
    check(length(bus_id<>'') and seatnumber > 0)
);

insert into bus(bus_id,road_id,seatnumber) values('101','线路1',20);
insert into bus(bus_id,road_id,seatnumber) values('102','线路1',20);
insert into bus(bus_id,road_id,seatnumber) values('201','线路2',20);
insert into bus(bus_id,road_id,seatnumber) values('202','线路2',20);

insert into bus(bus_id,road_id,seatnumber) values('301','线路3',20);
insert into bus(bus_id,road_id,seatnumber) values('401','线路4',20);
insert into bus(bus_id,road_id,seatnumber) values('501','线路5',20);
insert into bus(bus_id,road_id,seatnumber) values('601','线路6',20);


#违章记录表
create table illegalrecord(
	i_id smallint primary key auto_increment,
	i_driver_id char(11) ,
    i_bus_id char(10),
    i_time date,
    i_station varchar(12),
	i_type varchar(12),
    foreign key (i_driver_id) references driver(driver_id),
    foreign key (i_bus_id) references bus(bus_id),
    foreign key(i_station) references stations(station),
	foreign key(i_type) references illegaltype(illegal)
	

    
    
);
	delimiter //
	create trigger d_bsame before insert
	on illegalrecord for each row
	begin
    declare d_road varchar(12);
    declare b_road varchar(12);
    select road_id into d_road from driver where driver.driver_id = new.i_driver_id;
    select road_id into b_road from bus where bus.bus_id = new.i_bus_id;
	if d_road <> b_road
    then
    insert into illegalrecord(i_driver_id,i_bus_id ,i_time,i_station,i_type) values(new.i_driver_id,new.i_bus_id ,new.i_time,new.i_station,new.i_type);
	END IF;
	end //
	DELIMITER ;
insert into illegalrecord(i_driver_id,i_bus_id ,i_time,i_station,i_type) values('17030110002','101','2019-09-01','二仙桥','超速');
insert into illegalrecord(i_driver_id,i_bus_id ,i_time,i_station,i_type) values('17030110003','102','2019-09-01','二仙桥','超速');



insert into illegalrecord(i_driver_id,i_bus_id ,i_time,i_station,i_type) values('17030110004','201','2019-09-01','二仙桥','超速');
insert into illegalrecord(i_driver_id,i_bus_id ,i_time,i_station,i_type) values('17030110005','201','2019-09-01','二仙桥','超速');


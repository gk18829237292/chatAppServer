module.exports = function() {
	var mysql = require('mysql');
	
	var userEntry = function(account,nickName,sex){
		this.account = account;
		this.nickName = nickName;
		this.sex = sex;
	}
	
	function createConnection(){
		var connection = mysql.createConnection({
				host: 'localhost',
				user: 'root',
				password: '7320',
				database:'chatApp'
			});
		connection.connect();
		return connection;
	}
	
	return{
		getAllUser:function(callback){
			var connection = createConnection();
			connection.query('select * from user',function(err,rows,fields){
				if(err) throw err;
				var userList=[];
				rows.forEach(function(item,index){
					var user= new userEntry(item.account,item.nickname,item.sex);
					userList.push(user);
				});
				callback(userList);
			});
			connection.end();
		},
		
		insertUser:function(account,password,nickName,sex,callback){
			var conn = createConnection();
			var param = [account,password,nickName,sex];
			conn.query("insert into user values(?,?,?,?)",param,function(err,rows,fields){
				if(err) throw err;
				callback(true);
			});
			conn.end();
		},
		
		deleteUser:function(account,callback){
			var conn = createConnection();
			var param = [account];
			conn.query("delete from user where account = ?",param,function(err,rows,fields){
				if(err) throw err;
				callback();
			});
			conn.end();
		},
		updateUserNickName:function(account,nickName,callback){
			var conn = createConnection();
			var param = [nickName,account];
			conn.query("update user set nickname = ? where account = ?",param,function(err,rows,fields){
				if(err) throw err;
				callback();
			});
			conn.end();
		},
		updateUserSex:function(account,sex,callback){
			var conn = createConnection();
			var param = [sex,account];
			conn.query("update user set sex = ? where account = ?",param,function(err,rows,fields){
				if(err) throw err;
				callback();
			});
			conn.end();
		},
		updateUser:function(account,nickName,sex,callback){
			var conn = createConnection();
			var param = [nickName,sex,account];
			conn.query("update user set nickname=?,sex = ? where account = ?",param,function(err,rows,fields){
				if(err) throw err;
				callback();
			});
			conn.end();
		},
		login:function(account,password,callback){
			var conn = createConnection();
			var param = [account,password,account];
			conn.query("select * from user where account = ? and password =?",param,function(err,rows,fields){
				if(err) throw err;
				if(rows.length == 1){
					callback(true);
				}else{
					callback(false);
				}
			});
			conn.end();
		}
	}
}
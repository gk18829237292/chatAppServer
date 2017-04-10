module.exports = function() {
	var mysql = require('mysql');
	
	var userEntry = function(account,nickname,signature){
		this.account = account;
		this.nickname = nickname;
		this.signature = signature;
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
					var user= new userEntry(item.account,item.nickname,item.signature);
					userList.push(user);
				});
				callback(userList);
			});
			connection.end();
		},
		
		insertUser:function(account,password,nickname,signature,callback){
			var conn = createConnection();
			var param = [account,password,nickname,signature];
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
		updateUserNickName:function(account,nickname,callback){
			var conn = createConnection();
			var param = [nickname,account];
			conn.query("update user set nickname = ? where account = ?",param,function(err,rows,fields){
				if(err) throw err;
				callback();
			});
			conn.end();
		},
		updateUserSex:function(account,signature,callback){
			var conn = createConnection();
			var param = [signature,account];
			conn.query("update user set signature = ? where account = ?",param,function(err,rows,fields){
				if(err) throw err;
				callback();
			});
			conn.end();
		},
		updateUser:function(account,nickname,signature,callback){
			var conn = createConnection();
			var param = [nickname,signature,account];
			conn.query("update user set nickname=?,signature = ? where account = ?",param,function(err,rows,fields){
				if(err) throw err;
				callback();
			});
			conn.end();
		},
		login:function(account,password,callback){
			var conn = createConnection();
			var param = [account,password];
			conn.query("select * from user where account = ? and password =?",param,function(err,rows,fields){
				if(err) throw err;
				if(rows.length != 0){
					callback(true,rows[0].account,rows[0].nickname,rows[0].signature);
				}else{
					callback(false,'','','','');
				}
			});
			conn.end();
		}
	}
}
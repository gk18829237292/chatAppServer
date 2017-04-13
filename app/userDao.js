module.exports = function() {
	var mysql = require('mysql');
	
	var userEntry = function(account,nickname,signature,image){
		this.account = account;
		this.nickname = nickname;
		this.signature = signature;
		this.image = image;
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
					var user= new userEntry(item.account,item.nickname,item.signature,item.image);
					userList.push(user);
				});
				callback(userList);
			});
			connection.end();
		},
		
		insertUser:function(account,password,nickname,signature,callback){
			var conn = createConnection();
			var param = [account,password,nickname,signature,''];
			conn.query("insert into user values(?,?,?,?,?)",param,function(err,rows,fields){
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
		updateUser:function(account,nickname,signature,image,callback){
			var conn = createConnection();
			var param = [nickname,signature,image,account];
			conn.query("update user set nickname=?,signature = ?,image=? where account = ?",param,function(err,rows,fields){
				if(err) throw err;
			});
			conn.end();
			callback(true);
		},
		login:function(account,password,callback){
			var conn = createConnection();
			var param = [account,password];
			conn.query("select * from user where account = ? and password =?",param,function(err,rows,fields){
				if(err) throw err;
				if(rows.length != 0){
					callback(true,rows[0].account,rows[0].nickname,rows[0].signature,rows[0].image);
				}else{
					callback(false,'','','','','');
				}
			});
			conn.end();
		}
	}
}
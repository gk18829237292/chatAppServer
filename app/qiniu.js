module.exports = function() {
	var qiniu = require("qiniu");
	//��Ҫ��д��� Access Key �� Secret Key
	qiniu.conf.ACCESS_KEY = 'M8YdQtWGxHpGapzPQh8TG8o0SfNDsDiP2Fl6Ddt6';
	qiniu.conf.SECRET_KEY = 'H1vFDrNKhhMKY954i1GM4YzSXZPgKZjmBbX40x7f';
	return{
		getToken:function(bucket,key,callback){
			var putPolicy = new qiniu.rs.PutPolicy(bucket+":"+key);
			var token=putPolicy.token();
			callback(token);
		}
	}
}
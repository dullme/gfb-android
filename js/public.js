function timestampToDate(timestamp) {
        var date = new Date(timestamp );//时间戳为10位需*1000，时间戳为13位的话不需乘1000
        Y = date.getFullYear() + '-';
        M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '-';
        D = date.getDate() + ' ';
        h = date.getHours() + ':';
        m = date.getMinutes() + ':';
        s = date.getSeconds();
        return Y+M+D;
    }

function timestampToTime(timestamp) {
        var date = new Date(timestamp );//时间戳为10位需*1000，时间戳为13位的话不需乘1000
        Y = date.getFullYear() + '-';
        M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '-';
        D = date.getDate() + ' ';
        h = date.getHours() + ':';
        m = date.getMinutes() + ':';
        s = date.getSeconds();
        return h+m+s;
    }
//获得注册身份信息
function getIdentity(){
	//向服务器发送扫描数据
	var dest = localStorage.getItem("AdDevice-system") || '';
	if(dest ==''){
		return '';
	}else{
		var str = JSON.parse(dest );
		return '{"qrtime":"' + new Date().getTime() +'","QRCode":"'+str.QRCode+'",'
			+ '"deviceType":"' + plus.device.model + '","vendor":"' + plus.device.vendor +'",'
			+ '"IMEI":"' + plus.device.imei + '","UUID":"' + plus.device.uuid + '"}';
	}
} 

//获得注册身份信息
function getFeeIdentity(){
	//向服务器发送扫描数据
	var register = JSON.parse(localStorage.getItem("AdDevice-register"));
	var dest = localStorage.getItem("AdDevice-system") || '';
	if(dest ==''){
		return '';
	}else{
		var str = JSON.parse(dest );
		return '{"qrtime":"' + new Date().getTime() +'","QRCode":"'+str.QRCode+'",'
			+ '"deviceType":"' + plus.device.model + '","vendor":"' + plus.device.vendor +'",'
			+ '"IMEI":"' + plus.device.imei + '","UUID":"' + plus.device.uuid + '",'
			+ '"registerMobile":"' + registerTel + '","registerPayInfo":"' + registerAccount + '"}';
	}
} 

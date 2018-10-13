/*!
 * ======================================================
 * FeedBack Template For MUI (http://dev.dcloud.net.cn/mui)
 * =======================================================
 * @version:1.0.0
 * @author:cuihongbao@dcloud.io
 */
(function() {
	var index = 1;
	var size = null;
	var imageIndexIdNum = 0;
	var starIndex = 0;
	var feedback = {
		question: document.getElementById('question'), 
		contact: document.getElementById('contact'), 
		submitBtn: document.getElementById('submit')
	};
	feedback.uploader = null;  
	feedback.deviceInfo = null; 
	mui.plusReady(function() {
		var str = JSON.parse( localStorage.getItem("AdDevice-system"));
		//设备信息，无需修改
		feedback.deviceInfo = {
			appid: plus.runtime.appid, 
			IMEI: plus.device.imei, //设备标识
			p: mui.os.android ? 'a' : 'i', //平台类型，i表示iOS平台，a表示Android平台。
			deviceType: plus.device.model, //设备型号
			vendor:plus.device.vendor,
			app_version: plus.runtime.version,
			plus_version: plus.runtime.innerVersion, //基座版本号
			os:  mui.os.version,
			net: ''+plus.networkinfo.getCurrentType(),
			UUID:plus.device.uuid,
//			QRCode:str.QRCode
		}
	});
	/**
	 *提交成功之后，恢复表单项 
	 */
	feedback.clearForm = function() {
		feedback.question.value = '';
		feedback.contact.value = '';
		index = 0;
		size = 0;
		imageIndexIdNum = 0;
		starIndex = 0;
		//清除所有星标
		mui('.icons i').each(function (index,element) {
			if (element.classList.contains('mui-icon-star-filled')) {
				element.classList.add('mui-icon-star')
	  			element.classList.remove('mui-icon-star-filled')
			}
		})
	};  
	
	feedback.submitBtn.addEventListener('tap', function(event) {
		mui.toast('反馈成功~')
		return
		console.log("submitBtn addEventListener");
		if (feedback.question.value == '' ||
			(feedback.contact.value != '' &&
				feedback.contact.value.search(/^(\w+((-\w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z0-9]+)|([1-9]\d{4,9})$/) != 0)) {
			return mui.toast('信息填写不符合规范');
		}
		if (feedback.question.value.length > 200 || feedback.contact.value.length > 200) {
			return mui.toast('信息超长,请重新填写~')
		}
		//判断网络连接
		if(plus.networkinfo.getCurrentType()==plus.networkinfo.CONNECTION_NONE){
			return mui.toast("连接网络失败，请稍后再试");
		}
		feedback.send(mui.extend({}, feedback.deviceInfo, {
			content: feedback.question.value,
			contact: feedback.contact.value,
			score:''+starIndex
		}))  
	}, false)
	feedback.send = function(content) {
		console.log("submitBtn stringify send"+ JSON.stringify( content));
		var mask=mui.createMask();//遮罩层
        //更新资金池余额
        mui.getJSON("../manifest.json",null,function(data){
			var b64 = new Base64();
			//向服务器发送扫描数据
			var str = JSON.parse( localStorage.getItem("AdDevice-system"));
			var qrstr = JSON.stringify( content);
			
			//var posturl = "http://192.168.1.106:8080/appdata/feedback";
			var posturl = b64.decode(data.kernel.code)+"appdata/feedback";
			console.log("posturl:"+posturl+qrstr);
			mui.ajax(posturl,{
				data:{"version":data.kernel.version,"kernel":b64.encode(data.kernel.kernel),
					"body":b64.encode(qrstr)},
				dataType: 'JSON', //服务器返回json格式数据  
		        type: 'POST', //HTTP请求类型  
		        timeout: 20000, //超时时间设置为10秒；
		        header:{'Content-Type': 'application/json'},//;charset=UTF-8
				beforeSend: function() {  
					plus.nativeUI.showWaiting("正在获取数据......",{padlock:true,loading:{icon:"../images/waiting.png"}});
			        mask.show();//显示遮罩层  
			    },  
			    complete: function() {  
			        plus.nativeUI.closeWaiting();  
			        mask.close();//关闭遮罩层  
			    },  
			    success: function(data) {
			    	console.log("adtime返回："+data);
			    	mask.close();//关闭遮罩层  
			    	plus.nativeUI.closeWaiting(); 
			    	
			        //服务器返回响应，根据响应结果，分析是否登录成功；   
			        var dt = eval('('+ data +')'); //
			        if(dt.success){
				        mui.toast(dt.msg);
						console.log("upload success");
						feedback.clearForm();
						mui.back();
			        }else{
			        	mui.toast(dt.msg); 
			        }
			    },  
			    error: function(xhr, type, errorThrown) { 
			        console.log(xhr.toString()+"==========="+type+",****\nerrorThrown="+errorThrown+"\nposturl="+posturl);
			        mui.alert('服务器连接超时，请稍后再试'); 
			        plus.nativeUI.closeWaiting(); 
			        mask.close();//关闭遮罩层
			    }  
			})
		});
				
		plus.nativeUI.showWaiting();
	};
	
	 //应用评分
	 mui('.icons').on('tap','i',function(){
	  	var index = parseInt(this.getAttribute("data-index"));
	  	var parent = this.parentNode;
	  	var children = parent.children;
	  	if(this.classList.contains("mui-icon-star")){
	  		for(var i=0;i<index;i++){
  				children[i].classList.remove('mui-icon-star');
  				children[i].classList.add('mui-icon-star-filled');
	  		}
	  	}else{
	  		for (var i = index; i < 5; i++) {
	  			children[i].classList.add('mui-icon-star')
	  			children[i].classList.remove('mui-icon-star-filled')
	  		}
	  	}
	  	starIndex = index;
  });
  	//选择快捷输入
	mui('.mui-popover').on('tap','li',function(e){
	  document.getElementById("question").value = document.getElementById("question").value + this.children[0].innerHTML;
	  mui('.mui-popover').popover('toggle')
	}) 
})();

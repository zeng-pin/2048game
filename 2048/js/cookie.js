
			
			//添加cookie
			function setcookie(name,value,day) {
				var odate = new Date();
				odate.setDate(odate.getDate() + day);
				document.cookie = name + "=" + value +";expires=" +odate;
				//console.log(document.cookie);
			}
			
			//获取cookie
			function getcookie(name){
				var str0=document.cookie;
				var arr=str0.split("; ");//此处要加空格！！！！
				for(i=0 ;i<arr.length; i++){
					var arr1=arr[i].split("=");
					if(arr1[0] == name){
						return arr1[1];
					}
				}
			}
			//移除cookie
			function removecookie(name){
				document.setcookie(name,1,-1);
			}
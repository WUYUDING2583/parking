/**
 * 
 */
var windowHeight = $(window).height();
	$body = $("body");
	$body.css("height", windowHeight); 
	$("#search2main").hide();
	$("#personhead").height(windowHeight*0.2);
	$(".imghead").css({"height":windowHeight*0.2*0.8,"width":windowHeight*0.2*0.8});
	$(".imghead").offset({"left":windowHeight*0.2*0.15,"top":windowHeight*0.2*0.1});
	$(".headname").offset({"left":windowHeight*0.2*0.3,"top":windowHeight*0.2*0.1});
	$("#parksInfo").hide();
	$("#parkSeat").hide();
	$("#myReservation").hide();
	$("#bookDetail").css("height",windowHeight*0.18+'px');
	$("#seatContainer").css("height",windowHeight*0.55+'px');
	$("#selectSeat").css("height",windowHeight*0.09+'px');
	$("#seatButton").css("height",windowHeight*0.09+'px');
	$("#hint").css("height",windowHeight*0.05+'px');
	$("nav").css("height",windowHeight*0.1+'px');
	$("#bookInfo").css("height",windowHeight*0.12+'px');
	$(".rowinbookInfo").css("height",windowHeight*0.12+'px');
	$(".halfrowinbookInfo").css("height",windowHeight*0.06+'px');
	$(".halfrowinbookInfo h6").css("margin-top",windowHeight*0.02+'px');
	$("#seatCount h4").css("margin-top",windowHeight*0.05+'px');
	$("#myCarId").hide();
	$(function() {
	    $( "#seat-map" ).draggable();
	  });
	$("#cookieHistory").css("height",windowHeight*0.5+'px');
	$("#accordion").css({'margin-left':'5px','margin-right':'5px','margin-top':windowHeight*0.13+'px'});
	$("#addIcon").css({'margin-top':windowHeight*0.03+'px',"margin-right":"10px"});
	
	var map, geolocation;
    //加载地图，调用浏览器定位服务
    map = new AMap.Map('container', {
        resizeEnable: true
    });
    
    var auto = new AMap.Autocomplete();
    var placeSearch=new AMap.PlaceSearch({map:map});
    
    var city="全国";
    map.getCity(function(e){
    	city=e.city;
    	auto.setCity(city);
    	placeSearch.setCity(city);
    });
    
   
  //返回hash值
    function getHash(key, url) {
        var hash;
        if (!!url) {
            hash = url.replace(/^.*?[#](.+?)(?:\?.+)?$/, "$1");
            hash = (hash == url) ? "" : hash;
        } else {
            hash = self.location.hash;
        }

        hash = "" + hash;
        hash = hash.replace(/^[?#]/, '');
        hash = "&" + hash;
        var val = hash.match(new RegExp("[\&]" + key + "=([^\&]+)", "i"));
        if (val == null || val.length < 1) {
            return null;
        } else {
            return decodeURIComponent(val[1]);
        }
    }
    
   $(document).ready(function(){
	  	var height=$(window).height();//屏幕高度
	  	var width=$(window).width();//屏幕宽度
	    var tipWidth=$("#tip").width();//输入框宽度
	 	var tipLeft=$("#tip").offset().left;//输入框左边距
	    var cookiename="historyPlace1111";//cookie名
	    var pageNo;//页面编号
	    var price = 80; //票价
	    var seats=0;//选择车位数
		var tag=1;
		var search2info;//判断是否由搜索页面进入停车场信息页面
		var mapSeat=new Array('aaaaaaaaaa_aaaaaaaaaa',
		        	'a___________________a',
		        	'a_aa_aa_aa_aa_aa_aa_a',
		        	'a_aa_aa_aa_aa_aa_aa_a',
		        	'a_aa_aa_aa_aa_aa_aa_a',
		        	'a_aa_aa_aa_aa_aa_aa_a',
		        	'a_aa_aa_aa_aa_aa_aa_a',
		        	'a___________________a',
		        	'aaaaaaaaaa_aaaaaaaaaa');
		var mapX=width*0.5;//地图模块中心点据屏幕左侧距离
		var mapY=height*0.57;//地图模块中心点据屏幕底部距离
	    var exit=false;//判断是否点击退出登陆
		
	    //点击查询弹出停车场信息
	    /*$("#query").on("click",function(){
	    	intoParksInfo();
	    	$.ajax({
	    		url:"parksInfoServlet",
	    		type:"post",
	    		cache:false,
	    		data:{
	    			lng:$("#lng").val(),
	    			lat:$("#lat").val()
	    		},
	    		success:function(data){
	    			
	    		}
	    	});
	    });*/
	    
		//移动端拖动事件
		var flag = false;
	    var cur = {
	        x:0,
	        y:0
	    }
	    var nx,ny,dx,dy,x,y ;
	    function down(){
	        flag = true;
	        var touch ;
	        if(event.touches){
	            touch = event.touches[0];
	        }else {
	            touch = event;
	        }
	        cur.x = touch.clientX;
	        cur.y = touch.clientY;
	        dx = div2.offsetLeft;
	        dy = div2.offsetTop;
	    }
	    function move(){
	        if(flag){
	            var touch ;
	            if(event.touches){
	                touch = event.touches[0];
	            }else {
	                touch = event;
	            }
	            nx = touch.clientX - cur.x;
	            ny = touch.clientY - cur.y;
	            x = dx+nx;
	            y = dy+ny;
	            div2.style.left = x+"px";
	            div2.style.top = y +"px";
	            //阻止页面的滑动默认事件
	            document.addEventListener("touchmove",function(){
	                event.preventDefault();
	            },false);
	        }
	    }
	    var div2 = document.getElementById("seat-map");
	    div2.addEventListener("mousedown",function(){
	        down();
	    },false);
	    div2.addEventListener("touchstart",function(){
	        down();
	    },false)
	    div2.addEventListener("mousemove",function(){
	        move();
	    },false);
	    div2.addEventListener("touchmove",function(){
	        move();
	    },false)
	    document.body.addEventListener("mouseup",function(){
	        flag = false;
	    },false);
	    div2.addEventListener("touchend",function(){
	        flag = false;
	    },false)
		
	  /*  //从cooki中读取历史搜索记录
	    var cookievalue=getCookie(cookiename);
	    var st="<p class='text-center'>暂无历史记录</p>";
	    var cookieCount=0;
	    if(cookievalue!="")
	    {
	    	var values=cookievalue.split("|");
	    	cookieCount=values.length-1;
	    	if((values.length-1)!=0){
	    		st="<ul class='list-group' id='cookieList'>";
		 	    for(var i=0;i<values.length-1;i++){
		 	    	st+="<li class='list-group-item cookieitem'>"+
		 						"<div class='row'>"+
		 							"<div class='col-xs-8 placediv'>"+"<span class='glyphicon glyphicon-map-marker'></span>&nbsp;"+
		 								"<span class='placename'>";
		 	    	var val=values[i].split(",");
		 		    st+=val[0]+"</span><span class='lng sr-only'>"+val[1]+"</span><span class='lat sr-only'>"+val[2]+"</span><span class='No sr-only'>"+i+"</span></div><div class='col-xs-4'><button type='button' class='close closeHistory' aria-hidden='true'>&times;</button></div></div></li>";
		 		 }
		 	    st+="</ul>";
	    	}
	    }*/
	    $("#cookieHistory").html("<ul class='list-group' id='cookieList'><p class='text-center listNone'>暂无历史记录</p></ul>");
	    
	    
	    //点击我要预约进入停车场选位页面
	    $(".book").on("click",function(){
	    	intoParkSeat();
	    });
	    
	    //点击清空
	    $("#sureClear").on("click",function(){
	    	$("#cookieHistory").html("<ul class='list-group' id='cookieList'><p class='text-center listNone'>暂无历史记录</p></ul>");
	    	//deleteCookie();
	    });
	    
	    //点击我的预约进入我的预约页面
	    $("#intoMybook").on("click",function(){
	    	intoMyReservation();
	    });
	    
	    //点击我的车牌进入我的车牌页面
	    $("#intoMycarid").on("click",function(){
	    	intoMyCarId();
	    });
	    
	    //点击退出登陆
	    $("#exit").on("click",function(){
	    	exit=true;
	    	history.back();
	    	
	    })
	    
	    //点击查询添加历史纪录
	    $("#query").on("click",function(){
	    	search2info=getHash("page");
	    	intoParksInfo();
	    	var inputVal=$("#topInput").val();
	    	var lng=$("#searchlng").val();
	    	var lat=$("#searchlat").val();
	    	if(inputVal!=""){
	    		$(".listNone").remove();
	    		var str="<li class='list-group-item cookieitem'>"+
					"<div class='row'>"+
						"<div class='col-xs-10 placediv'>"+"<span class='glyphicon glyphicon-map-marker'></span>&nbsp;"+
							"<span class='placename'>"+inputVal+
							"</span><span class='lng sr-only'>"+lng+"</span><span class='lat sr-only'>"+lat+"</span><span class='No sr-only'>"+-1+"</span></div><div class='col-xs-2'><button type='button' class='close closeHistory' aria-hidden='true'>&times;</button></div></div></li>";
	    		$(str).prependTo($("#cookieList"));
	    	}
	    	/*if(inputVal!=""){
	    		var value=$("#topInput").val()+","+$("#lng").val()+","+$("#lat").val()+"|";
	    		var cvalue=getCookie(cookiename);
		    	cvalue=value+cvalue;
		    	setCookie(cookiename,cvalue,365);
	    	}*/
	    	//点击x删除历史记录
		    $(".closeHistory").on("click",function(){
		    	$(this).parents(".cookieitem").remove();
		    	/*cookieCount--;
		    	var No=$(this).parents(".cookieitem").children(".placediv").children(".No").text();
		    	if(No>=0){
		    		deleteCookie(No);
		    	}
		    	if(cookieCount==0){
		    		$("#cookieHistory").html("<p class='text-center'>暂无历史记录</p>");
		    	}*/
		    });
		    $(".placediv").on("click",function(){
		    	var name=$(this).children(".placename").text();
		    	var lng=$(this).children(".lng").text();
		    	var lat=$(this).children(".lat").text();
		    	$("#topInput").val(name);
		    	$("#searchlng").val(lng);
		    	$("#searchlat").val(lat);
		    })
	    });
	    
	    
	    //进入用户页面//点击头像动画
	   	$("#picture").on("click",function(){
		 	intoUser();
		 });
	   	
	  //进入搜索页面
	    $("#topInput").on("click",function(){
	    	intoSearch();
	    });
	  
	 
	    
	    
	  //从搜索页面返回
	  $(".back").on("click",function(){
		  pageNo=getHash("page");
		  history.back();
	  });
	  
	    //监听点击返回键
	     window.addEventListener('popstate', function () {
	    	 if(exit==true){
	    		 window.location.replace("login.html");
	    	 }
	    	 if(pageNo==1&&exit==false){
	    		 user2main();
	    	 }
	    	 else if(pageNo==2){
	    		 search2main();
	    	 }
	    	 else if(pageNo==3){
	    		 parksInfo2main();
	    	 }
	    	 else if(pageNo==4){
	    		 seat2info();
	    	 }
	    	 else if(pageNo==5){
	    		  myBook2user();	
	    	 }
	    	 else if(pageNo==6){
	    		 myCarId2user();
	    	 }
   		 });
	    
	     //停车场地图双击缩小功能
	   /* var hammer1=new Hammer(document.getElementById("seatContainer"));
	    hammer1.on("doubletap",function(){
	    	$(".seatCharts-seat").off("click");
	    	$(".seatCharts-cell").css({'height': '15px','width':'15px','line-height':' 15px','margin':' 1px' ,'font-size': '7px'});
	    	$(".seatCharts-row").css('height',' 20px');
	    	 $(".seatCharts-seat").on("click",function(){
	    	    	var clickX=event.clientX;
	    	    	var clickY=event.clientY;
	    	    	var offsetX=$("#seat-map").offset().left-clickX+mapX;
	    	    	var offsetY=$("#seat-map").offset().top-clickY+mapY;
	    	    	$("#seat-map").offset({top:offsetY,left:offsetX});
	    	    	var offsetX=$("#seat-map").offset().top;
	    	    	$(".seatCharts-cell").css({'height': '25px','width':'25px','line-height':' 25px','margin':' 3px' ,'font-size': '13px'});
	    	    	$(".seatCharts-row").css('height',' 35px');
	    	    });   
	    });*/
	     
	     //用户页面左滑添加事件
	    var hammer2=new Hammer(document.getElementById("background"));
	    hammer2.on("tap",function(){
	    		pageNo=getHash("page");
	    		if(pageNo==1){
	    			exit=false;
		    		history.back();
	    		}
	    });
	   
	    var hammer3=new Hammer(document.getElementById("userTotal"));
	    hammer3.on("swipeleft",function(){
	    		pageNo=getHash("page");
	    		exit=false;
	    		history.back();
	    });
	    
	    //输入框自动匹配
		$("#topInput").on("input propertychange",function(){
			var key=$(this).val();
			auto.search(key,function(status,result){
				if(status==='complete'){
						$("#demo").hide();
				      	var count=result.count;
				      	var arr=result.tips;
				      	var str="";
				      	if(key.length>0){
				      		str="<ul id='placeList' class='list-group'>";
						      for(var i=0;i<count;i++){
						      	str=str+"<li class='list-group-item text-center main'><span class='mainName'>"+arr[i].name+
						      	"</span>&nbsp;<span class='text-muted small'>"+arr[i].district+"</span></li>";
						      }
						      str=str+"</ul>";
				      	}
				      
				      var $ul=$(str);
				      var ht=$("#ddd").html();
				     if(ht.length==0)
				      {
				    	  $($ul).appendTo("#ddd");
				      }
				      else
				      {
				    	  $("#placeList").replaceWith($ul);
				      }
				      $(".main").on("click", function() {
			            	 var t=$(this).children(".mainName").text();
			            	 $("#topInput").val(t);
			            	//搜索插件
			            	 placeSearch.search(t,function(status,result){
			            		 if(status==='error'){
			            			 alert('暂无该地址信息');
			            		 }
			            		 else if(status==='complete'){
			            			 var arr=result.poiList.pois;
			            			 var position=arr[0].location;
			            			 document.getElementById('searchlng').value=position.getLng();
			             			 document.getElementById('searchlat').value=position.getLat();
			             		
			            		 }
			            	 })
			            	 
			           });
				    }
				    
				  });
				
		});
		
		//点击选位确认跳出车牌输入模态
		var idcount=1;
		var idflag=true;
		var carIdSelect=0;
		$("#seatButton").on("click",function(){
			var $str="<ul class='list-group'>";
			$(".carid").each(function(){
				$str+="<li class='list-group-item carIdLi text-center' >"+
					"<div class='checkbox'>"+
						"<label><input type='checkbox' name='carId' value='"+$(this).text()+"' class='sr-only'>"+$(this).text()+"</label>"+
					"</div>"+
					"</li>";
			})
			$str+="</ul>"
			if(idflag==true){
				$($str).prependTo("#selectCarIDModalBody");
				idflag=false
			}
			else{
				$("#selectCarIDModalBody ul").replaceWith($str);
			}
			$($str).prependTo("#selectCarIDModalBody");
			idflag=false
			$(".carIdLi").on("click",function(){
				var check=$(this).find("input").prop("checked");
				if(check==true){
					$(this).find("input").prop("checked",false);
					$(this).css("background-color","white");
					carIdSelect--;
				}
				else{
					$(this).find("input").prop("checked",true);
					$(this).css("background-color","#2EA9DF");
					carIdSelect++;
				}
				if(carIdSelect==seats){
					$("#selectCarIDModalBody button").text("确认");
				}
				
			});
			$("#selectCarIDModal").modal("show");
			/*if(seats==2){
				if(idcount==2&&idflag==false){
					$("#group2").remove();
					idcount--;
				}
				 $("#carIDModal").modal("show");
			}
			else if(seats==3){
				idcount=2;
				idflag=false;
				var $str="<div class='form-group' id='group2'>"+
                		"<label for='carId2' class='col-xs-4 control-label'>车牌</label>"+
                		"<div class='col-xs-8'>"+
                			"<input type='text'  class='form-control' name='carId2' id='carId2'>"+
                		"</div>"+
                	"</div>";
				$($str).insertAfter($("#group1"));
				 $("#carIDModal").modal("show");
			}
			*/
			//Ajax传入后台
		});
		
		//
		//高德坐标转百度
		function bd_encrypt(gg_lng, gg_lat) {
		    var X_PI = Math.PI * 3000.0 / 180.0;
		    var x = gg_lng, y = gg_lat;
		    var z = Math.sqrt(x * x + y * y) + 0.00002 * Math.sin(y * X_PI);
		    var theta = Math.atan2(y, x) + 0.000003 * Math.cos(x * X_PI);
		    var bd_lng = z * Math.cos(theta) + 0.0065;
		    var bd_lat = z * Math.sin(theta) + 0.006;
		    return {
		        bd_lat: bd_lat,
		        bd_lng: bd_lng
		    };
		}
		//点击到这去跳出选择地图模态框
		$("#tothere").on("click",function(){
			var ci=city.substring(0,city.length-1);
			var lat=parseFloat($("#destinationlat").val());
			var lng=parseFloat($("#destinationlng").val());
			var bd=bd_encrypt(lng,lat);
			var bd_lat=bd.bd_lat;
			var bd_lng=bd.bd_lng;
			var origin="origin=latlng:"+$("#lat").val()+","+$("#lng").val()+"|name:当前位置";
			var destination="&destination=name:"+$("#destinationname").text()+"|latlng:"+bd_lat+","+bd_lng+" &mode=driving&region="+ci+"&output=html&src=webapp.baidu.openAPIdemo";
			var baidu="bdapp://map/direction?"+origin+destination;
			//var gaode="amapuri://route/plan/?slat="+$("#lat").val()+"&slon="+$("#lng").val()+"&sname=当前位置&dlat=30.254226&dlon=120.165375&dname=Xcape密室逃脱(湖滨店)&dev=0&t=0";
			var gaode="amapuri://route/plan/?dlat="+lat+"&dlon="+lng+"&dname="+$("#destinationname").text()+"&dev=0&t=0";
			$("#baidu").attr("href",baidu);
			$("#gaode").attr("href",gaode);
			$("#mapAPP").modal("show");
		});
		
		//点击地图后模态框消失
		$("#mapList li").on("click",function(){
			$("#mapAPP").modal("hide");
		});
		
	    /*
	    //删除所有记录
	    function deleteCookie(){
	    	var d = new Date();
			d.setTime(d.getTime()+(exdays*24*60*60*1000));
			var expires = "expires="+d.toGMTString();
			document.cookie = cname + "=; " + expires;
	    }
	    
	    //删除单个cookie记录
		function deleteCookie(No){
			var values=cookievalue.split("|");
			var str="";
			for(var i=0;i<values.length-1;i++){
				if(i!=No){
					str+=values[i];
				}
			}
			setCookie(cookiename,str,365);
		}
	    
	    //设置cookie
	    function setCookie(cname,cvalue,exdays)
		{
			var d = new Date();
			d.setTime(d.getTime()+(exdays*24*60*60*1000));
			var expires = "expires="+d.toGMTString();
			document.cookie = cname + "=" + cvalue + "; " + expires;
		}
	    
	    //返回cookie值
	    function getCookie(cname)
		{
			var name = cname + "=";
			var ca = document.cookie.split(';');
			for(var i=0; i<ca.length; i++)
			  {
			  var c = ca[i].trim();
			  if (c.indexOf(name)==0) return c.substring(name.length,c.length);
			  }
			return "";
		}*/
	    
	    //进入用户页面
	    function intoUser(){
	    	history.pushState({page:"user"},null,"#page=1");
	    	pageNo=1;
	    	var left=width*0.9+"px";
	   		var right=width*0.1+"px";
	   		$("#person").height(height);
	   		$("#background").width(width);
		  	$("#background").height(height);
	   		$("#person").show();
		 	$("#person").animate({"display":"block","width":left},100);
		 	$("#container,#tip").animate({"left":left,"width":right},100);
		 	$("#background").css("background-color","gray");
		 	$("#background").animate({"left":left,"width":right,"opacity":"0.8"},100);
		 	$("#picture").off("click");
		 	$("#picture").on("click",function(){
		 		history.back();
		 		user2main();
		 	});
	    }
	    
	    //从头停车场页面返回停车场信息页面
	    function seat2info(){
	    	$("#parksInfo").show();
	    	$("#parkSeat").hide();
			  pageNo=getHash("page");
	    }
	    
	  
	    
	    //进入停车场选位页面
	    function intoParkSeat(){
	    	history.pushState({page:"parkSeat"},null,"#page=4");
	    	pageNo=4;
	    	$("#parkSeat").height(height);
	    	$("#parkSeat").width(width);
	    	$("#parksInfo").hide();
	    	$("#parkSeat").show();
	    	$("#tip").hide();
	    	 var $cart = $('#selectSeat'), //座位区
	    	    $counter = $('#counter'), //票数
	    	    $total = $('#total'); //总计金额
	    	    
	    	    var sc = $('#seat-map').seatCharts({
	    	        map: mapSeat,
	    	        naming:{
	    	        	top:false,
	    	        	left:false,
	    	        	getLabel:function(character, row, column) { //返回座位信息 
	    	                return tag++;
	    	            }
	    	        },
	    	        click: function () { //点击事件
	    	            if (this.status() == 'available') { //可选座
	    	            	if(seats>=3){
	    	            		alert("个人选车位不能超过三个");
	    	            		return "available";
	    	            	}
	    	            	var item="<span id='cart-item-"+this.settings.id+"'no='"+this.settings.id+"'class='label label-success'>"+this.settings.label+"号车位&nbsp;&times;</span>";
	    	                $(item).data('seatId', this.settings.id) .appendTo($cart);
	    	                var fn=this;
	    	                $('#cart-item-'+this.settings.id).on("click",fn,function(){
	    	                	var id=$(this).attr("id");
	    	                	var no=$(this).attr("no");
	    	                	//删除已预订座位
	    	                    $("#"+id).remove();
	    	                    //可选座
	    	                    $("#"+no).attr("class","seatCharts-seat seatCharts-cell available");
	    	                    $("#"+no).attr("aria-checked","false");
	    	                    seats--;
	    	                    fn.status("available");
	    	                });
	    	           
	    	                $counter.text(sc.find('selected').length+1);
	    	                $total.text(recalculateTotal(sc)+price);
	    	                seats++;
	    	                return "selected";
	    	            } else if (this.status() == 'selected') { //已选中
	    	                //更新数量
	    	                $counter.text(sc.find('selected').length-1);
	    	                seats--;
	    	                //更新总计
	    	                $total.text(recalculateTotal(sc)-price);
	    	                        
	    	                //删除已预订座位
	    	                $('#cart-item-'+this.settings.id).remove();
	    	                //可选座
	    	                return 'available';
	    	            } else if (this.status() == 'unavailable') { //已售出
	    	                return 'unavailable';
	    	            } else {
	    	                return this.style();
	    	            }
	    	        }
	    	        
	    	        
	    	    });
	    	    //已售出的座位
	    	    sc.get(['1_2', '4_4','4_5','6_6','6_7','8_5','8_6','8_7','8_8', '10_1', '10_2']).status('unavailable');
	    	  //点击位置放大
	    	    $(".seatCharts-seat").on("click",function(){
	    	    	var clickX=event.clientX;
	    	    	var clickY=event.clientY;
	    	    	var offsetX=$("#seat-map").offset().left-clickX+mapX;
	    	    	var offsetY=$("#seat-map").offset().top-clickY+mapY;
	    	    	$("#seat-map").offset({top:offsetY,left:offsetX});
	    	    	var offsetX=$("#seat-map").offset().top;
	    	    	$(".seatCharts-cell").css({'height': '25px','width':'25px','line-height':' 25px','margin':' 3px' ,'font-size': '13px'});
	    	    	$(".seatCharts-row").css('height',' 35px');
	    	    });   
	    
	    }
	    
	    //进入我的预约页面
	    function intoMyReservation(){
	    	history.pushState({page:"parksInfo"},null,"#page=5");
	    	pageNo=5;
	    	$("#myReservation").css("z-index",'10');
	    	$("#myReservation").show();
	    	$("#myReservation").width(width);
	    	$("#myReservation").height(height);
	    	$("#myBookList").css({'margin-left':'5px','margin-right':'5px','margin-top':windowHeight*0.13+'px'});
	    	$(".imgPark").width(width*0.3);
	    	$(".imgPark").height(width*0.3);
	    }
	    
	    //进入我的车牌页面
	    function intoMyCarId(){
	    	history.pushState({page:"parksInfo"},null,"#page=6");
	    	pageNo=6;
	    	$("#myCarId").css("z-index",'11');
	    	$("#myCarId").show();
	    	$("#myCarId").width(width);
	    	$("#myCarId").height(height);
	    	$("#carIdList").css({'margin-left':'5px','margin-right':'5px','margin-top':windowHeight*0.13+'px'});
	    }
	    
	    //从我的预约页面返回用户页面
	    function myBook2user(){
	    	pageNo=getHash("page");
	    	$("#myReservation").hide();
	    	
	    }
	    
	    //从我的车牌页面返回
	    function  myCarId2user(){
	    	pageNo=getHash("page");
	    	$(".nav2").slideUp(0);
	    	$("#myCarId nav").slideDown(0);
	    	$("#myCarId").hide();
	    }
	    
	    //点击删除删除车牌
	    $(".caridDelete").on("click",function(){
	    	$(this).parents(".carIdItem").remove();
	    	//ajax
	    });
	    
	    
	    //点击修改修改车牌号
	    $(".caridAlter").on("click",function(){
	    	var id=$(this).parents(".carIdItem").find("p").text();
	    	$("#originCarId").val(id);
	    	$("#carIdAlter").modal("show");
	    });
	    
	    //点击确认修改车牌
	    $("#confirmAlterCarId").on("click",function(){
	    	var no=$("#alterCarIdForm input[type = 'hidden']").val();
	    	$("#"+no).text($("#afterCarId").val());
	    	//ajx
	    });
	    
	    //点击添加车牌跳出输入框动画
	    $("#addIcon").on("click",function(){
	    	$("#myCarId nav").slideUp();
	    	//$("#nav2").css("height",windowHeight*0.1+'px');
	    	$(".nav2").css("z-index",'20');
	    	$(".nav2").slideDown();
	    });
	    
	    //点击X输入框消失导航栏出现
	    $(".nav2 .glyphicon-remove").on("click",function(){
	    	$(".nav2").slideUp();
	    	$("#myCarId nav").slideDown();
	    	$("addCar").val("");
	    })
	    
	    //添加车牌
	    var carNo=0;
	    $("#addCarId").on("click",function(){
	    	var id=$("#addCar").val();
	    	if(id!=""){
	    		var $str=" <div class='panel panel-default carIdItem'>"+
		        "<div class='panel-heading'>"+
		            "<h4 class='panel-title'>"+
		            	"<div class='row text-center'>"+
		                	"<p id='new"+carNo+"' class='carid'>"+id+"</p>"+
		                	"<a data-toggle='collapse' data-parent='#carIdList' href='#collapsenew"+carNo+"'>修改车牌</a>"+
		                "</div>"+
		            "</h4>"+
		        "</div>"+
		     "<div id='collapsenew"+carNo+"' class='panel-collapse collapse'>"+
		         "<div class='panel-body'>"+
		               "<div class='row'>"+
			                "<div class='col-xs-3'></div>"+
			                "<div class='col-xs-6'>"+
			                	"<button class='btn btn-info caridDelete pull-left'>删除</button>"+
			                	"<button class='btn btn-success caridAlter pull-right'>修改</button>"+
			                "</div>"+
			                "<div class='col-xs-3'></div>"+
		                "</div>"+
		          "</div>"+
		       "</div>"+
		    "</div>";
		    	carNo++;
		    	$($str).appendTo($("#carIdList"));
		    	$(".caridAlter").on("click",function(){
			    	$("#originCarInput").remove();
			    	$("#alterCarIdForm input[type = 'hidden']").val($(this).parents(".carIdItem").find("p").attr("id"));
			    	var $str="<div class='form-group' id='originCarInput'>"+
		                		"<label for='originCarId' class='col-xs-3 control-label'>原车牌</label>"+
		                		"<div class='col-xs-9'>"+
		                			"<input type='text' class='form-control' name='originCarId' id='originCarId' disabled='disabled' value='"+$(this).parents(".carIdItem").find("p").text()+"'>"+
		                		"</div>"+
		                	"</div>";
			    	$($str).prependTo($("#alterCarIdForm"));
			    	$("#carIdAlter").modal("show");
			    });
		    	 $(".caridDelete").on("click",function(){
		 	    	$(this).parents(".carIdItem").remove();
		 	    	//ajax
		 	    });
		    	//ajax
	    	}
	    	
	    });
	    
	    
	    //进入停车场信息页面
	    function intoParksInfo(){
	    	history.pushState({page:"parksInfo"},null,"#page=3");
	    	pageNo=3;
	    	var imgwidth=$(".bodyPark").width()+"px";
	    	$("#parksInfo").show();
	    	if(search2info==2){
	    		$("#background").hide();
	    	}
	    	$("#ddd").html("");
	    	$("#parksInfo").width(width);
	    	$("#parksInfo").height(height);
	    	$("#parksInfo").animate({"opacity":"1.0"},500);
	    	$("#tip").hide();
	    	$(".imgPark").width(width*0.3);
	    	$(".imgPark").height(width*0.3);
	    /*	var s="<div class='panel panel-default'>"+
     "   <div class='panel-heading'>"+
         "   <h4 class='panel-title'>"+
              "  <a data-toggle='collapse' data-parent='#accordion' "+
              "  href='#collapse'"+
             "   	点击我进行展开，再次点击我进行折叠。第 1 部分"+
           "     </a>"+
        "    </h4>"+
      "  </div>"+
       " <div id='collapse' class='panel-collapse collapse'>"+
         "   <div class='panel-body'>"+
            "    Nihil anim keffiyeh helvetica, craft beer labore wes anderson "+
            "    cred nesciunt sapiente ea proident. Ad vegan excepteur butcher "+
           "     vice lomo."+
         "   </div>"+
       " </div>"+
   " </div>";
       $("#accordion").html(s);*/
	    }
	    
		//进入搜索页面
		 function intoSearch(){
		    	history.pushState({page:"search"},null,"#page=2");
		    	pageNo=2;
		    	$("#demo").slideDown();
		    	$("#background").width(width);
			  	$("#background").height(height);
			  	$("#background").show();
			  	$("#background").css("background-color","white");
		    	$("#background").animate({"opacity":"0.8"},500);
		    	$("#picture").hide();
		    	$("#search2main").show();
		    }
		
		 //从停车场信息页面返回
		 function parksInfo2main(){
			 $("#parksInfo").width(0);
		     $("#parksInfo").height(0);
		   	 $("#parksInfo").hide();
		   	 if(search2info==2){
		   		 $("#background").show();
		   		 $("#demo").show();
		   		 $("#topInput").val("");
		   	 }
		   	 $("#parksInfo").animate({"opacity":"0.0"},500);
		   	 $("#tip").show();
			  pageNo=getHash("page");
		 }
		 
		//从搜索页面返回
		function search2main(){
			 $("#ddd").html("");
			 $("#demo").hide();
			 $("#topInput").val("");
			 $("#background").animate({"opacity":"0"},500);
			 $("#picture").show();
			 $("#search2main").hide();
			 $("#background").width(0);
			 $("#background").height(0);
			  pageNo=getHash("page");
		}
		
		//从用户页面返回
		function user2main(){
			  $("#picture").off("click");
			  $("#picture").on("click",function(){
			   		intoUser();
			  });
			  $("#background").animate({"left":"0","width":width,"opacity":"0"},100);
			  $("#container").animate({"left":"0","width":width},100);
			  $("#tip").animate({"left":tipLeft,"width":tipWidth},100);
			  $("#person").animate({"width":"0"},100).hide();
			  $("#person").height(0);
		   	  $("#background").width(0);
			  $("#background").height(0);
			  pageNo=getHash("page");
		}
		
		//计算总金额
		 function recalculateTotal(sc) {
		     var total = 0;
		     sc.find('selected').each(function () {
		         total += price;
		     });
		             
		     return total;
		 }
		
		
		
	        geolocation = new AMap.Geolocation({
	            enableHighAccuracy: true,//是否使用高精度定位，默认:true
	            timeout: 10000,          //超过10秒后停止定位，默认：无穷大
	            buttonOffset: new AMap.Pixel(10, 20),//定位按钮与设置的停靠位置的偏移量，默认：Pixel(10, 20)
	            zoomToAccuracy: true,      //定位成功后调整地图视野范围使定位位置及精度范围视野内可见，默认：false
	            buttonPosition:'RB',
	            showCircle: false,
	            showButton: false
	        });
	        
	        var flag=0;
	        map.addControl(geolocation);
	        geolocation.getCurrentPosition();
	       // var t=setInterval("geolocation.getCurrentPosition()",5000);
	        AMap.event.addListener(geolocation, 'complete', onComplete);//返回定位信息
	        AMap.event.addListener(geolocation, 'error', onError);      //返回定位出错信息
	    
	    
	    //解析定位结果
	    function onComplete(data) {
	        flag++;
	    	map.setZoom(15);
	    	document.getElementById('lng').value=data.position.getLng();
	    	document.getElementById('lat').value=data.position.getLat();
	        
	    }
	    //解析定位错误信息
	    function onError(data) {
	    	if(flag==0){
	    		alert('定位失败，请打开您的GPS');
		       // clearInterval(t);
	    	}
	        
	    }
	    
	    
	    
	});
    
 
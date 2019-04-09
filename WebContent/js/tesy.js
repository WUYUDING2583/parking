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
	$("#bookDetail").css("height",windowHeight*0.18+'px');
	$("#seatContainer").css("height",windowHeight*0.6+'px');
	$("#selectSeat").css("height",windowHeight*0.09+'px');
	$("#seatButton").css("height",windowHeight*0.09+'px');
	$(function() {
	    $( "#seat-map" ).draggable();
	  });
	
	
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
	    var cookiename="historyPlace";//cookie名
	    var pageNo;//页面编号
	    var price = 80; //票价
		var tag=1;
		var mapSeat=new Array('aaaaaaaaaa_aaaaaaaaaa',
		        	'a___________________a',
		        	'a_aa_aa_aa_aa_aa_aa_a',
		        	'a_aa_aa_aa_aa_aa_aa_a',
		        	'a_aa_aa_aa_aa_aa_aa_a',
		        	'a_aa_aa_aa_aa_aa_aa_a',
		        	'a_aa_aa_aa_aa_aa_aa_a',
		        	'a___________________a',
		        	'aaaaaaaaaa_aaaaaaaaaa');
	    
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
	    
	    //从cooki中读取历史搜索记录
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
	    }
	    $("#cookieHistory").html(st);
	    
	    
	    //点击我要预约进入停车场选位页面
	    $(".book").on("click",function(){
	    	intoParkSeat();
	    });
	    
	    //点击清空
	    $("#sureClear").on("click",function(){
	    	$("#cookieHistory").html("<p class='text-center'>暂无历史记录</p>");
	    	deleteCookie();
	    });
	    
	    //点击x删除历史记录
	    $(".closeHistory").on("click",function(){
	    	$(this).parents(".cookieitem").hide();
	    	cookieCount--;
	    	var No=$(this).parents(".cookieitem").children(".placediv").children(".No").text();
	    	deleteCookie(No);
	    	if(cookieCount==0){
	    		$("#cookieHistory").html("<p class='text-center'>暂无历史记录</p>");
	    	}
	    });
	    
	    //点击查询添加历史纪录
	    $("#query").on("click",function(){
	    	intoParksInfo();
	    	var inputVal=$("#topInput").val();
	    	if(inputVal!=""){
	    		var value=$("#topInput").val()+","+$("#lng").val()+","+$("#lat").val()+"|";
	    		var cvalue=getCookie(cookiename);
		    	cvalue=value+cvalue;
		    	setCookie(cookiename,cvalue,365);
	    	}
	    });
	    
	    //点击历史记录输入框自动输入
	    $(".placediv").on("click",function(){
	    	var name=$(this).children(".placename").text();
	    	var lng=$(this).children(".lng").text();
	    	var lat=$(this).children(".lat").text();
	    	$("#topInput").val(name);
	    	$("#lng").val(lng);
	    	$("#lat").val(lat);
	    })
	    
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
			 history.back();
	  });
	  
	    //监听点击返回键
	     window.addEventListener('popstate', function () {
	    	 var page=getHash("page");
	    	 if(page==1){
	    		 user2main()
	    	 }
	    		// toMain();
   		 });
	    
	    //用户页面左滑添加事件
	    var hammer1=new Hammer(document.getElementById("person"));
	    hammer1.on("swipeleft",function(){
	    	var page=getHash("page");
	    	if(page==1){
	    		history.back();
	    	}
	    		
	    });
	    
	    var hammer2=new Hammer(document.getElementById("background"));
	    hammer2.on("tap",function(){
	    	var page=getHash("page");
	    	if(page==1){
	    		history.back();
	    	}
	    });
	  
	    
	    //输入框自动匹配
		$("#topInput").on("input propertychange",function(){
			var key=$(this).val();
			auto.search(key,function(status,result){
				if(status==='complete'){
						$("#demo").collapse('hide');
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
			            			 document.getElementById('lng').value=position.getLng();
			             			 document.getElementById('lat').value=position.getLat();
			             		
			            		 }
			            	 })
			            	 
			           });
				    }
				    
				  });
				
		});
	    
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
		}
	    
	    //进入用户页面
	    function intoUser(){
	    	history.pushState({page:"user"},null,"#page=1");
	    	var left=width*0.9+"px";
	   		var right=width*0.1+"px";
	   		$("#person").height(height);
	   		$("#background").width(width);
		  	$("#background").height(height);
	   		$("#person").show();
		 	$("#person").animate({"width":left},100);
		 	$("#container,#tip").animate({"left":left,"width":right},100);
		 	$("#background").css("background-color","gray");
		 	$("#background").animate({"left":left,"width":right,"opacity":"0.8"},100);
		 	$("#picture").off("click");
		 	$("#picture").on("click",function(){
		 		history.back();
		 	});
	    }
	    
	    //进入停车场选位页面
	    function intoParkSeat(){
	    	history.pushState({page:"parkSeat"},null,"#page=4");
	    	toMain();
	    	$("#parkSeat").height(height);
	    	$("#parkSeat").width(width);
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
	    	        legend : { //定义图例
	    	            node : $('#legend'),
	    	            items : [
	    	                [ 'a', 'available',   '可选座' ],
	    	                [ 'a', 'unavailable', '已售出']
	    	            ]                    
	    	        },
	    	        click: function () { //点击事件
	    	            if (this.status() == 'available') { //可选座
	    	            	var item="<span id='cart-item-"+this.settings.id+"'No='"+this.settings.id+"'class='label label-success'>"+this.settings.label+"号车位&nbsp;&times;</span>";
	    	                $(item).appendTo($cart);
	    	                $('#cart-item-'+this.settings.id).on("click",function(){
	    	                	var id=$(this).attr("id");
	    	                	var no=$(this).attr("no");
	    	                	//删除已预订座位
	    	                    $("#"+id).remove();
	    	                    //可选座
	    	                    $("#"+no).attr("class","seatCharts-seat seatCharts-cell available");
	    	                    $("#"+no).attr("aria-checked","false");
	    	                });
	    	                $counter.text(sc.find('selected').length+1);
	    	                $total.text(recalculateTotal(sc)+price);
	    	                            
	    	                return "selected";
	    	            } else if (this.status() == 'selected') { //已选中
	    	                //更新数量
	    	                $counter.text(sc.find('selected').length-1);
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
	    	        
	    
	    }
	    
	    //进入停车场信息页面
	    function intoParksInfo(){
	    	history.pushState({page:"parksInfo"},null,"#page=3");
	    	var imgwidth=$(".bodyPark").width()+"px";
	    	$("#parksInfo").show();
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
		    	$("#background").width(width);
			  	$("#background").height(height);
		    	$("#background").animate({"opacity":"0.8"},500);
		    	$("#picture").hide();
		    	$("#search2main").show();
		    }
		
		 //从停车场信息页面返回
		 function parksInfo2main(){
			 $("#parksInfo").width(0);
		     $("#parksInfo").height(0);
		   	 $("#parksInfo").hide();
		   	 $("#parksInfo").animate({"opacity":"0.0"},500);
		   	 $("#tip").show();
		 }
		 
		//从搜索页面返回
		function search2main(){
			 $("#ddd").html("");
			 $("#demo").collapse('hide');
			 $("#topInput").val("");
			 $("#background").animate({"opacity":"0"},500);
			 $("#picture").show();
			 $("#search2main").hide();
			 $("#background").width(0);
			 $("#background").height(0);
		}
		
		//从用户页面返回
		function user2main(){
			  $("#person").animate({"width":"0"},100).hide();
			  $("#container").animate({"left":"0","width":width},100);
			  $("#tip").animate({"left":tipLeft,"width":tipWidth},100);
		}
		
		//计算总金额
		 function recalculateTotal(sc) {
		     var total = 0;
		     sc.find('selected').each(function () {
		         total += price;
		     });
		             
		     return total;
		 }
		//返回主页面
		function toMain(){
			$("#person").animate({"width":"0"},100).hide();
			$("#container").animate({"left":"0","width":width},100);
			$("#tip").animate({"left":tipLeft,"width":tipWidth},100);
			$("#ddd").html("");
			$("#demo").collapse('hide');
			$("#topInput").val("");
			$("#background").animate({"opacity":"0"},500);
			$("#picture").show();
			$("#search2main").hide();
			$("#background").width(0);
			$("#background").height(0);
			$("#parksInfo").width(0);
		    $("#parksInfo").height(0);
		   	$("#parksInfo").hide();
		   	$("#parksInfo").animate({"opacity":"0.0"},500);
		   	$("#tip").show();
		   	$("#picture").off("click");
		   	$("#picture").on("click",function(){
		   		intoUser();
		   	});
		   	$("#parkSeat").hide();
		}
		
		
	        geolocation = new AMap.Geolocation({
	            enableHighAccuracy: true,//是否使用高精度定位，默认:true
	            timeout: 10000,          //超过10秒后停止定位，默认：无穷大
	            buttonOffset: new AMap.Pixel(10, 20),//定位按钮与设置的停靠位置的偏移量，默认：Pixel(10, 20)
	            zoomToAccuracy: true,      //定位成功后调整地图视野范围使定位位置及精度范围视野内可见，默认：false
	            buttonPosition:'RB',
	            showCircle: false
	           // showButton: false
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
	    	map.setZoom(17);
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
    
 
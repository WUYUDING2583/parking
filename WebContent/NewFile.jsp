<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>主页</title>
    <script type="text/javascript" src="https://webapi.amap.com/maps?v=1.4.8&key=cc17678642f59e975f39bb06fcb83665&plugin=AMap.Autocomplete,AMap.PlaceSearch,AMap.Geolocation"></script>
    <link rel="stylesheet" href="https://cdn.bootcss.com/bootstrap/3.3.7/css/bootstrap.min.css">  
	<script src="https://cdn.bootcss.com/jquery/2.1.1/jquery.min.js"></script>
	<script src="https://cdn.bootcss.com/bootstrap/3.3.7/js/bootstrap.min.js"></script>
	<script src="js/jquery.color.js"></script>
	<script src="js/hammer.js"></script>
	<link rel="stylesheet" href="css/main.css"> 
</head>
<body>
<div id='container'></div>
<!-- 背景面板 -->
<div id="background"></div>
<!-- 停车场信息页面 -->
<div id="parksInfo">
	<nav class="navbar navbar-default navbar-fixed-top" role="navigation">
		<div class="container-fluid">
			<div class="navbar-header">
	      		<span class="navbar-brand glyphicon glyphicon-chevron-left back" ></span>
	   			<span class="navbar-brand ">停车场信息</span>
	   		</div>
   		</div>
	</nav>
<div class="panel-group" id="accordion">
<%for(int i=0;i<7;i++){ %>
    <div class="panel panel-default">
        <div class="panel-heading">
            <h4 class="panel-title">
                <a data-toggle="collapse" data-parent="#accordion" 
                href="#collapse"+"<%=i %>">
                	点击我进行展开，再次点击我进行折叠。第 <%=i %> 部分
                </a>
            </h4>
        </div>
        <div id="collapse"+"<%=i %>" class="panel-collapse collapse">
            <div class="panel-body">
                Nihil anim keffiyeh helvetica, craft beer labore wes anderson 
                cred nesciunt sapiente ea proident. Ad vegan excepteur butcher 
                vice lomo.
            </div>
        </div>
    </div>
    <%} %>
    </div>
</div>
<!-- 输入框 -->
<div id="tip">
	<div id="center">
		<input class="form-control" type="hidden"  id="lng" name="lng"  >
		<input class="form-control" type="hidden" id="lat" name="lat">
		<div class="input-group input-group-lg">
			
			<span id="userIcon"class="input-group-addon"	style="background-color:white;">
			
			<span class="glyphicon glyphicon-chevron-left back" id="search2main"></span>
			<span class="glyphicon glyphicon-user" id="picture"></span></span>
			<input class="form-control" type="text" id="topInput" placeholder="我的位置" data-toggle="collapse" data-target="#demo" >
			<span class="input-group-btn"><button class="btn btn-default" id="query">查询</button></span>
		</div>
	<div class="panel panel-default" id="ddd"></div>
	<div id="demo" class="collapse">
	<div class="panel-group">
		<!-- 功能面板 -->
		<div class="panel panel-default">
			<div class="panel-heading text-center" id="head">
				输入你要搜索的位置或直接点击查询搜索您附近的停车场信息
			</div>
			<div class="panel-body text-center">
				功能尚待开发
			</div>
		</div>
		<!-- 历史搜索记录 -->
		<div class="panel panel-default" id="historyPanel">
			<div class="panel-heading text-center">
				<div class="row">
					<div class="col-xs-4"></div>
					<div class="col-xs-4">
						<span class="text-center">历史记录</span>
					</div>
					<div class="col-xs-4">
						<span class="glyphicon glyphicon-trash pull-right" id="clear" data-toggle="modal" data-target="#myModal">清空</span>
					</div>
				</div>
			</div>	
			<div class="panel-body" id="cookieHistory"></div>
		</div>
	</div>
	</div>
	</div>
</div>
<!-- 个人页面 -->
<div class="panel panel-default" id="person">
	<div class="panel-heading" id="personhead">
		<img src="http://jsjzx.top/1.jpg" class="img-circle imghead">
		<span class="lead headname">用户名称/用户头像</span>
	</div>
	<div class="panel-body">
		<ul class="nav nav-pills nav-justified">
			<li class="list-group-item text-center"><a href="#">我的预约</a></li>
			<li class="list-group-item text-center"><a href="#">关联手机号</a></li>
			<li class="list-group-item text-center"><a href="#">退出登陆</a></li>
		</ul>
	</div>
</div>
<div class="modal fade" id="myModal" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
	<div class="modal-dialog">
		<div class="modal-content">
			<div class="modal-body text-center lead">确认清空输入历史？</div>
			<div class="modal-footer">
				<div class="row">
					<div class="col-xs-9">
						<button type="button" class="btn btn-default" data-dismiss="modal">取消</button>
						<button type="button" class="btn btn-info" data-dismiss="modal" id="sureClear">确认</button>
					</div>
					<div class="col-xs-3"></div>
				</div>
			</div>
		</div>
	</div>
</div>
<script src="js/main.js"></script>
</body>
</html>
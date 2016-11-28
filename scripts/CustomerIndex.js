
// JavaScript Document
	var hfObj;
	var srcUser;
	var userName="testUser1";

$(document).ready(function(){
	changeDivHeight();


    function loadmain(){
 		$.ajax({
            url:'/users?userName='+userName+'&mainPage='+true,
	 	    type:"GET",
	  	    dataType:"JSON",
	    	success:function(response){
	    		var namefield=$("#nameField");
	    		namefield.html(response.userName);
	    		var postNumField = $("#postNumField");
	    		postNumField.html(response.posts.length);
	    		var followNumField = $("#followNumField");
	    		followNumField.html(response.follow.length);
 				console.log(response.followers.length);
 				var followerNumField = $("#followerNumField");
 				followerNumField.html(response.followers.length);
		    }
       });
    }
    loadmain();

})
	/* Setting left and right part of the page's height to auto */
	function initDivHeight(divObj1,divObj2){
		divObj1.style.height = "auto";
		divObj2.style.height = "auto";
	}
	function changeDivHeight(){
		var mainBanner = document.getElementById("mainBanner");
		var mainRight = document.getElementById("mainRight");
		initDivHeight(mainBanner,mainRight);//设置高度为自动
		var height = mainBanner.offsetHeight > mainRight.offsetHeight ? mainBanner.offsetHeight : mainRight.offsetHeight;//获取高度高的值
		mainBanner.style.height = height + "px";//为他们的高度都赋高的那个值
		mainRight.style.height = height+ "px";//
	}

    function calNum(txtobj,divobj,fg){
		var text = txtobj.value;
		var n = 140;
		n = n - Math.floor(text.length);// calculation
		if(n<0){
			// set backgroundColor to red if exceed chars
			divobj.style.color = "#969";
		}else{
			divobj.style.color = "#000";
		}
    	divobj.innerHTML = n ;
    }

    function submitState(){
	var textfield = document.getElementById("textfield2");
	var text = textfield.value;
	var time = new Date();
	console.log(time);
	if (text.length>0){
	    $.ajax({
	        url:"/post",
	        type:"POST",
	        dataType:"json",
	    	contentType:"application/json; charset=utf-8",
	    	data:JSON.stringify({
		    	"userName":userName,
		    	"post":{
			    	"userName":userName,
			    	"content":text,
			    	"time": time.toISOString()
		    	}
        	}),
	    	success:function(response){
                console.log(response);
				var str = text;
				console.log(userName);
				// adding new post
				addPost(userName, str, time);
            }
	    });
    }
	textfield.value = "";
	changeDivHeight();
}

function addPost(userName, str, time) {
	var innerht =
		"<div class='stateShow'>\
		  <div class='stateShowWord'>\
			<table width='450' border='0' cellpadding='0' \
				cellspacing='0' class='stateTable'>\
				<tr>\
				  <td width='70' align='center' valign='top'>\
					<a href='#'>\
					 <img src='images/MainRightFirstLineTitle.gif' \
					  alt='' width='48' height='48' />\
					</a>\
				  </td>\
				  <td width='380'>\
					<a href='#'>" + userName + "</a>\
					  <img src='images/1.gif' align='absmiddle' \
					  style='border:none;' />&nbsp;" + str +
				 "</td>\
				</tr>\
			 </table>\
		   </div>\
		   \
		   <div class='stateImgShow'>\
		   </div>\
		   \
		   <div class='stateShowtime'>" + time +
		  "</div>\
		  \
		   <div class='stateOp'>\
			<a class='opState' onclick='reply(this)'>Reply</a>\
			<a class='opState'>like(0)</a>\
			<a class='opState' onclick='delState(this)'>Delete</a>\
		   </div>\
		  \
		  <div class='huifu'></div>\
		</div>";
		var divObj = document.getElementById("mainBannerContent");
		divObj.innerHTML = innerht + divObj.innerHTML;
}




// 	var hfObj;
// 	var srcUser;
// 	var userName="testUser1";
// /* 设置页面中的主题部分的左栏和右栏部分高度为自动 */
// function initDivHeight(divObj1,divObj2){
// 	divObj1.style.height = "auto";
// 	divObj2.style.height = "auto";
// }
// /* 设置主体部分的高度以实际高度高的那个为准 */
// function changeDivHeight(){
// 	var mainBanner = document.getElementById("mainBanner");
// 	var mainRight = document.getElementById("mainRight");
// 	initDivHeight(mainBanner,mainRight);//设置高度为自动
// 	var height = mainBanner.offsetHeight > mainRight.offsetHeight ? mainBanner.offsetHeight : mainRight.offsetHeight;//获取高度高的值
// 	mainBanner.style.height = height + "px";//为他们的高度都赋高的那个值
// 	mainRight.style.height = height+ "px";//
// }
// /* 动态的计算文本框里面已经输入的数量  */
// function calNum(txtobj,divobj,fg){
// 	var text = txtobj.value;
// 	var n = 140;
// 	n = n - Math.floor(text.length);//计算，一个中文是1个字符，2个英文是1个
// 	if(n<0){
// 		divobj.style.color = "#969";//设置如果超了，变背景色为红色
// 	}else{
// 		divobj.style.color = "#000";
// 	}
//     divobj.innerHTML = n ;
// }


// /* 当点提交按钮时，对文本框里面的内容进行处理，并进行提交 */
// function submitState(){
// 	var textfield = document.getElementById("textfield2");
// 	var text=textfield.value;
// 	var time = new Date();
// 	console.log(time);
// 	if (text.length>0){
// 	    $.ajax({
// 	        url:"/post",
// 	        type:"POST",
// 	        dataType:"json",
// 	    	contentType:"application/json; charset=utf-8",
// 	    	data:JSON.stringify({
// 		    	"userName":userName,
// 		    	"post":{
// 			    	"userName":userName,
// 			    	"content":text,
// 			    	"time":time
// 		    	}
//         	}),
// 	    	success:function(response){
//                 console.log(response);
//             }
// 	    });
//     }
// 	// 	var innerht = "<div class='stateShow' onmouseover='stateMouseOver(this)' onmouseout='stateMouseOut(this)'><div class='stateShowWord'><table width='450' border='0' cellpadding='0' cellspacing='0' class='stateTable'><tr><td width='70' align='center' valign='top'><a href='#'><img src='images/MainRightFirstLineTitle.gif' alt='' width='48' height='48' /></a></td><td width='380'><a href='#'>DarkDemon</a><img src='images/1.gif' align='absmiddle' style='border:none;' />&nbsp;"+str+"</td></tr></table></div><div class='stateImgShow'></div><div class='stateShowtime'>"+time+"</div><div class='stateOp'><a onclick='reXianShi(this)' class='opState'>回复</a><a class='opState'>转发</a><a onclick='delState(this)' class='opState'>删除</a></div><div class='huifu'></div></div>";
// 	// 	var divObj = document.getElementById("mainBannerContent");
// 	// 	divObj.innerHTML = innerht + divObj.innerHTML;
// 	// }
// 	textfield.value = "";
// 	changeDivHeight();
// }

// window.onload = function(){
// 	changeDivHeight();//开始的时候设置左栏和右栏的高度


// 	//隐藏 #back-top 先
// 	$("#backtop").hide();
// 	// 滚动条距顶100px显示 #back-top
// 	$(function () {
// 		$(window).scroll(function () {
// 			if ($(this).scrollTop() > 100) {
// 				$('#backtop').fadeIn();
// 			} else {
// 				$('#backtop').fadeOut();
// 			}
// 		});
// 		// 点击事件 回到顶部
// 		$('#backtop a').click(function () {
// 			$('body,html').animate({
// 				scrollTop: 0
// 			}, 600);
// 			return false;
// 		});
// 	});
// }

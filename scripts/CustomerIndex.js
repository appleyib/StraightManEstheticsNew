
// JavaScript Document
	var hfObj;
	var srcUser;
	var userName;
	var isadmin;
	var result;
	$.getScript("./scripts/main.js", function() {
		result = getCookie();
		userName = result[0];
		isadmin = result[1];
	})
	//document.URL.split('?')[1].split("=")[1];

$(document).ready(function() {
	console.log(userName);
	if (userName == undefined) {
		window.location = "./login.html";
	}

    $("#profile").click(function(e){
    	e.preventDefault();
    	console.log("keke");
		window.location = "./setting.html?loginuser=" + userName;
    	// window.location = "./setting.html?loginuser="+userName+"?currentuser="+userName;
    });



	changeDivHeight();
	loadmain();
});

function loaduser(user) {
		var namefield=$("#nameField");
		namefield.html(user.userName);
		var postNumField = $("#postNumField");
		postNumField.html(user.posts.length);
		var followNumField = $("#followNumField");
		followNumField.html(user.follow.length);
		var followerNumField = $("#followerNumField");
		followerNumField.html(user.followers.length);
		var followingField = $("#ul2");
		for (let i = 0;i<user.follow.length;i++){
			followingField.append('<a href="#" class="a1"><li><font class="style2">'+user.follow[i]+'</font></li></a>');
		}
		// sort posts by post time
		var posts = user.postsOnPage.sort( function(a, b) {
			var a_t = new Date(a.time);
			var b_t = new Date(b.time);
			if (a_t.getTime() > b_t.getTime()) {
				return 1;
			} else if (a_t.getTime() < b_t.getTime()) {
				return -1;
			}
			return 0;
		});
		// add post to page
		for(let i=0;i< posts.length;i++) {
			addPost(posts[i]);
		}

}


function loadmain() {
	$.ajax({
		url: '/users?userName='+userName+'&mainPage='+true,
		type: "GET",
		dataType: "JSON",
		success: function(response) {
			loaduser(response);
		}
   });
}

/* Setting left and right part of the page's height to auto */
function initDivHeight(divObj1,divObj2) {
	divObj1.style.height = "auto";
	divObj2.style.height = "auto";
}
function changeDivHeight() {
	var mainBanner = document.getElementById("mainBanner");
	var mainRight = document.getElementById("mainRight");
	initDivHeight(mainBanner,mainRight);//设置高度为自动
	var height = mainBanner.offsetHeight > mainRight.offsetHeight ? mainBanner.offsetHeight : mainRight.offsetHeight;//获取高度高的值
	mainBanner.style.height = height + "px";//为他们的高度都赋高的那个值
	mainRight.style.height = height+ "px";//
}

function calNum(txtobj,divobj,fg) {
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

function submitState() {
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
				window.location.reload();
            }
	    });
    }
}

/* helper function to add post*/
function addPost(post) {
	user = post.userName;
	str = post.content;
	time = new Date(post.time);
	comments = post.comment;
	id = post.id;
	like = post.likes;
	// var text;
	// if (comments == []) {
	// 	text = "";
	// } else {
	// 	for (let item in comments) {
	// 		console.log(comments[item]);
	//
	// 	}
	// }
	var innerht =
		"<div class='stateShow' name='" + id + "'>\
		  <div class='stateShowWord'>\
			<table width='450' border='0' cellpadding='0' \
				cellspacing='0' class='stateTable'>\
				<tr>\
				  <td width='70' align='center' valign='top'>\
					<a href='#'>\
					 <img src='images/icon.jpg' \
					  alt='' width='48' height='48' />\
					</a>\
				  </td>\
				  <td width='380'>\
					<a href='#'>" + user + "</a>\
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
			<!--<a class='opState' onclick='delState(this)'>Delete</a>-->\
		   </div>\
		  \
		  <div class='comments' id='" + user + id + "'></div>\
		</div>";
		addComment(comments, id, user);
		var divObj = document.getElementById("mainBannerContent");
		divObj.innerHTML = innerht + divObj.innerHTML;
		changeDivHeight();
}




function addComment(comments, pId, user) {
	var parent = $("#" + user + pId);
	console.log(parent);
	for (let item in comments) {
		let comment = comments[item];
		let text =
			"<div class='stateComments' id='" + "" + user + pId
															+ comment.id + "'>\
			  <table width='450' border='0' cellpadding='0' \
								cellspacing='0' class='commentTable'>\
				<tr>\
				  <td width='70' align='center' valign='top'>\
				  </td>\
				  <td width='380'>\
					<a href='#'>" + comment.userName + "</a>\
					  <img src='images/1.gif' align='absmiddle' \
					  style='border:none;' />&nbsp;" + comment.content +
				 "</td>\
				</tr>\
			  </table>\
			  \
			   <div class='commentOp'>\
				<a class='opComment' onclick=\"delComment(" + comment.id
										+ ", " + pId +  ", '" + user
										+ "');\">Delete</a>\
			   </div>\
			 </div>";
		 parent.append(text);
	}
}




function delComment(cId, pId, user) {
	var urlD = "/deleteComment?userName=" + user + "&postId=" + pId
														+ "&commentId=" + cId;
	$.ajax({
		url: urlD,
		type: "DELETE",
		// dataType: "json",
		// contentType: "application/json; charset=utf-8",
		success: function(response) {
			if (response == "Success") {
				var field = $("#" + user + pId + cId).remove();
				window.alert(response);
			} else {
				window.alert(response);
			}
		},
		error:function(xhr){
			alert(xhr.responseText);
		}
	});
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


// JavaScript Document
var hfObj;
var srcUser;
var userName;
var isadmin;
var result;

result = getCookie();
userName = result[0];
isadmin = result[1];
	//document.URL.split('?')[1].split("=")[1];

$(document).ready(function() {
	if (userName == undefined) {
		window.location = "./login.html";
	}

    $("#profile").click(function(e) {
    	e.preventDefault();
		window.location = "./setting.html?loginuser=" + userName;
    	// window.location = "./setting.html?loginuser="+userName+"?currentuser="+userName;
    });

	$("#quitBtn").click(function(e) {
		e.preventDefault();
		var date = new Date();
	    date.setDate(date.getDate() - 1);
	    document.cookie = "curUser=;expires=" + date.toUTCString();
	    document.cookie = "isadmin=;expires=" + date.toUTCString();
		window.location = "./login.html";
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
	var del = "";
	if (user == userName) {
		del = "<a class='opState' onclick=\"delPost('" + user
												+ "', " + id + ");\">Delete</a>";
	}
	var innerht =
		"<div class='stateShow' id='" + "post" + user + id + "'>\
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
			<a class='opState' onclick='addComment();'>Reply</a>\
			<a class='opState' onclick=''>like(" + like.length + ")</a>\
			" + del + "\
		   </div>\
		  <div class='comments' id='" + "" + user + id + "'></div>\
		</div>";
		var divObj = document.getElementById("mainBannerContent");
		divObj.innerHTML = innerht + divObj.innerHTML;
		addComment(comments, id, user);
		changeDivHeight();
}


// function like() {
//
// }

function delPost(user, id) {
	var urlD = "/deletePost?userName=" + user + "&postId=" +  id;
	$.ajax({
		url: urlD,
		type: "DELETE",
		dataType: "JSON",
		success: function(response) {
			// $('#post' + user + id).remove();
			window.location.reload();
		},
		error: function(xhr){
			alert(xhr.responseText);
		}
	});
}

function addComment(comments, pId, user) {
	var parent = $("#" + user + pId);
	for (let item in comments) {
		let comment = comments[item];
		var text =
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
			   <div class='stateOp'>\
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
		dataType: "json",
		// contentType: "application/json; charset=utf-8",
		success: function(response) {
			// $("#" + user + pId + cId).remove();

			window.location.reload();
		},
		error: function(xhr){
			alert(xhr.responseText);
		}
	});
}

function getCookie() {
    var result = [undefined, undefined];
    var name = "curUser=";
    var check = "isadmin=";
    var ca = document.cookie.split(";");
    for (let i = 0; i < ca.length; i++) {
        let cur = ca[i];
        while (cur.charAt(0) == ' ') {
            cur = cur.substring(1);
        }
        if (cur.indexOf(name) == 0) {
            result[0] = cur.substring(name.length, cur.length);
        }
        if (cur.indexOf(check) == 0) {
            result[1] = cur.substring(check.length, cur.length);
        }
    }
    return result;
}

function quitBtn() {
    var date = new Date();
    date.setDate(date.getDate() - 1);
    document.cookie = "curUser=;expires=" + date.toUTCString();
    document.cookie = "isadmin=;expires=" + date.toUTCString();
}

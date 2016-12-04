


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

function createCookie(username, isadmin) {
    var date = new Date();
    date.setDate(date.getDate() + 5);
    document.cookie = 'curUser=' + username + ";expires=" + date.toUTCString()+";path=/";
    document.cookie = "isadmin=" + isadmin + ";expires=" + date.toUTCString()+";path=/";
    console.log(isadmin);
}

function quitBtn() {
    var date = new Date();
    date.setDate(date.getDate());
    document.cookie = "curUser=;expires=" + date.toUTCString();
    document.cookie = "isadmin=;expires=" + date.toUTCString();
}

function addPosts(posts, userName, isadmin) {
    for(let i=0;i< posts.length;i++) {
        addPost(posts[i], userName, isadmin);
    }
}

/* helper function to add post*/
function addPost(post, userName, isadmin) {
	user = post.userName;
	str = post.content;
	time = new Date(post.time);
	comments = post.comment;
	id = post.id;
	like = post.likes;
	var likeText = "";
	var del = "";
	if (user == userName || isadmin == "true") {
		del = "<a class='opState' onclick=\"delPost('" + user
						+ "', " + id + ", '" + userName + "');\">Delete</a>";
	}
    console.log(like);
	if (like.indexOf(userName) <= -1) {
		likeText = "onclick=\"likePost('" + user + "', " + id
                    + ", '" + userName + "');\">like(" + like.length + ")";
	} else {
		likeText = ">liked(" + like.length + ")";
	}
	var innerht =
		"<div class='stateShow' id='" + "post" + user + id + "'>\
		  <div class='stateShowWord'>\
			<table width='450' border='0' cellpadding='0' \
				cellspacing='0' class='stateTable'>\
				<tr>\
				  <td width='70' align='center' valign='top'>\
					<a href='./setting.html?profileUser=" + user + "'>\
					 <img src='images/icon.jpg' \
					  alt='' width='48' height='48' />\
					</a>\
				  </td>\
				  <td width='380'>\
					<a href='./setting.html?profileUser=" + user
                                                        + "'>" + user + "</a>\
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
		   <div class='stateOp'>\
			<!--<a class='opState' onclick='addComment();'>Reply</a>-->\
			<a class='opState' " + likeText + "</a>\
			" + del + "<br>\
			<div style='float:right;'>You can enter&nbsp;<font id='counter"
							+ user + id +"'>140</font>&nbsp;characters!  </div>\
  			<div id='mainBannerTopIssueForm'>\
  				  <div id='mainBannerTopIssueFrame'>\
  					<textarea name='reply' rows='1' class='Size' id='" + "reply"
						+ user + id + "'  style='overflow:hidden;border:1px \
						#0CF solid;' onkeyup='calNum(this,counter" + user + id
						+ ",0)'></textarea>\
  				  </div>\
  			  <div id='mainBannerTopIssueInsert'>\
  			  </div>\
  			  <div id='mainBannerTopIssueSure'>\
  				<div id='mainBannerTopIssueSure2'>\
  				  <input type='button' id='button" + user + id
				  			+ "' value='Reply' style='background-color:#3295E6;\
						      border:none' onclick=\"submitComment('" + user
							  + "', " + id + ", '" + userName + "')\" />\
  				</div>\
  			  </div>\
  			  </div>\
			  </div>\
		  <div class='comments' id='" + "" + user + id + "'></div>\
		</div>";
		var divObj = document.getElementById("mainBannerContent");
		divObj.innerHTML = innerht + divObj.innerHTML;
		addComment(comments, id, user, userName);
		changeDivHeight();
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

function submitComment(user, id, userName) {
	var textfield = document.getElementById("reply" + user + id);
	var text = textfield.value;
	if (text.length > 0) {
		$.ajax({
			url: "/comment",
			type: "POST",
	        dataType: "json",
	    	contentType:"application/json; charset=utf-8",
			data:JSON.stringify({
				"userName": user,
				"id": id,
				"comment":{
					"userName": userName,
					"content": text,
				}
			}),
			success: function(response) {
				var comment = [
					{
						"userName": userName,
						"content": text,
					}
				];
				addComment(comment, id, user, userName);
				window.location.reload();
			},
			error: function(xhr){
				alert(xhr.responseText);
			}
		});
	}
}

function likePost(user, id, userName) {
    console.log({
        "userName": user,
        "userNameLiked": userName,
        "id": id
    });
	$.ajax({
		url: "/like",
		type: "POST",
		dataType: "JSON",
        contentType:"application/json; charset=utf-8",
		data: JSON.stringify({
			"userName": user,
			"userNameLiked": userName,
			"id": id
		}),
		success: function(response) {
			window.location.reload();
		},
		error: function(xhr){
			alert(xhr.responseText);
		}
	});
}


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

function addComment(comments, pId, user, userName) {
	var parent = $("#" + user + pId);
	for (let item in comments) {
		let comment = comments[item];
		let delComment = "";
		if (isadmin == true || comment.userName == userName) {
			delComment = "<a class='opComment' onclick=\"delComment("
								+ comment.id + ", " + pId +  ", '" + user
								+ "', '" + userName + "');\">Delete</a>"
		}
		var text =
			"<div class='stateComments' id='" + "" + user + pId
															+ comment.id + "'>\
			  <table width='450' border='0' cellpadding='0' \
								cellspacing='0' class='commentTable'>\
				<tr>\
				  <td width='70' align='center' valign='top'>\
				  </td>\
				  <td width='380'>\
					<a href='./setting.html?profileUser=" + comment.userName
                                            + "'>" + comment.userName + "</a>\
					  <img src='images/1.gif' align='absmiddle' \
					  style='border:none;' />&nbsp;" + comment.content +
				 "</td>\
				</tr>\
			  </table>\
			  \
			   <div class='stateOp'>\
				" + delComment + "\
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

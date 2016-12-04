 var currentuserName=document.URL.split('?')[1].split("=")[1];//we are on this user's page


	var userName;
	var isadmin;
	var result;
	result = getCookie();
	userName = result[0];
	isadmin = result[1];
console.log(isadmin);
console.log(userName);
if (userName == undefined) {
    window.location = "./login.html";
}

$(document).ready(function() {
	var birthdayfield = $("#textfield3");
    var introductionfield = $("#textfield5");
    var malefiled = $("#malefiled");
    var passwordfield1 = $("#textfield2");
    var passwordfield2 = $("#textfield7");

	function loadmain() {
 		$.ajax({
            url:'/users?userName='+currentuserName,
	 	    type:"GET",
	  	    dataType:"JSON",
	    	success:function(response){
	    		loaduser(response);
		    }
       });
    }

    $("#quitBtn").click(function(e) {
		e.preventDefault();
		var date = new Date();
	    date.setDate(date.getDate() - 1);
	    document.cookie = "curUser=;expires=" + date.toUTCString();
		window.location = "./login.html";
	});

    $("#button").click(function(){
    	var user = {"userName":cur,
                    "birthday":birthdayfield.val(),
                    "introduction":introductionfield.val(),
                    "gender":($('input[type=radio]:checked').val())};
        console.log(passwordfield1.val());
        console.log(passwordfield2.val());
        if (passwordfield2.val()==passwordfield1.val() && passwordfield1.val()!=""){
            user["password"]=passwordfield1.val();
        }
        if (passwordfield2.val()!=passwordfield1.val()){
            alert("two password do not match!");
        }else{
    	$.ajax({
	        url:"/user",
	        type:"POST",
	        dataType:"json",
	    	contentType:"application/json; charset=utf-8",
	    	data:JSON.stringify(user),
	    	success:function(response){
	    		console.log(response);
				window.location.reload();
            }
	    });
        }
    });

    $("#searchUser").click(function(e){
    	e.preventDefault();
        var keyword= $("#textfield1").val();
 		$.ajax({
            url:'/users?searchName='+keyword,
	 	    type:"GET",
	  	    dataType:"JSON",
	    	success:function(response){
	    		console.log(response);
	    		var responseField = $("#ul2");
	    		responseField.empty();
	    		for (let i = 0;i<response.length;i++){
					responseField.append('<a href="#" class="a1"><li><font class="style2">'+response[i].userName+'</font></li></a>');
				}
		    }
       });

    });

    loadmain();

    function loaduser(user) {
    	var namefield=$("#nameField");
	   	namefield.html(user.userName);
	   	namefield = $("#textfield");
	   	namefield.val(userName);
	   	var postNumField = $("#postNumField");
	   	postNumField.html(user.posts.length);
	   	var followNumField = $("#followNumField");
	   	followNumField.html(user.follow.length);
		var followerNumField = $("#followerNumField");
		followerNumField.html(user.followers.length);
		var followingField = $("#ul2");
		$("#genderbodfield").html("&nbsp;"+user.gender+"&nbsp;"+user.birthday.substring(0,10));
		for (let i = 0;i<user.follow.length;i++){
			followingField.append('<a href="#" class="a1"><li><font class="style2">'+user.follow[i]+'</font></li></a>');
		}
		birthdayfield.val(user.birthday.substring(0,10));
        if (user.gender == 'male'){
        	malefiled.prop("checked", true);
        }
		if (user.gender=='female'){
		    $("#femalefield").prop("checked", true);
		}
		introductionfield.val(user.introduction);

			var posts = user.posts.sort( function(a, b) {
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
				addPost(posts[i].userName,
						posts[i].content,
						new Date(posts[i].time),
						posts[i].comment);
			}
    }

})

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

function addPost(userName, str, time, comments) {
	var text;
	if (comments == []) {
		text = "";
	} else {
		for (let item in comments) {
			console.log(comments[item]);

		}
	}
	var innerht =
		"<div class='stateShow' >\
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
		  <div class='comments'></div>\
		</div>";
		var divObj = document.getElementById("mainBannerContent");
		divObj.innerHTML = innerht + divObj.innerHTML;
		changeDivHeight();
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
    window.reload();
}

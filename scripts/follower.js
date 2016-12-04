var currentuserName=document.URL.split('?')[1].split("=")[1];//we are on this user's page

var userName;
var isadmin;


var result;
result = getCookie();
userName = result[0];
isadmin = (result[1]=="true");

if (userName == undefined) {
    window.location = "./login.html";
}

$(document).ready(function() {
<<<<<<< HEAD
    /* generate followed users' list on page*/
=======
    // function to generate users who current user follows
    // username, date of birth,number of posts
>>>>>>> 25443f65faaefa36876f0f4eef4ce4a8804037fa
    function generateFollow(userName) {
        $.ajax({
            url: "/users?userName=" + userName,
            type: "GET",
            dataType: "JSON",
            success: function(user) {
                load(user);
                var fList = user.followers;
                console.log(user);
                for (let item in fList) {
                    addUserProf(fList[item]);
                }
            }
        });
    }
    
    // load information of current requested user
    // username, date of birth,number of posts
    function load(user){
        // if current login user is admin
        // profile button should not be shown
        // and home back to Admin.html
        if (isadmin){
            $("#profile").css('display', 'none');
            $("#home").attr("href", "./Admin.html");
        }
        $("#genderbodfield").html("&nbsp;"+user.gender+"&nbsp;"+user.birthday.substring(0,10));
        $("#namefield").html(currentuserName);
        // $("#namefield").attr("href", "./setting.html?=userName="+currentuserName);
        $("#postnum").html(user.posts.length);
        $("#follownum").html(user.follow.length);
        $("#followernum").html(user.followers.length);
        $("#profile").attr("href", "./setting.html?userName="+userName);
        $("#getfollow").attr("href", "./follow.html?userName="+currentuserName);
        $("#getfollower").attr("href", "./follower.html?userName="+currentuserName);
    }
    // logout
    $("#quitBtn").click(function(e) {
		e.preventDefault();
		var date = new Date();
	    date.setDate(date.getDate() - 1);
        //set expire date
        document.cookie = "curUser=;expires=" + date.toUTCString();
        document.cookie = "isadmin=;expires=" + date.toUTCString();
        // to login.html
		window.location = "./login.html";
	});

    // generate users currentuser follows
    generateFollow(currentuserName);

    // add information of user that current user follow
    function addUserProf(user) {
        $("#tb1").append(
            '<tr>\
              <td height="105" align="center" valign="middle" class="td2">\
                <img src="images/icon.jpg" width="48" height="48" alt="" />\
              </td>\
              <td height="105" align="left" valign="bottom" class="td3">\
                <font color="#005dc3" size="3">\
                  <a href="./setting.html?userName='+user+'">'  + user + '</a>\
                </font>\
                <img src="images/1.gif" width="17" height="15" alt="" />\
                <br />\
                <br />\
               </td>\
            </tr>');

    }


});


// unfollow one user
function unfollow(user) {
    $.ajax({
        url: '/follow',
        type: "POST",
        dataType: "JSON",
        contentType: "application/json; charset=utf-8",
        data: JSON.stringify({ 'followTo': user, 'followFrom': userName }),
        success: function(response) {
            window.location.reload();
        }
    });
}

<<<<<<< HEAD
//gets user information
=======
// get cookie
>>>>>>> 25443f65faaefa36876f0f4eef4ce4a8804037fa
function getCookie() {
    var result = [undefined, undefined];
    var name = "curUser=";
    var check = "isadmin=";
    //split message by ;
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

<<<<<<< HEAD
// calls when quit button is called
=======
//logout
>>>>>>> 25443f65faaefa36876f0f4eef4ce4a8804037fa
function quitBtn() {
    var date = new Date();
    date.setDate(date.getDate() - 1);
    document.cookie = "curUser=;expires=" + date.toUTCString();
    window.reload();
}

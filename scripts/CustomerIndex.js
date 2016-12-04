// JavaScript Document
var hfObj;
var srcUser;
var userName;
var isadmin;
var result;

result = getCookie();
userName = result[0];
isadmin = result[1];


// Calls when the page is ready.
$(document).ready(function() {
    console.log(document.cookie);
    // no user information has been set
    if (userName == undefined) {
        alert("You have not logged in or you are currently using firefox!\
		 										Use Chrome to log in first!");
		$.getScript("./scripts/main.js", function() {
			quitBtn();
		});
        window.location = "./login.html";
    }

    // current user is an admin
    if (isadmin == "true") {
        window.location = "./Admin.html";
    }
    // when user clicks profile tag
    $("#profile").click(function(e) {
        e.preventDefault();
        window.location = "./setting.html?profileUser=" + userName;

    });

    // when user clicks quit tag
    $("#quitBtn").click(function(e) {
        e.preventDefault();
        var date = new Date();
        date.setDate(date.getDate() - 1);
        document.cookie = "curUser=;expires=" + date.toUTCString();
        document.cookie = "isadmin=;expires=" + date.toUTCString();
        window.location = "./login.html";
    });

    // when user clicks search tag
    $("#searchUser").click(function(e) {
        e.preventDefault();
        var keyword = $("#textfield1").val();
        $.ajax({
            url: '/users?searchName=' + keyword,
            type: "GET",
            dataType: "JSON",
            success: function(response) {
                var responseField = $("#ul2");
                responseField.empty();
                $("#people").empty();
                for (let i = 0; i < response.length; i++) {
                    responseField.append('<li><a href="./setting.html?userName='
						+ response[i].userName + '" class="a1">\
                   			<font class="style2" >'
							+ response[i].userName + '</font></a></li>');
                }
            },
            error: function(xhr) {
                alert(xhr.responseText);
            }
        });

    });
    changeDivHeight();
    loadmain();
});




// function that loads the user
function loaduser(user) {
    // sets the link
    $("#nameField").attr("href", "./setting.html?userName=" + userName);
    $("#genderbodfield").html("&nbsp;" + user.gender + "&nbsp;"
											+ user.birthday.substring(0, 10));
    $("#getfollow").attr("href", "./follow.html?userName=" + userName);
    $("#getfollower").attr("href", "./follower.html?userName=" + userName);
    var namefield = $("#nameField");
    namefield.html(user.userName);

    // sets values of each field appearing on top right
    var postNumField = $("#postNumField");
    postNumField.html(user.posts.length);
    var followNumField = $("#followNumField");
    followNumField.html(user.follow.length);
    var followerNumField = $("#followerNumField");
    followerNumField.html(user.followers.length);
    var followingField = $("#ul2");
    for (let i = 0; i < user.follow.length; i++) {
        followingField.append('<a href="./setting.html?profileUser='
					+ user.follow[i] + '" class="a1"><li><font class="style2">'
					+ user.follow[i] + '</font></li></a>');
    }
    // sort posts by post time
    var posts = user.postsOnPage.sort(function(a, b) {
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

    $.getScript("./scripts/main.js", function() {
        addPosts(posts, userName, isadmin);
    });


}


/* When this page is loaded, get the user information first. */
function loadmain() {
    $.ajax({
        url: '/users?userName=' + userName + '&mainPage=' + true,
        type: "GET",
        dataType: "JSON",
        success: function(response) {
            loaduser(response);
        },
		error: function(xhr) {
			alert(xhr.responseText);
		}
    });
}

/* Setting left and right part of the page's height to auto */
function initDivHeight(divObj1, divObj2) {
    divObj1.style.height = "auto";
    divObj2.style.height = "auto";
}

/* function that can change the Div Height */
function changeDivHeight() {
    var mainBanner = document.getElementById("mainBanner");
    var mainRight = document.getElementById("mainRight");
    initDivHeight(mainBanner, mainRight); //set height as auto
    var height = mainBanner.offsetHeight > mainRight.offsetHeight
			? mainBanner.offsetHeight : mainRight.offsetHeight; //get height val
    mainBanner.style.height = height + "px";
    mainRight.style.height = height + "px";
}

// gets the cal number
function calNum(txtobj, divobj, fg) {
    $.getScript("./scripts/main.js", function() {
        calNum(txtobj, divobj, fg);
    });
}


// calls when user wants to make a post
function submitState() {
    var textfield = document.getElementById("textfield2");
    var text = textfield.value;
    var time = new Date();
    if (text.length > 0) {
        $.ajax({
            url: "/post",
            type: "POST",
            dataType: "json",
            contentType: "application/json; charset=utf-8",
            data: JSON.stringify({
                "userName": userName,
                "post": {
                    "userName": userName,
                    "content": text,
                    "time": time.toISOString()
                }
            }),
            success: function(response) {
                window.location.reload();
            },
            error: function(xhr) {
                alert(xhr.responseText);
            }
        });
    }
}





// gets cookie(current user information)
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


// calls when quit button is clicked
function quitBtn() {
    var date = new Date();
    date.setDate(date.getDate() - 1);
    document.cookie = "curUser=;expires=" + date.toUTCString();
    document.cookie = "isadmin=;expires=" + date.toUTCString();
}

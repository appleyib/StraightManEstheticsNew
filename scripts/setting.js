
var curUser = document.URL.split('?')[1].split("=")[1];

//get current login user's name
// whether it is admin
var userName;
var isadmin;
var result;
result = getCookie();
userName = result[0];
isadmin = (result[1] == "true");
// if current user is not log in
// back to login page
if (userName == undefined) {
    window.location = "./login.html";
}

$(document).ready(function() {
    var namefield = $("textfield");
    var birthdayfield = $("#textfield3");
    var introductionfield = $("#textfield5");
    var malefiled = $("#malefiled");
    var passwordfield1 = $("#textfield2");
    var passwordfield2 = $("#textfield7");
    // load information of requested user
    function loadmain() {
        $.ajax({
            url: '/users?userName=' + curUser,
            type: "GET",
            dataType: "JSON",
            success: function(response){
                loaduser(response);
            }
       });
    }
    // logout
    $("#quitBtn").click(function(e) {
        e.preventDefault();
        var date = new Date();
        date.setDate(date.getDate() - 1);
        document.cookie = "curUser=;expires=" + date.toUTCString();
        document.cookie = "isadmin=;expires=" + date.toUTCString();
        window.location = "./login.html";
    });
    // when user click save button
    $("#button").click(function(){
        //get all new information
        var user = {
            "userName": curUser,
            "birthday": birthdayfield.val(),
            "introduction": introductionfield.val(),
            "gender": ($('input[type=radio]:checked').val())
        };
        // if two password match
        if (passwordfield2.val() == passwordfield1.val()
                                                && passwordfield1.val() != ""){
            user["password"] = passwordfield1.val();
        }
        if (passwordfield2.val() != passwordfield1.val()){
            alert("two password do not match!");
        }else{
            //update
            $.ajax(
                {
                    url: "/user",
                    type: "POST",
                    dataType: "JSON",
                    contentType: "application/json; charset=utf-8",
                    data: JSON.stringify(user),
                    success: function(response){
                        console.log(response);
                        window.location.reload();
                    }
                }
            );
        }
    });
    // users are able to search user by keyword
    $("#searchUser").click(function(e){
        e.preventDefault();
        var keyword= $("#textfield1").val();
        //send ajax
        $.ajax({
            url:'/users?searchName='+keyword,
            type:"GET",
            dataType:"JSON",
            success:function(response){
                var responseField = $("#ul2");
                responseField.empty();
                $("#people").empty();
                for (let i = 0;i<response.length;i++){
                    responseField.append('<li><a href="./setting.html?userName='+
                        response[i].userName+'" class="a1">\
                        <font class="style2" >'+response[i].userName+'</font></a></li>');
                }
            }
       });

    });
    // call function to load requested user's information
    loadmain();
    // current login can follow/unfollow current requested user
    $("#followUserBtn").click(function() {
        $.ajax({
            url: '/follow',
            type: "POST",
            dataType: "JSON",
            contentType: "application/json; charset=utf-8",
            data: JSON.stringify({ 'followTo': curUser, 'followFrom': userName }),
            success: function(response) {
                window.location.reload();
            }
        });
    })
    // helper function to load page by infomation of user
    function loaduser(user) {
        // only admin or user self can change profile
        if (isadmin || curUser==userName){
            $("#profile").attr("href", "./setting.html?userName="+userName);
            $("#getfollow").attr("href", "./follow.html?userName="+curUser);
            $("#getfollower").attr("href", "./follower.html?userName="+curUser);
            $("#followUserBtn").css('display', 'none');
        }
        // other users only see some readonly profile
        else{
            $("#profile").attr("href", "./setting.html?userName="+userName);
            $("#getfollow").attr("href", "./follow.html?userName="+curUser);
            $("#getfollower").attr("href", "./follower.html?userName="+curUser);
            $("#button").css('display', 'none');
            $("#nprow").css('display', 'none');
            $("#rprow").css('display', 'none');
            $(':radio:not(:checked)').attr('disabled',true);
            birthdayfield.prop("readonly",true);
            introductionfield.prop("readonly",true);
            passwordfield1.css('display', 'none');
            passwordfield2.css('display', 'none');
            if (user.followers.indexOf(userName)!=-1){
                $("#followUserBtn").html("unfollow");
                $("#followUserBtn").css("background", "grey");
            }else{
                $("#followUserBtn").html("follow");
                $("#followUserBtn").css("background", "#3cb0fd");}
        }
        // if current login user is admin
        if (isadmin == true){
            // he will back to Admin.html when click  home
            $("#home").attr("href", "./Admin.html");
            // cannot search
            $("#mainRightPostionFouthLine").css('display', 'none');
            // hide profile
            $("#profile").css('display', 'none');
        }
        //load info like name, dob, numof posts/follow/folloers
        var namefield=$("#nameField");
        namefield.html(user.userName);
        namefield = $("#textfield");
        namefield.html(user.userName);
        var postNumField = $("#postNumField");
        postNumField.html(user.posts.length);
        var followNumField = $("#followNumField");
        followNumField.html(user.follow.length);
        var followerNumField = $("#followerNumField");
        followerNumField.html(user.followers.length);
        var followingField = $("#ul2");
        $("#genderbodfield").html("&nbsp;"+user.gender+"&nbsp;"+user.birthday.substring(0,10));
        for (let i = 0;i<user.follow.length;i++){
            followingField.append('<a class="a1" href="./setting.html?userName='+user.follow[i]+
                     '"><li><font class="style2">'+user.follow[i]+'</font></li></a>');
        }
        birthdayfield.val(user.birthday.substring(0,10));
        if (user.gender == 'male'){
            $("#malefiled").prop("checked", true);
        }
        if (user.gender=='female'){
            $("#femalefield").prop("checked", true);
        }
        introductionfield.val(user.introduction);

          // sort posts of requested user
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
            $.getScript("./scripts/main.js", function() {
                addPosts(posts, userName, isadmin);
            });
    }

});

    function initDivHeight(divObj1,divObj2) {
        divObj1.style.height = "auto";
        divObj2.style.height = "auto";
    }

    function changeDivHeight() {
        var mainBanner = document.getElementById("mainBanner");
        var mainRight = document.getElementById("mainRight");
        initDivHeight(mainBanner,mainRight);
        var height = mainBanner.offsetHeight > mainRight.offsetHeight ? mainBanner.offsetHeight : mainRight.offsetHeight;
        mainBanner.style.height = height + "px";
        mainRight.style.height = height+ "px";//
    }

    // delete user's posts
    function delPost(user, id) {
        $.getScript("./scripts/main.js", function() {
            delPost(user, id);
        });
    }

    // delete current login user's comment
    function delComment(cId, pId, user) {
        $.getScript("./scripts/main.js", function() {
            delComment(comments, pId, user);
        });
    }

// get cookie
function getCookie() {
    var result = [undefined, undefined];
    var name = "curUser=";
    var check = "isadmin=";
    // split by ;
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

//logout
function quitBtn() {
    var date = new Date();
    date.setDate(date.getDate() - 1);
    document.cookie = "curUser=;expires=" + date.toUTCString();
    window.reload();
}

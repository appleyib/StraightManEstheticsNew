
var curUser = document.URL.split('?')[1].split("=")[1];


var userName;
var isadmin;
var result;
result = getCookie();
userName = result[0];
isadmin = (result[1] == "true");
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

    // $("#home").click(function(){
    //  if (isadmin){
    //      window.location = "./Admin.html";
    //  }else {
    //      window.location = "./CustomerIndex.html";
    //  }
    // })
    $("#quitBtn").click(function(e) {
        e.preventDefault();
        var date = new Date();
        date.setDate(date.getDate() - 1);
        document.cookie = "curUser=;expires=" + date.toUTCString();
        document.cookie = "isadmin=;expires=" + date.toUTCString();
        window.location = "./login.html";
    });

    $("#button").click(function(){
        var user = {
            "userName": curUser,
            "birthday": birthdayfield.val(),
            "introduction": introductionfield.val(),
            "gender": ($('input[type=radio]:checked').val())
        };
        console.log(passwordfield1.val());
        console.log(passwordfield2.val());
        if (passwordfield2.val() == passwordfield1.val()
                                                && passwordfield1.val() != ""){
            user["password"] = passwordfield1.val();
        }
        if (passwordfield2.val() != passwordfield1.val()){
            alert("two password do not match!");
        }else{
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

    $("#searchUser").click(function(e){
        e.preventDefault();
        var keyword= $("#textfield1").val();
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

    loadmain();

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

    function loaduser(user) {
        if (isadmin || curUser==userName){
            $("#profile").attr("href", "./setting.html?userName="+userName);
            $("#getfollow").attr("href", "./follow.html?userName="+curUser);
            $("#getfollower").attr("href", "./follower.html?userName="+curUser);

            $("#followUserBtn").css('display', 'none');
        }
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
        if (isadmin == true){
            $("#home").attr("href", "./Admin.html");
            $("#mainRightPostionFouthLine").css('display', 'none');
            $("#profile").css('display', 'none');
        }
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
            followingField.append('<p class="a1" href="./setting.html?userName='+user.follow[i]+
                     '"><li><font class="style2">'+user.follow[i]+'</font></li></p>');
        }
        birthdayfield.val(user.birthday.substring(0,10));
        if (user.gender == 'male'){
            $("#malefiled").prop("checked", true);
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
                $.getScript("./scripts/main.js", function() {
                    addPost(posts[i], userName, isadmin);
                });
            }
    }

});

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

    // function submitComment(user, id) {
    //  $.getScript("./scripts/main.js", function() {
    //      submitComment(user, id, userName);
    //  });
    // }



    // function likePost(user, id) {
    //  $.getScript("./scripts/main.js", function() {
    //      likePost(user, id, userName);
    //  });
    // }

    function delPost(user, id) {
        $.getScript("./scripts/main.js", function() {
            delPost(user, id);
        });
    }

    // function addComment(comments, pId, user) {
    //  $.getScript("./scripts/main.js", function() {
    //      addComment(comments, pId, user, userName);
    //  });
    // }




    function delComment(cId, pId, user) {
        $.getScript("./scripts/main.js", function() {
            delComment(comments, pId, user);
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
    window.reload();
}

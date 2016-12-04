


function getCookie(userName, isadmin) {
    var name = "curUser=";
    var check = "isadmin=";
    var ca = document.cookie.split(";");
    for (let i = 0; i < ca.length; i++) {
        let cur = ca[i];
        while (cur.charAt(0) == ' ') {
            cur = cur.substring(1);
        }
        if (cur.indexOf(name) == 0) {
            userName = cur.substring(name.length, cur.length);
        }
        if (cur.indexOf(check) == 0) {
            isadmin = cur.substring(check.length, cur.length);
        }
    }
}

// function getIsAdmin(){
//     var isadmin = "isadmin=";
//     var ca = document.cookie.split(";");
//      for (let i = 0; i < ca.length; i++) {
//         let cur = ca[i];
//         while (cur.charAt(0) == ' ') {
//             cur = cur.substring(1);
//         }
//         if (cur.indexOf(name) == 0) {
//             console.log(cur.substring(name.length, cur.length));
//             return cur.substring(name.length, cur.length);
//         }
//         return undefined;
//     }   
// }

// function createIsAdminCookie(isadmin){
//     var date = new Date();
//     date.setDate(date.getDate() + 5);
//     document.cookie = "isadmin=" + isadmin + ";expires=" + date.toUTCString();
// }

function createCookie(username, isadmin) {
    var date = new Date();
    date.setDate(date.getDate() + 5);
    document.cookie = "curUser=" + username + ";isadmin=" + isadmin + ";expires=" + date.toUTCString();
    
}

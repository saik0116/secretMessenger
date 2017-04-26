document.getElementById("register").addEventListener("touchend", registerVal);
document.getElementById("login").addEventListener("touchend", loginval);

const NOERROR = 0;

function registerVal() {
    var url = "https://griffis.edumedia.ca/mad9022/steg/register.php";
    var fd = new FormData();
    //    fd.append('user_name', 'ferd1');
    //    fd.append('email', 'ferd1@hot.com');
    var user = document.getElementById("user_name").value;
    var emailz = document.getElementById("email").value;
    if ((user.length == 0 || emailz.length == 0)) {
        alert("Please, enter name and email");
        return;
    }
    fd.append("user_name", user);
    fd.append("email", emailz);
    console.log(user_name);
    var req = new Request(url, {
        method: 'POST'
        , mode: 'cors'
        , body: fd
    });
    fetch(req).then(function (response) {
        return response.json();
    }).then(function (data) {
        console.log(data); })}


function loginval() {
    var url = "https://griffis.edumedia.ca/mad9022/steg/login.php";
    var fd = new FormData();
    //    fd.append('user_name', 'ferd1');
    //    fd.append('email', 'ferd1@hot.com');
    var user = document.getElementById("user_name").value;
    var emailz = document.getElementById("email").value;
    if ((user.length == 0 || emailz.length == 0)) {
        alert("Please, enter name and email");
        return;
    }
    fd.append("user_name", user);
    fd.append("email", emailz);
    console.log(user_name);
    var req = new Request(url, {
        method: 'POST'
        , mode: 'cors'
        , body: fd
    });
    fetch(req).then(function (response) {
        return response.json();
    }).then(function (data) {
        console.log(data);
        if (data.code == NOERROR) {
            userGuid = data.user_guid;
            userID = data.user_id;
            // show messagelist modal
            let mlistmodal = document.getElementById("myModalMessageLists");
            if (mlistmodal !== null) {
                mlistmodal.classList.add("active");
                getMessageList();
            }
        }
        
        else {
            //pop up error meesage to re
            alert(data.message);
        }
        
    })
}



function getMessageList() {
    var url = "https://griffis.edumedia.ca/mad9022/steg/msg-list.php";
    let fd = new FormData();
    fd.append("user_id", userID);
    fd.append("user_guid", userGuid);
    console.log(user_name);
    
    
    var req = new Request(url, {
        method: 'POST'
        , mode: 'cors'
        , body: fd
    });
    fetch(req).then(function (response) {
            return response.json();
        }).then(function (data) {
        
        let ul = document.createElement("ul");
        ul.classList.add("table-view");
        
        var messages = data.messages;
        var test; 
        for (var i = 0, test = messages.length; i < test; i++) {
            let li = document.createElement("li");
            li.classList.add("table-view-cell");
            
            let aname= document.createElement("a");
            aname.classList.add("navigate-right");
            
           let msgid = document.createAttribute("id", "msg_id");
            //msgid.value = messages[i].msg_id;
            //aname.classList.add("pull-right");
            aname.setAttribute("msg_id",messages[i].msg_id);
            aname.textContent= "Message From: "+messages[i].user_name;
            //p.appendChild(aname);
            li.appendChild(aname);
            ul.appendChild(li);
        
            
            
            
            aname.addEventListener("touchstart", (function(name){
                
                return function(){
                
                    console.log("In ther name is" + name);
                    let theName = document.getElementById("theName");
                    theName.textContent = name;
//                gmsgid= data[i].msg_id;
                let viewmessagemodal = document.getElementById("myModalViewMessage");
                
                
                if(viewmessagemodal !==null){
                    viewmessagemodal.classList.add("active");
                }}
                
            })(messages[i].user_name) )
            
           
        
        // Create HTML for Message List
        // a.addEventListener('touchstat',fucntion(){
         
        // let messagemodal  = document.getElementById("myModalViewMessage");
        // messagemodl.classList.add("active");
        // Add something img message, 
        
        //request getmessage to server
        //
    //})
        }
        document.getElementById("mylist").appendChild(ul);
        
        

    } )}


function sendMsg() {
    var url = "https://griffis.edumedia.ca/mad9022/steg/msg-send.php";
    var fd = new FormData();
    //    fd.append('user_name', 'ferd1');
    //    fd.append('email', 'ferd1@hot.com');
    fd.append("user_id", userID);
    fd.append("user_guid", userGuid);
    fd.append("recipient_id", userID);
    fd.append("image", imagelol);
    
    var emailz = document.getElementById("email").value;
    if ((user.length == 0 || emailz.length == 0)) {
        alert("Please, enter name and email");
        return;
    }
    fd.append("user_name", user);
    fd.append("email", emailz);
    console.log(user_name);
    var req = new Request(url, {
        method: 'POST'
        , mode: 'cors'
        , body: fd
    });
    fetch(req).then(function (response) {
        return response.json();
    }).then(function (data) {
        console.log(data);
        if (data.code == NOERROR) {
            userGuid = data.user_guid;
            userID = data.user_id;
            // show messagelist modal
            let mlistmodal = document.getElementById("myModalMessageLists");
            if (mlistmodal !== null) {
                mlistmodal.classList.add("active");
                getMessageList();
            }
        }
        
        else {
            //pop up error meesage to re
            alert(data.message);
        }
        console.dir(data.user_id);
        
        
    })

          

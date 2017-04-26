"use strict";
//if (document.deviceready) {
    document.addEventListener('deviceready', OnDeviceReady);
//}
//else {
//    document.addEventListener('DOMContentLoaded', OnDeviceReady)
//}

function OnDeviceReady() {
    let log12 = document.getElementById("login");
    log12.addEventListener("click", loginval);
    let regi = document.getElementById("register");
    regi.addEventListener("click", registerVal);
    document.getElementById("take-pic").addEventListener("touchend", capture);
    document.getElementById("sndBtn").addEventListener("touchend", sendMessages);
    document.getElementById("deletef").addEventListener("touchend", deleteFunc);
    
    if (StatusBar.isVisible) {
        StatusBar.hide( );
    }else{
        StatusBar.show( );
    }
    
    
}

const NOERROR = 0;
let sURL = "";
let userID = "";
let userGuid = "";
var imageTaken = "";
var UserListArray = [];
let recipientID = "";
let encoderVar = new MessageManipulator();
let messageID = "";
let gfinename="";


function MessageManipulator() {
    this.encode = function (userID, message, canvas) {
        try {
            let nba4id = BITS.numberToBitArray(userID)
            BITS.setUserId(nba4id, canvas);
            let n2bal = BITS.numberToBitArray(message.length * 16);
            BITS.setMsgLength(n2bal, canvas);
            let ba2 = BITS.stringToBitArray(message);
            
            BITS.setMessage(ba2, canvas);
            
            //let base64 = canvas.toDataURL();
            //            let blod = dataURLToBlob(base64);
            //            return blod;
            let b;
            canvas.toBlob(function (blob) {
                b = blob
            }, 'image/png');
            return b;
        }
        catch (e) {
            console.log("ERROR");
        }
    }
}

function registerVal() {
    var url = "https://griffis.edumedia.ca/mad9022/steg/register.php";
    var fd = new FormData();
    var user = document.getElementById("user_name").value;
    var emailz = document.getElementById("email").value;
    if ((user.length == 0 || emailz.length == 0)) {
        alert("Must enter all fields");
        return;
    }
    else {
        alert("Register Complete, now please log in.");
    }
    fd.append("user_name", user);
    fd.append("email", emailz);
    var req = new Request(url, {
        method: 'POST'
        , mode: 'cors'
        , body: fd
    });
    fetch(req).then(function (response) {
        return response.json();
    }).then(function (data) {
        console.log(fd);
        console.log(data);
    })
    console.dir(req);
    console.log(fd);
    alert("It worked");
}

function loginval() {
    var url = "https://griffis.edumedia.ca/mad9022/steg/login.php";
    var fd = new FormData();
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
            getMessageList();
            userList();
            //encodingFunc();
            // show messagelist modal
            let mlistmodal = document.getElementById("myModalMessageLists");
            if (mlistmodal !== null) {
                mlistmodal.classList.add("active");
            }
        }
        else {
            //pop up error meesage to re
            alert(data.message);
        }
        console.dir(data.user_id);
    })
}

function getMessageList() {
    var url = "https://griffis.edumedia.ca/mad9022/steg/msg-list.php";
    let fd = new FormData();
    fd.append("user_id", userID);
    fd.append("user_guid", userGuid);
    var req = new Request(url, {
        method: 'POST'
        , mode: 'cors'
        , body: fd
    });
    fetch(req).then(function (response) {
        return response.json();
    }).then(function (data) {
        // Create HTML for Message List
        let ul = document.createElement("ul");
        ul.classList.add("table-view");
        var messages = data.messages;
        var test;
        for (var i = 0, test = messages.length; i < test; i++) {
            let li = document.createElement("li");
            li.classList.add("table-view-cell");
            let aname = document.createElement("a");
            aname.classList.add("navigate-right");
            let msgid = document.createAttribute("id", "msg_id");
            //msgid.value = messages[i].msg_id;
            //aname.classList.add("pull-right");
            aname.setAttribute("data-msg_id", messages[i].msg_id);
            aname.setAttribute("data-name", messages[i].user_name);
            aname.textContent = "Message From: " + messages[i].user_name;
            //// Lets see
            //messageID = messages[i].msg_id;
            //p.appendChild(aname);
            li.appendChild(aname);
            ul.appendChild(li);
            aname.addEventListener("touchend", function (ev) {
                    ev.preventDefault();
                    messageID = ev.currentTarget.getAttribute("data-msg_id");
                    let name = ev.currentTarget.getAttribute('data-name');
                    console.log("In ther name is" + name);
                    let theName = document.getElementById("theName");
                    theName.textContent = "Sent From: " + name;
                    encodingFunc();
                    
                
                    let viewmessagemodal = document.getElementById("myModalViewMessage");
                    if (viewmessagemodal !== null) {
                        viewmessagemodal.classList.add("active");
                    }
            })
        }
        
      let mylist =  document.getElementById("mylist")
    mylist.innerHTML = "";
        mylist.appendChild(ul);
        
    })
    
}

function userList() {
    var url = "https://griffis.edumedia.ca/mad9022/steg/user-list.php";
    var fd = new FormData();
    //    fd.append('user_name', 'ferd1');
    //    fd.append('email', 'ferd1@hot.com');
    fd.append("user_id", userID);
    fd.append("user_guid", userGuid);
    var req = new Request(url, {
        method: 'POST'
        , mode: 'cors'
        , body: fd
    });
    fetch(req).then(function (response) {
        return response.json();
    }).then(function (data) {
        UserListArray = data.users;
        let selectList = document.getElementById("listofname");
        for (let user of UserListArray) {
            let option = document.createElement("option");
            option.text = user.user_name;
            option.value = user.user_id;
            selectList.add(option);
        }
        console.log(UserListArray + "OKOK");
    })
}

function capture() {
    var options = {
        quality: 60
        , destinationType: Camera.DestinationType.FILE_URI
        , encodingType: Camera.EncodingType.PNG
        , mediaType: Camera.MediaType.PICTURE
        , pictureSourceType: Camera.PictureSourceType.CAMERA
        , allowEdit: true
        , targetWidth: 300
        , targetHeight: 300
    };
    //navigator.camera.getPicture(app.successCallback, app.errorCallback, options);
    // navigator.camera.getPicture( successCallback, errorCallback, options );
    navigator.camera.getPicture(onSuccess, onFail, options);
}

function onSuccess(fileURI) {  
    imageTaken = fileURI;
    let canvas = document.getElementById("myCanvas");
    
    
    let ctx = canvas.getContext('2d');
    canvas.width = 300;
    canvas.height = 300;
    canvas.style.width = 300;
    canvas.style.height = 300;
    var img1 = document.createElement('img');
    img1.style.width = "100%";
    img1.style.height = "100%";
    img1.addEventListener('load', function () {
        ctx.drawImage(img1, 0, 0); //Step3
        
    }) 
    
    img1.src = fileURI; //Step 2
    let parse =  fileURI.split("/");
    gfinename = parse[parse.length];
    
    console.log(gfinename);
}

function onFail(message) {
    alert('Failed because: ' + message);
}
// on Sending message page
// after taking a picture and text something in inbox also has to have receipID/
// tapping send button Evnet Listener in function call this function

function sendMessages() {
    recipientID = document.querySelector("select").value;
    //    if(recipientID <= 0){
    //        recipientID = 1;
    //    }
    var url = "https://griffis.edumedia.ca/mad9022/steg/msg-send.php";
    let canvas = document.getElementById("myCanvas");
    let select = document.querySelector("select").value;
    let message = document.getElementById("textarea").value;
    console.log(message);
    if (null === message) {
        throw new Error("Please,enter your message");
    }
    
    let blod = encoderVar.encode(recipientID, message, canvas);
//imageTaken = blod;

    //console.log(b);
    var fd = new FormData();
    fd.append("user_id", userID);
    fd.append("user_guid", userGuid);
    fd.append("recipient_id", recipientID);
    fd.append("image", blod, "sample.png");
    var req = new Request(url, {
        method: 'POST'
        , mode: 'cors'
        , body: fd
    });
    fetch(req).then(function (response) {
        return response.json();
    }).then(function (data) {
        console.log(data.code);
        
    })

}

       

function encodingFunc() {
    // step 4 and 5
    //canvas.toDataURL( );
    
    var url = "https://griffis.edumedia.ca/mad9022/steg/msg-get.php"
    
    
    var fd = new FormData();
    fd.append("user_id", userID);
    fd.append("user_guid", userGuid);
    fd.append("message_id", messageID);
    var req = new Request(url, {
        method: 'POST'
        , mode: 'cors'
        , body: fd
    });
    fetch(req).then(function (response) {
        return response.json();
    }).then(function (data) {
           console.log(data);
        let canvas = document.getElementById("reciever");
        let ctx = canvas.getContext('2d');
        canvas.width = 300;
        canvas.height = 300;
        canvas.style.width = 300;
        canvas.style.height = 300;
        var img1 = document.createElement('img');
        img1.style.width = "100%";
        img1.style.height = "100%";



        img1.addEventListener('load', function () {
            ctx.drawImage(img1, 0, 0); //Step3
            
            let rec_message = BITS.getMessage(userID, canvas);
            
            document.getElementById("theMessage").innerHTML = rec_message;
        });

        img1.src = "https://griffis.edumedia.ca/mad9022/steg/" + data.image;
        console.log(data.image);
    })
}


function deleteFunc(ev) {
    // step 4 and 5
    //canvas.toDataURL( );
    ev.preventDefault();
    
    var url = "https://griffis.edumedia.ca/mad9022/steg/msg-delete.php"
    var fd = new FormData();
    fd.append("user_id", userID);
    fd.append("user_guid", userGuid);
    fd.append("message_id", messageID);
    var req = new Request(url, {
        method: 'POST'
        , mode: 'cors'
        , body: fd
    });
    fetch(req).then(function (response) {
        return response.json();
    }).then(function (data) {
        console.log(data);
//        let delt = document.getElementById("deletef");
//                delt.addEventListener("touchend", function(ev){
//                    ev.preventDefault();
                        getMessageList();
//                });
        let test12 = document.getElementById("myModalMessageLists");
         document.getElementById("myModalViewMessage").classList.remove("active");
        if (test12 !== null) {
                        test12.classList.add("active");
        
        
                    } 
    }
)}



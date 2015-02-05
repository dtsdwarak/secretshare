var db;
var email;
var ots;

//Fetch Values
function fetchValues(){
    var transaction = db.transaction(["ots"]);
    var store = transaction.objectStore("ots");

    store.openCursor().onsuccess = function(e){
        var cursor = e.target.result;
        var value = cursor.value;
        email = value.email;
        ots = value.ots_key;
    }
}

function initializeDB(){

    //No support for IndexedDB or unable to access the module
    if(!window.indexedDB){
        alert("Unable to access IndexedDB");
    }

    //DB of the application is OTS
    var request = indexedDB.open("ots",1);

    request.onsuccess = function(e){
        db = e.target.result;
        fetchValues();
    };

    request.onerror = function(e){
        console.log(e);
    };

    request.onupgradeneeded = function(e){
        db = e.target.result;
        if(db.objectStoreNames.contains("ots")){
            db.deleteObjectStore("ots");
        }

        var ObjectStore = db.createObjectStore("ots", {keyPath: 'id', autoIncrement: true});
        console.log("ObjectStore created");
    };

    //console.log(db);

}

function getSecret(){
    var message = document.getElementById('your_secret').value;
    var password = document.getElementById('your_password').value;
    if (!message){
        alert('Dude, there is no message to share as secret!');
        document.getElementById('secret_url').value = null;
        return;
    }
    else if (!password){
        alert('Your secret will be created without a password.');
    }
    if (!email || !ots){
        alert('No proper OTS Email and Key has been given. Make sure they are input');
        return;
    }
    $.ajax({
        type: "POST",
        dataType: "text",
        contentType: "application/x-www-form-urlencoded",
        data: {"email" : email, "password" : password, "ots_key" : ots, "message" : message},
        async: true,
        crossDomain: true,
        url: "https://onetimesecret.herokuapp.com/trial.php",
        beforeSend: function() {
            $('#loadingDiv').show();
            $('body').css("overflow","hidden");
            $('body').css('opacity','0.4');
        },
        complete: function(){
            $('#loadingDiv').hide();
            $('body').css('opacity','1');
        },
        success: function (jsonData) {
            console.log(jsonData);
            document.getElementById('secret_url').value = jsonData;
        },
        error: function (request, textStatus, errorThrown) {
            console.log(request.responseText);
            console.log(textStatus);
            console.log(errorThrown);
        }
    });
}


function mailLink() {
    alert("Sending Mail");
    var link = "mailto:"
             + "?subject=" + escape("Secret Share")
             + "&body=" + escape(document.getElementById('secret_url').value);
    window.location.href = link;
}

window.onload = function () {
    $('#loadingDiv').hide();
    initializeDB();
    document.getElementById("generate_secret").addEventListener("click", getSecret);
    document.getElementById("email_link").addEventListener("click",mailLink);
}
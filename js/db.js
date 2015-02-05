var db;

//Fetch Values
function fetchValues(){
	var transaction = db.transaction(["ots"]);
	var store = transaction.objectStore("ots");

	store.openCursor().onsuccess = function(e){
		var cursor = e.target.result;
		var value = cursor.value;
		var email = value.email;
		var ots = value.ots_key;
		$("#email_address").val(email);
		$("#ots_key").val(ots);
	}
}

//Initialize DB
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
}

$(document).ready(function(){

	//Initializing the IndexedDB
	initializeDB();

	//Store values in DB

	$("#save_button").click(function(){

		
		//Fetch values
		var email_address = $("#email_address").val();
		var ots_key = $("#ots_key").val();

		var transaction = db.transaction(["ots"],"readwrite");

		var value = {};
		value.email = email_address;
		value.ots_key = ots_key;

		var store = transaction.objectStore("ots");
		store.clear();
		var request = store.put(value);
		if(!ots_key || !email_address){
			alert('Check your credentials again, please.');
		}
		else{
			request.onsuccess = function(e){
				alert("Save Success. Just make sure you got your keys correct.");
			};
			request.onerror = function(e){
				alert("Error: "+e.value);
			}
		}
	});

});
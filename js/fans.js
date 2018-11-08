useLocalStorage = false;

window.addEventListener('load', function () {
    if (useLocalStorage){
         getAppealFromLocalStorage()
    } else {
        getAllAppealFromIndexedDb()
    }

});

function getAppealFromLocalStorage() {
    if (localStorage.getItem('fan_appeal') === null) {
        alert('Local storage is empty');
    } else {
        alert('Local storage is not empty');
        var fan_appeal = localStorage.getItem('fan_appeal');

        var pzk = document.getElementById("appeals");
        pzk.innerHTML += " <div class=\"card col-sm-12 col-lg-12 mt-3\" id=\"appeal\">\n" +
            "                <div class=\"card-body\" >\n" +
            "                    <p class=\"card-text\">" + fan_appeal + "</p>\n" +
            "                    <div class=\"row\">\n" +
            "                        <div class=\"date_of_post_in_fans col-md-3\">" + getCurrentDate() + "</div>\n" +
            "                        <div class=\"nickname_in_fans col-md-3 col-md-offset\">Runner43783</div>\n" +
            "                    </div>\n" +
            "                </div>\n" +
            "            </div>";
    }
}

function getAllAppealFromIndexedDb() {
    var db;
    var openRequest = indexedDB.open("parkour_site_db", 2);

    openRequest.onupgradeneeded = function(e) {
        db = e.target.result;

        if(!db.objectStoreNames.contains("appeals")) {
            var objectStore = db.createObjectStore("appeals", {autoIncrement:true});

            objectStore.createIndex("appeal", "appeal", { unique: false });
        }



        alert('onupgradeneeded')
    };

    openRequest.onsuccess = function(e) {
        alert("Running indexedDb success");
        db = e.target.result;

        var s = "";

        var transaction = db.transaction(["appeals"], "readonly");

        transaction.objectStore("appeals").openCursor().onsuccess = function(e) {
            var cursor = e.target.result;

            var pzk = document.getElementById("appeals");

            if(cursor) {

                for(var i in cursor.value) {
                    pzk.innerHTML += " <div class=\"card col-sm-12 col-lg-12 mt-3\" id=\"appeal\">\n" +
                        "                <div class=\"card-body\" >\n" +
                        "                    <p class=\"card-text\">" + cursor.value[i] + "</p>\n" +
                        "                    <div class=\"row\">\n" +
                        "                        <div class=\"date_of_post_in_fans col-md-3\">" + getCurrentDate() + "</div>\n" +
                        "                        <div class=\"nickname_in_fans col-md-3 col-md-offset\">Runner43783</div>\n" +
                        "                    </div>\n" +
                        "                </div>\n" +
                        "            </div>";
                }
                cursor.continue();
            }
        };

         transaction.oncomplete = function(){
             db.close();
         }

    };

    openRequest.onerror = function(e) {
        alert('Running indexedDb error: ' + e)
    };
}

function getCurrentDate() {
    var currentdate = new Date();
    var dd = currentdate.getDate();
    var mm = currentdate.getMonth() + 1;
    var yyyy = currentdate.getFullYear();

    if (dd < 10) {
        dd = '0' + dd
    }
    if (mm < 10) {
        mm = '0' + mm
    }
    var datetime = dd + '.' + mm + '.' + yyyy;

    return datetime
}


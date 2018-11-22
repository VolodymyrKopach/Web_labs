"use_strict";

var useLocalStorage = false;

window.addEventListener('load', function () {
    getData()

});

function getData() {
    alert("getData");
    if (isOnline()) {
        if (useLocalStorage) {
            getAppealFromLocalStorage()
        } else {
            getAllAppealFromIndexedDb()
        }

        getAppealFromServer()
    }
}


function getAppealFromLocalStorage() {
    if (localStorage.getItem('fan_appeal') === null) {
        alert('Local storage is empty');
    } else {

        alert('Local storage is not empty');
        var fan_appeal = localStorage.getItem('fan_appeal');

        var appeal_in_html = document.getElementById("appeals");
        appeal_in_html.innerHTML += " <div class=\"card col-sm-12 col-lg-12 mt-3\" id=\"appeal\">\n" +
            "                <div class=\"card-body\" >\n" +
            "                    <p class=\"card-text\">" + fan_appeal + "</p>\n" +
            "                    <div class=\"row\">\n" +
            "                        <div class=\"date_of_post_in_fans col-md-3\">" + getCurrentDate() + "</div>\n" +
            "                        <div class=\"nickname_in_fans col-md-3 col-md-offset\">Runner43783</div>\n" +
            "                    </div>\n" +
            "                </div>\n" +
            "            </div>";


        localStorage.removeItem('fan_appeal');
        alert("Fans appeal deleted from local storage")
    }
}

function getAllAppealFromIndexedDb() {
    var db;
    var openRequest = indexedDB.open("parkour_site_db", 2);

    openRequest.onupgradeneeded = function (e) {
        db = e.target.result;

        if (!db.objectStoreNames.contains("appeals")) {
            var objectStore = db.createObjectStore("appeals", {autoIncrement: true});

            objectStore.createIndex("appeal", "appeal", {unique: false});
        }

        alert('onupgradeneeded')
    };

    openRequest.onsuccess = function (e) {
        alert("Running indexedDb success");
        db = e.target.result;

        var s = "";

        var transaction = db.transaction(["appeals"], "readwrite");

        transaction.objectStore("appeals").openCursor().onsuccess = function (e) {
            var cursor = e.target.result;

            var appeals_html_element = document.getElementById("appeals");

            if (cursor) {
                appeals_html_element.innerHTML += " <div class=\"card col-sm-12 col-lg-12 mt-3\" id=\"appeal\">\n" +
                    "                <div class=\"card-body\" >\n" +
                    "                    <p class=\"card-text\">" + cursor.value + "</p>\n" +
                    "                    <div class=\"row\">\n" +
                    "                        <div class=\"date_of_post_in_fans col-md-3\">" + getCurrentDate() + "</div>\n" +
                    "                        <div class=\"nickname_in_fans col-md-3 col-md-offset\">Runner43783</div>\n" +
                    "                    </div>\n" +
                    "                </div>\n" +
                    "            </div>";

                cursor.continue();
            }

            transaction.oncomplete = function(event) {
            };
            transaction.onerror = function(event) {
            };

            var objectStore = transaction.objectStore("appeals");
            var objectStoreRequest = objectStore.delete(1);

            objectStoreRequest.onsuccess = function(event) {
                alert("Appeal deleted from indexedDb")
            };
        };

        transaction.oncomplete = function () {
            db.close();
        }

    };

    openRequest.onerror = function (e) {
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

function getAppealFromServer() {
    let url = 'http://localhost:3012/appeals';
    fetch(url)
        .then(response => response.json())
        .then(data => {

            for (i in data) {
                let appeal_in_html = document.getElementById("appeals");
                appeal_in_html.innerHTML += " <div class=\"card col-sm-12 col-lg-12 mt-3\" id=\"appeal\">\n" +
                    "                <div class=\"card-body\" >\n" +
                    "                    <p class=\"card-text\">" + data[i].appeal + "</p>\n" +
                    "                    <div class=\"row\">\n" +
                    "                        <div class=\"date_of_post_in_fans col-md-3\">" + getCurrentDate() + "</div>\n" +
                    "                        <div class=\"nickname_in_fans col-md-3 col-md-offset\">Runner43783</div>\n" +
                    "                    </div>\n" +
                    "                </div>\n" +
                    "            </div>";

                alert(data[i]);
            }

            console.log(data);// Prints result from `response.json()`
        })
        .catch(error => console.error(error));


}

window.addEventListener('online', getData);

function isOnline() {
    return window.navigator.onLine;
}


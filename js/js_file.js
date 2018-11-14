"use strict";

var useLocalStorage = false;

function isOnline() {
    return window.navigator.onLine;
}

function actionWhenOnline() {
    alert("actionWhenOnline()");
    if (useLocalStorage){
        if (localStorage.getItem('news') == null) {
            alert("local storage is empty")
        } else {
            var unsavedItem = localStorage.getItem('news');
            sendDataToServer(unsavedItem);
         //   localStorage.removeItem('news');

            alert("Data sent to server")
        }
    }else {

        var db;
        var openRequest = indexedDB.open("parkour_site_db",1);

        openRequest.onupgradeneeded = function(e) {
            db = e.target.result;

            if(!db.objectStoreNames.contains("news")) {
                var objectStore = db.createObjectStore("news", {autoIncrement:true});

                objectStore.createIndex("news_title", "news_title", { unique: false });
                objectStore.createIndex("news_comment", "news_comment", { unique: false });
            }

            alert('onupgradeneeded')
        };

        openRequest.onsuccess = function(e) {
            alert("Running indexedDb success");
            db = e.target.result;

            var transaction = db.transaction(["news"], "readonly");

            transaction.objectStore("news").openCursor().onsuccess = function(e) {
                var cursor = e.target.result;

                if(cursor) {

                    sendDataToServer();

                    cursor.continue();
                }

                alert("News sent to server")

                // var store = transaction.objectStore("news");
                // var objectStoreRequest = store.delete("news");
            };

            transaction.oncomplete = function(){
                db.close();
            }
        };

        openRequest.onerror = function(e) {
            alert('Running indexedDb error: ' + e)
        };

    }
}

function actionWhenOffline() {
    alert("actionWhenOffline()");
}


class NewsObject {
    constructor(title, comment) {
        this.title = title;
        this.news_comment = comment;
    }
}


function addNews() {
    alert("btnSendNews.onclick");
    var elements = document.forms["admin_form"].elements;
    var add_title = false;
    var add_description = false;


    var title_input = document.getElementById("news_title_id");
    resetError(elements.news_title.parentNode);

    var comment_id = document.getElementById("news_comment_id");
    resetError(elements.comment.parentNode);
    if (elements.news_title.value.trim() !== "" && elements.comment.value.trim() !== "") {

        var newsObject = new NewsObject(elements.news_title.value, elements.comment.value);

        if (isOnline()) {
            alert('online');
            sendDataToServer(newsObject);
        } else {
            if (useLocalStorage) {
                saveNewsToLocalStorage(newsObject);
                alert('offline');
            } else {
                saveNewsToIndexedDB(newsObject);
            }

        }


        title_input.innerHTML = ' <textarea name="news_title" class="mb-2 form-control" size=80 style="height: 50px;width: 100%"\n' +
            '                       placeholder="News title">' + elements.news_title.value + '</textarea>\n';
        add_title = true;

        comment_id.innerHTML = '<textarea name="comment" class="form-control" cols="40" rows="3" style="height: 200px;width: 100%"\n' +
            '                          placeholder="News text">' + elements.comment.value + '</textarea>';
        add_description = true;


    }

    if (elements.news_title.value.trim() === "") {

        title_input.innerHTML = '<textarea name="news_title" class="mb-2 form-control is-invalid" size=80 style="height: 50px;width: 100%"\n' +
            '                       placeholder="News title"></textarea>';

        showError(elements.news_title.parentNode, "Введіть заголовок новини");

    }

    if (elements.comment.value.trim() === "") {
        comment_id.innerHTML = '<textarea name="comment" class="form-control is-invalid" cols="40" rows="3" style="height: 200px;width: 100%"\n' +
            '                          placeholder="News text"></textarea>';

        showError(elements.comment.parentNode, "Введіть текст новини");
    }

    if (add_title && add_description) {
        //setDefaultForm();
        elements.comment.value = "";
        elements.news_title.value = "";
        //   document.forms["admin_form"].reset();
        alert("Новину додано");
    } else {
    }

    return true;

}

function addFanAppeal() {
    alert("btnAddFanAppeal.onclick");

    var fanAppeal = document.forms["fan_appeal_form"]["message_text"].value;

    if (fanAppeal.trim() === "") {
        alert("Введіть ваше звернення")

    } else {
        if (isOnline()) {
            sendDataToServer();
            readDataWithServer();

            var currentDate = getCurrentDate();

            var pzk = document.getElementById("appeals");
            pzk.innerHTML += " <div class=\"card col-sm-12 col-lg-12 mt-3\" id=\"appeal\">\n" +
                "                <div class=\"card-body\" >\n" +
                "                    <p class=\"card-text\">" + fanAppeal + "</p>\n" +
                "                    <div class=\"row\">\n" +
                "                        <div class=\"date_of_post_in_fans col-md-3\">" + currentDate + "</div>\n" +
                "                        <div class=\"nickname_in_fans col-md-3 col-md-offset\">Runner43783</div>\n" +
                "                    </div>\n" +
                "                </div>\n" +
                "            </div>";


        } else {
            if (useLocalStorage) {
                saveAppealToLocalStorage(fanAppeal);
            } else {
                saveAppealToIndexedDB(fanAppeal)
            }

        }

        var input_form = document.forms["fan_appeal_form"];
        input_form.reset();
    }

    return false;
}




function saveAppealToIndexedDB(appeal) {
    var db;
    alert('saveAppealToIndexedDB');
    var openRequest = indexedDB.open("parkour_site_db", 2);

    openRequest.onupgradeneeded = function (e) {
        db = e.target.result;

        if (!db.objectStoreNames.contains("appeals")) {
            var objectStore = db.createObjectStore("appeals", {autoIncrement: true});

            objectStore.createIndex("fan_appeal", "fan_appeal", {unique: false});
        }

        alert('onupgradeneeded')
    };

    openRequest.onsuccess = function (e) {
        alert("Running indexedDb success");

        db = e.target.result;


        var transaction = db.transaction(["appeals"], "readwrite");
        var store = transaction.objectStore("appeals");

        var request = store.add(appeal);

        request.onerror = function (e) {
            console.log("Error", e.target.error.name);
        };

        request.onsuccess = function (e) {
            alert("Success added appeal to indexedDb");
        };

        transaction.oncomplete = function () {
            db.close();
        }
    };

    openRequest.onerror = function (e) {
        alert('Running indexedDb error: ' + e)
    };
}


function saveNewsToIndexedDB(newsObj) {
    var db;
    alert('saveAppealToIndexedDB');
    var openRequest = indexedDB.open("parkour_site_db", 1);

    openRequest.onupgradeneeded = function (e) {
        db = e.target.result;

        if (!db.objectStoreNames.contains("news")) {
            var objectStore = db.createObjectStore("news", {autoIncrement: true});

            objectStore.createIndex("news_title", "news_title", {unique: false});
            objectStore.createIndex("news_comment", "news_comment", {unique: false});
        }

        alert('onupgradeneeded')
    };

    openRequest.onsuccess = function (e) {
        alert("Running indexedDb success");

        db = e.target.result;


        var transaction = db.transaction(["news"], "readwrite");
        var store = transaction.objectStore("news");

        var request = store.add(newsObj);

        request.onerror = function (e) {
            console.log("Error", e.target.error.name);
        };

        request.onsuccess = function (e) {
            console.log("Added news success");
        };

        transaction.oncomplete = function () {
            db.close();
        }
    };

    openRequest.onerror = function (e) {
        alert('Running indexedDb error: ' + e)
    };

}


function saveNewsToLocalStorage(newsObject) {
    localStorage.setItem('news', JSON.stringify(newsObject));

    alert("SAVE NEWS TO LOCAL STORAGE")
}

function saveAppealToLocalStorage(appealText) {
    localStorage.setItem('fan_appeal', appealText);
    alert("SAVE APPEAL TO LOCAL STORAGE")
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

function sendDataToServer() {

}

function readDataWithServer() {

}


function showError(container, errorMessage) {
    container.className = 'error';
    var msgElem = document.createElement('span');
    msgElem.className = "error-message";
    msgElem.innerHTML = '<p class="alert alert-warning">' + errorMessage + '</p>';
    container.appendChild(msgElem);
}

function resetError(container) {
    container.className = '';
    if (container.lastChild.className == "error-message") {
        container.removeChild(container.lastChild);
    }
}

window.addEventListener('online', actionWhenOnline);
window.addEventListener('offline', actionWhenOffline);



"use strict";

var useLocalStorage = false;

function saveAppealToIndexedDB(appeal) {
    var db;
    alert('saveAppealToIndexedDB');
    var openRequest = indexedDB.open("parkour_site_db",3);

    openRequest.onupgradeneeded = function(e) {
        var thisDB = e.target.result;

        if(!thisDB.objectStoreNames.contains("appeal")) {
            thisDB.createObjectStore("appeal", {autoIncrement:true});
        }

        alert('onupgradeneeded')
    };

    openRequest.onsuccess = function(e) {
        alert("Running indexedDb success");

        db = e.target.result;


        var transaction = db.transaction(["appeal"],"readwrite");
        var store = transaction.objectStore("appeal");

        var request = store.add(appeal);

        request.onerror = function(e) {
            console.log("Error",e.target.error.name);
        };

        request.onsuccess = function(e) {
            console.log("Added appeal success");
        };
    };

    openRequest.onerror = function(e) {
        alert('Running indexedDb error: ' + e)
    };

    db.close();
}


function saveNewsToIndexedDB(newsObj) {
    var db;
    alert('saveAppealToIndexedDB');
    var openRequest = indexedDB.open("parkour_site_db",3);

    openRequest.onupgradeneeded = function(e) {
        var thisDB = e.target.result;

        if(!thisDB.objectStoreNames.contains("news")) {
            thisDB.createObjectStore("news", {autoIncrement:true});
        }

        alert('onupgradeneeded')
    };

    openRequest.onsuccess = function(e) {
        alert("Running indexedDb success");

        db = e.target.result;


        var transaction = db.transaction(["news"],"readwrite");
        var store = transaction.objectStore("news");

        var request = store.add(newsObj);

        request.onerror = function(e) {
            console.log("Error",e.target.error.name);
        };

        request.onsuccess = function(e) {
            console.log("Added news success");
        };
    };

    openRequest.onerror = function(e) {
        alert('Running indexedDb error: ' + e)
    };

}


window.addEventListener('load', function () {

    window.addEventListener('online', updateOnlineStatus);
    window.addEventListener('offline', updateOnlineStatus);

    function updateOnlineStatus(event) {
        // add logic
        if (event.type === 'online') {
            if (localStorage.getItem('news') === null) {
                console.log('no item to load')
            } else {
                var unsavedItem = localStorage.getItem('news');
                sendDataToServer(unsavedItem);
                localStorage.removeItem('news')
            }
        } else {

        }
    }

});


function saveNewsToLocalStorage(newsObject) {
    localStorage.setItem('news', JSON.stringify(newsObject));

    alert("SAVE NEWS TO LOCAL STORAGE")

    // var retrievedObject = JSON.parse(localStorage.getItem('news'));
    // console.log('saved to local storage');
    // console.log('news: ', retrievedObject);
}

function saveAppealToLocalStorage(appealText) {
    localStorage.setItem('fan_appeal', appealText);
    alert("SAVE APPEAL TO LOCAL STORAGE")
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


        var newsObject = {
            "news_title": elements.news_title.value,
            "news_comment": elements.comment.value
        };

        saveNewsToIndexedDB(newsObject);

        if(isOnline()) {
            // console.log('online!');
            sendDataToServer(newsObject);
        } else {
            if (useLocalStorage){
                saveNewsToLocalStorage(newsObject);
                // console.log('offline!');
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

    if (elements.comment.value.trim() === ""){
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
    console.log("btnAddFanAppeal.onclick");

    var text = document.forms["fan_appeal_form"]["message_text"].value;
    //Тимчасово
    alert("Дойшло");
    saveAppealToIndexedDB(text);
    alert('після');


    if (text.trim() === "") {
        alert("Введіть ваше звернення")

    } else {
        if (isOnline()) {
            sendDataToServer();
            readDataWithServer();

        } else {
            if (useLocalStorage){
                saveAppealToLocalStorage(text);
            } else {
                alert('else');
                saveAppealToIndexedDB(text)
            }

        }

        var currentDate = getCurrentDate();

        var pzk = document.getElementById("appeals");
        pzk.innerHTML += " <div class=\"card col-sm-12 col-lg-12 mt-3\" id=\"appeal\">\n" +
            "                <div class=\"card-body\" >\n" +
            "                    <p class=\"card-text\">" + text + "</p>\n" +
            "                    <div class=\"row\">\n" +
            "                        <div class=\"date_of_post_in_fans col-md-3\">" + currentDate + "</div>\n" +
            "                        <div class=\"nickname_in_fans col-md-3 col-md-offset\">Runner43783</div>\n" +
            "                    </div>\n" +
            "                </div>\n" +
            "            </div>";

        var input_form = document.forms["fan_appeal_form"];
        input_form.reset();
    }

    return false;
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


function isOnline() {
    return window.navigator.onLine;
}




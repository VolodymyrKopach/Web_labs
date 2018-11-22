"use_strict";

var useLocalStorage =  false;

window.addEventListener('load', function () {
    getData()

});

function getData() {
    alert("getData");
    if (isOnline()) {
        if (useLocalStorage) {
            getNewsFromLocalStorage()
        } else {
            getAllNewsFromIndexedDb()
        }
        getNewsFromServer();
    }

}

function getNewsFromLocalStorage() {
    if (localStorage.getItem('news') === null) {
        alert('local storage is empty');
    } else {
        alert('local storage is not empty');
        var news = localStorage.getItem('news');

        obj = JSON.parse(news);

        var flex_container_html_element = document.getElementById("my_flex_container_id");
        flex_container_html_element.innerHTML += "<div class=\"my_flex_block\">\n" +
            "            <img class=\"img_in_news\" src=\"https://www.segodnya.ua/img/article/10370/68_main.1499774748.jpg\" alt=\"\"  >\n" +
            "            <div><p class=\"title_in_news\">" + obj.title + "</div>\n" +
            "            <div><p class=\"article_in_news\">" + obj.news_comment + "</div>\n" +
            "        </div>";


        localStorage.removeItem('news');
        alert("News deleted from local storage")
    }
}

function getAllNewsFromIndexedDb() {
    var db;
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

        var s = "";

        var transaction = db.transaction(["news"], "readwrite");

        transaction.objectStore("news").openCursor().onsuccess = function (e) {
            var cursor = e.target.result;

            if (cursor) {
                var news = cursor.value.news_comment;
                alert(news);

                var news_html_element = document.getElementById("my_flex_container_id");
                var my_news = " <div class=\"card col-sm-12 col-lg-12 mt-3\" id=\"appeal\">\n" +
                    "                <div class=\"card-body\" >\n" +
                    "                    <p class=\"card-text\">" + news + "</p>\n" +
                    "                    <div class=\"row\">\n" +
                    "                        <div class=\"date_of_post_in_fans col-md-3\">" + getCurrentDate() + "</div>\n" +
                    "                        <div class=\"nickname_in_fans col-md-3 col-md-offset\">Runner43783</div>\n" +
                    "                    </div>\n" +
                    "                </div>\n" +
                    "            </div>";
                news_html_element.innerHTML += my_news;

                cursor.continue();
            }

            transaction.oncomplete = function(event) {
            };
            transaction.onerror = function(event) {
            };

            var objectStore = transaction.objectStore("news");
            var objectStoreRequest = objectStore.delete(1);

            objectStoreRequest.onsuccess = function(event) {
                alert("News deleted from indexedDb");
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

function getNewsFromServer() {
    let url = 'http://localhost:3012/news';
    let newsObj;
    fetch(url)
        .then(response => response.json())
        .then(data => {

            for (i in data) {
                var flex_container_html_element = document.getElementById("my_flex_container_id");
                flex_container_html_element.innerHTML += "<div class=\"my_flex_block\">\n" +
                    "            <img class=\"img_in_news\" src=\"https://www.segodnya.ua/img/article/10370/68_main.1499774748.jpg\" alt=\"\"  >\n" +
                    "            <div><p class=\"title_in_news\">" + data[i].title + "</div>\n" +
                    "            <div><p class=\"article_in_news\">" + data[i].news_comment + "</div>\n" +
                    "        </div>";

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
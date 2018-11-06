useLocalStorage = false;

window.addEventListener('load', function () {
    if (useLocalStorage){
        getNewsFromLocalStorage()
    } else {
        getAllNewsFromIndexedDb()
    }

});

function getNewsFromLocalStorage() {
    //Поправити
    this.localStorage.setItem("news", "drfghjgfdfghjgf");

    if (this.localStorage.getItem('news') === null) {
        //console.log('local storage is empty');
    } else {
        console.log('local storage is not empty');
        var news = this.localStorage.getItem('news');
        var parent = this.document.querySelector('.my_flex_container');
        var my_news = " <div class=\"card col-sm-12 col-lg-12 mt-3\" id=\"appeal\">\n" +
            "                <div class=\"card-body\" >\n" +
            "                    <p class=\"card-text\">" + news + "</p>\n" +
            "                    <div class=\"row\">\n" +
            "                        <div class=\"date_of_post_in_fans col-md-3\">" + getCurrentDate() + "</div>\n" +
            "                        <div class=\"nickname_in_fans col-md-3 col-md-offset\">Runner43783</div>\n" +
            "                    </div>\n" +
            "                </div>\n" +
            "            </div>";

        parent.appendChild(my_news);
    }
}

function getAllNewsFromIndexedDb() {
    var db;
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

        var s = "";

        db.transaction(["news"], "readonly").objectStore("news").openCursor().onsuccess = function(e) {
            var cursor = e.target.result;

            var pzk = document.getElementById("appeals");

            if(cursor) {

                for(var i in cursor.value) {
                    var news = cursor.value[i];

                    var pzk = document.getElementById("my_flex_container_id");
                    var my_news = " <div class=\"card col-sm-12 col-lg-12 mt-3\" id=\"appeal\">\n" +
                        "                <div class=\"card-body\" >\n" +
                        "                    <p class=\"card-text\">" + news + "</p>\n" +
                        "                    <div class=\"row\">\n" +
                        "                        <div class=\"date_of_post_in_fans col-md-3\">" + getCurrentDate() + "</div>\n" +
                        "                        <div class=\"nickname_in_fans col-md-3 col-md-offset\">Runner43783</div>\n" +
                        "                    </div>\n" +
                        "                </div>\n" +
                        "            </div>";
                    pzk.innerHTML += my_news



                }
                cursor.continue();
            }
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



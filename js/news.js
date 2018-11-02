window.addEventListener('load', function () {

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
});


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


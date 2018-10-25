"use strict";

function addNews() {
    var elements = document.forms["admin_form"].elements;
    var add_title = false;
    var add_description = false;


    var title_input = document.getElementById("news_title_id");
    resetError(elements.news_title.parentNode);
    if (elements.news_title.value === "" || elements.news_title.value === " ") {
        title_input.innerHTML = '<textarea name="news_title" class="mb-2 form-control is-invalid" size=80 style="height: 50px;width: 100%"\n' +
            '                       placeholder="News title"></textarea>';

        showError(elements.news_title.parentNode, "Введіть заголовок новини");
    } else {
        title_input.innerHTML = ' <textarea name="news_title" class="mb-2 form-control" size=80 style="height: 50px;width: 100%"\n' +
            '                       placeholder="News title">'+ elements.news_title.value + '</textarea>\n';
        add_title = true;
    }

    var comment_id = document.getElementById("comment_id");
    resetError(elements.comment.parentNode);
    if (elements.comment.value === "" || elements.comment.value === " ") {
        comment_id.innerHTML = '<textarea name="comment" class="form-control is-invalid" cols="40" rows="3" style="height: 200px;width: 100%"\n' +
            '                          placeholder="News text"></textarea>';
        showError(elements.comment.parentNode, "Введіть текст новини");
    } else {
        comment_id.innerHTML = '<textarea name="comment" class="form-control" cols="40" rows="3" style="height: 200px;width: 100%"\n' +
            '                          placeholder="News text">' + elements.comment.value + '</textarea>';
        add_description = true;
    }

    if (add_title && add_description) {
        //setDefaultForm();
        elements.comment.value = "";
        elements.news_title.value = "";
     //   document.forms["admin_form"].reset();
        alert("Новину додано");
        return true;
    }else {
        return false;
    }

}

function addFanAppeal() {

    var fail = false;
    var text = document.forms["fan_appeal_form"]["message_text"].value;

    var currentDate = getCurrentDate();

    if (text === "" || text === " ") {
        fail = true
    }

    if (fail) {
        alert("Введіть ваше звернення")
    } else {
        if (isOnline()){
            localStorage.setItem('appeal_1', text);
        }
        
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

function isOnline(){
    return window.navigator.onLine;
}




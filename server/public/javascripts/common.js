function showAlert(text,color){
    var mainAlert = $("<div>")
    mainAlert.addClass("alert");
    mainAlert.addClass("alert-"+color);
    mainAlert.html(text)
    $("body").append(mainAlert);
    setTimeout(function (){
        mainAlert.fadeOut();
    },2000);
}
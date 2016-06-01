/**
 * Created by William on 21/01/2016.
 */

var app = app || {};

(function() {
    app.getCookie = (function(cname) {
        if ($.cookie(cname) == undefined)
            return "";
        return $.cookie(cname);
    })

    app.checkCookie = (function() {
        var user = app.getCookie("username");
        var token = app.getCookie("token");
        var userID = app.getCookie("userID")
        var email = app.getCookie("email");
        if (user != "" && token != "") {
            app.Online(user);
            return true;
        }
        else {
            app.Offline()
            return false;
        }
    })

    app.eraseCookie = (function(name) {
        $.removeCookie(name);
    })

    app.Online = (function(name) {
        $('a#button-logout').show();
        $("a#button-profile").text(name);
        $('img.img-gravatar-menu').attr("src","http://www.gravatar.com/avatar/" + CryptoJS.MD5(app.getCookie("email")));
        $('#button-profile').attr("data-target", '');
        $("#LogIn").parent().css("height", "0px");
        $("#LogIn").parent().css("visibility", "hidden");
        $("#LogOut").parent().css("height", "auto");
        $("#LogOut").parent().css("visibility", "visible");
    })

    app.Offline = (function() {
        $('a#button-logout').hide();
        $(".status-user").text("Offline");
        $('#button-profile').attr("data-target", '#ConnexionModal');
        $("#LogIn").parent().css("height", "auto");
        $("#LogIn").parent().css("visibility", "visible");
        $("#LogOut").parent().css("height", "0px");
        $("#LogOut").parent().css("visibility", "hidden");
        $("#UserName").text('Invited');
        return false;
    })

    app.connect = (function(email, password) {
        if (app.checkCookie() == true)
            return;
        $.ajax({
            method: "POST",
            url: app.baseUrl + "/login",
            contentType: 'application/x-www-form-urlencoded',
            data : {
                email: email,
                password: CryptoJS.MD5(password).toString(CryptoJS.enc.Base64)
            },
            success: (function(response) {
                $("#ConnexionModal").modal('hide');
                $.cookie("username", response.name, { expires : 1 });
                $.cookie("token", response.token, { expires : 1 });
                $.cookie("userID", response.id, { expires : 1 });
                $.cookie("email", response.email, { expires : 1 });
                Backbone.$.ajaxSetup({
                    headers: { 'Authorization': app.getCookie("token") }
                });
                app.Online(response.name);
            }),
            error: (function(error) {
                $("#errorLogin").css('visibility', 'visible');
                $("#errorLogin").css('height', '15px');
                if (error.status == 401)
                    $("p#errorLogin").text("Logs incorrect. Please try again.");
                else
                    $("p#errorLogin").text("Unknow error : " + error.statusText);
            }),
            complete: (function() {
                if (app.checkCookie() == true)
                    Backbone.history.navigate(app.getCookie("RootAfterCo") , {trigger: true});
            })
        });

    })

    app.checkLogin = (function() {
        if (app.checkCookie() == false) {
            Backbone.history.navigate('login' , {trigger: true});
            return false;
        }
        Backbone.$.ajaxSetup({
            headers: { 'Authorization': app.getCookie("token") }
        });
        return true;
    })

    app.loadMenu = (function() {
        app.checkCookie();
        $("#LogOut").click(function (e) {
            e.preventDefault();
            if (app.checkCookie() == false)
                return;
            $.ajax({
                method: "GET",
                url: app.baseUrl + "/logout",
                contentType: 'application/x-www-form-urlencoded',
                success: (function () {
                    app.Offline();
                    window.location.href = "index.html";
                    app.eraseCookie("token");
                    app.eraseCookie("username");
                    app.eraseCookie("userID");
                }),
                error: (function () {
                    return;
                })
            });
        })
    })
    /* Link backbone collection */

    app.signUp = (function(name, email, password) {
        $.ajax({
            url: app.baseUrl + '/signup',
            type: 'POST',
            contentType: 'application/x-www-form-urlencoded',
            data : {
                name : name,
                email : email,
                password: CryptoJS.MD5(password).toString(CryptoJS.enc.Base64)
            },
            success: (function() {
                app.connect(email, password);
                $('#ConnexionModal').modal('hide');
                $('#SuccessModal').modal('show');
            }),
            error: (function() {
                $('#ConnexionModal').modal('hide');
                $('#ErrorModal').modal('show');
            })
        });
    })

    $("#CreateAccount").click(function(e) {
        e.preventDefault();
        $("#userEmailModal").css('border-color', 'black');
        $("#userEmailModal").css('border-style', 'none');
        $("#passwordFirst").css('border-color', 'black');
        $("#passwordFirst").css('border-style', 'none');
        $("#userNameModal").css('border-color', 'black');
        $("#userNameModal").css('border-style', 'none');
        $("#passwordVerification").css('border-color', 'black');
        $("#passwordVerification").css('border-style', 'none');
        if($("#userEmailModal").val() == '') {
            $("#userEmailModal").css('border-color', 'red');
            $("#userEmailModal").css('border-style', 'dotted');
            return ;
        }
        if($("#passwordFirst").val() == '') {
            $("#passwordFirst").css('border-color', 'red');
            $("#passwordFirst").css('border-style', 'dotted');
            return;
        }
        if($("#userNameModal").val() == '') {
            $("#userNameModal").css('border-color', 'red');
            $("#userNameModal").css('border-style', 'dotted');
            return;
        }
        if ($("#passwordFirst").val() != $("#passwordVerification").val()) {
            $("#passwordVerification").css('border-color', 'red');
            $("#passwordVerification").css('border-style', 'dotted');
            return;
        }
        app.signUp($("#userNameModal").val(),$("#userEmailModal").val(),  $("#passwordFirst").val());
        $("#userEmailModal").val('');
        $("#passwordFirst").val('');
        $("#userNameModal").val('');
        $("#passwordVerification").val('');
    });
})();

$("#SignIn").click(function (e) {
    e.preventDefault();
    $("#email").css('border-color', 'black');
    $("#email").css('border-style', 'none');
    $("#password").css('border-color', 'black');
    $("#password").css('border-style', 'none');
    $("#errorLogin").css('visibility', 'hidden');
    $("#errorLogin").css('height', '0px');
    $("p#errorLogin").text('');
    if($("#email").val() == '') {
        $("#email").css('border-color', 'red');
        $("#email").css('border-style', 'dotted');
        $("#errorLogin").css('visibility', 'visible');
        $("#errorLogin").css('height', '15px');
        $("p#errorLogin").text("Please enter a correct email");
        return ;
    }
    if($("#password").val() == '') {
        $("#password").css('border-color', 'red');
        $("#password").css('border-style', 'dotted');
        $("#errorLogin").css('visibility', 'visible');
        $("#errorLogin").css('height', '15px');
        $("p#errorLogin").text("Please enter a correct password");
        return;
    }
    app.connect($("#email").val(), $("#password").val());
});

$( window ).resize(function() {
    $( ".container-page" ).css("height", $( window ).height()+ "px");
});

$(document).ready(function () {
    $( ".container-page" ).css("height", $( window ).height()+ "px");
});
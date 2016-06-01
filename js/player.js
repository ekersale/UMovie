/**
 * Created by kersal_e on 24/01/2016.
 */

jQuery(document).ready(function(){
    $("body").on('hidden.bs.modal', function (e) {
        $('.modal-backdrop').remove();
        var $iframes = $(e.target).find("iframe");
        $iframes.each(function(index, iframe){
            $(iframe).attr("src", $(iframe).attr("src"));
        });
        var inputs = $(e.target).find("input");
        inputs.each(function(index, myinput) {
            $(myinput).val('');
        });
        var errorMessage = $(e.target).find("#errorLogin");
        errorMessage.each(function(index, msg) {
            $(msg).html('');
        })
    });
});
'use strict';
// a service to use noty package more easy
var NotifyService = function () {

        var colors = {
            alert: '#3276B1',
            success: '#58a112',
            error: '#D44128',
            warning: '#C79121',
            information: '#57889C'
        };

        this.alert = alert;
        this.success = success;
        this.error = error;
        this.warning = warning;
        this.information = information;
        this.close = close;

        function alert(title, message) {
            noty(generateOptions(title, message, 'alert', colors.danger));
        }
        function close() {
            $.noty.closeAll()
        }

        function success(title, message) {
            noty(generateOptions(title, message, 'success', colors.success));
        }

        function error(title, message) {
            noty(generateOptions(title, message, 'error', colors.error));
        }

        function warning(title, message) {
            noty(generateOptions(title, message, 'warning', colors.warning));
        }

        function information(title, message) {
            noty(generateOptions(title, message, 'information', colors.information));
        }

        function generateOptions(title, message, type, color) {
            title = title ? title : 'Alert Title';
            message = message ? message : 'Alert Message';
            type = type ? type : 'alert';
            color = color ? color : '';
            return {
                text: message,
                template: '<div class="noty_message"><span><strong>' + title + '</strong></span><br>' +
                '<span class="noty_text">' + message + '</span><div class="noty_close"></div></div>',
                animation: {
                    open: 'animated fadeInDown', // Animate.css class names
                    close: 'animated fadeOutUp' // Animate.css class names
                    //easing: 'swing', // unavailable - no need
                    //speed: 500 // unavailable - no need
                },
                type: type,
                timeout: 3000,
                killer: false,
                dismissQueue: false
            };


            //return {
            //    title: title,
            //    content: message,
            //    color: color,
            //    iconSmall: "fa " + icon + " fa-2x fadeInRight animated",
            //    timeout: 2000,
            //    sound: false
            //};
        }
    }
    ;

NotifyService.$inject = [];
module.exports = NotifyService;

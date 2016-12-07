window.jQuery = window.$ = require('jquery');
// moment js is for formatting the dates ... its pretty awesome and easy to use :)
window.moment = require('moment');
window.noty = require('noty');

window.momentTimezone = require('moment-timezone');

//here i add all the necessary packages that i will use
require('angular-bootstrap');
require('ngMap');
require('angular-ui-router');
require('angular-ui-bootstrap');
require('angular-animate');
require('angular-sanitize');
require('angularjs-slider');



module.exports = angular.module('common',
    [
        'ui.bootstrap',
        'ui.router',
        'ngAnimate',
        'ngSanitize',
        'ui.bootstrap',
        'rzModule',
        'ngMap',

        require('./directives').name,
        require('./services').name,



    ]);

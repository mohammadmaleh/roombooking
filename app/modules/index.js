// loading our modules
'use strict';
module.exports = angular.module('modules',
    [
        //loading the module

        require('./roomBooking').name

    ])
    .controller('MainCtrl', require('./MainController'));
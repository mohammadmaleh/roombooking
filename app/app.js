
// here is the main modules to connect pages modules and common (directive,services ) modules
var angular = require('angular');

module.exports = angular.module('Room_Booking',

    [
        // calling the common module where i put directives filters constants ect ...
        require('./common/common.js').name,
        // calling the main module where i call al the pages modules from
        require('./modules').name
    ])



'use strict';
var fs = require('fs');
// defining the view
var roomBookingDirectiveHtml = fs.readFileSync(__dirname + '/roomBooking.html', 'utf8');

module.exports = function roomBookingDirective() {
    return {
        // defining the controller
        controller: 'RoomBookingCtrl',
        // defining the main variable of the controller and how the view gonna see it
        controllerAs: 'roomBookingVm',
        bindToController: true,
        restrict: 'EA',
        scope: true,
        template: roomBookingDirectiveHtml
    };
};
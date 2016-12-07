'use strict';
//  here im creating my module defining its directive and controller
module.exports = angular.module('modules.roomBooking', [])
    .directive('roomBookingView', require('./roomBookingDirective'))
    .controller('RoomBookingCtrl', require('./RoomBookingController'))
    // usually i create a single a single js file for all routes and include it here ... but since its one page project i define it once here
    .config(require('./roomBookingRoutes'));

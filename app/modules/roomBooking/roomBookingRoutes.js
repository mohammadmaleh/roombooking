'use strict';

function roomBookingRoutes($stateProvider) {
    // setting the route of my module
    var roomBooking = {
        name: 'roomBooking', // state name
        url: '/room-booking', // url path that activates this state
        template: '<div room-booking-view></div>',
        data: {
            moduleClasses: 'page', // assign a module class to the <body> tag
            pageClasses: 'roomBooking', // assign a page-specific class to the <body> tag
            pageTitle: 'Home', // set the title in the <head> section of the index.html file

        }
    };

    $stateProvider.state(roomBooking);

}

roomBookingRoutes.$inject = ['$stateProvider'];
module.exports = roomBookingRoutes;
'use strict';
// Controller naming conventions should start with an uppercase letter
function MainCtrl($state) {
    // calling the the view of the module ... this gonna be login page or default page ect  in another project
    $state.go('roomBooking');

}
MainCtrl.$inject = ['$state'];
module.exports = MainCtrl;
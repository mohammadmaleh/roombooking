'use strict';

function RoomBookingCtrl($http,$scope,$uibModal,$timeout,$sce ,NotifyService,NgMap) {
    var vm = this ;
    // to filter room by price
    vm.priceFilter = function(min, max){
        return function(item){
            return item['price'] >= min &&  item['price'] <= max;
        }
    }
    // filter rooms by availability
    vm.availableFilter = function(availableFilter){
        if (availableFilter){
            return function(item){
                return item['availableToday'] ;
            }
        }


    }

    // handles the map honestly i just copy paste it from internet and modify it to pass a city name and the map will point at it
    vm.googleMapsUrl = 'https://maps.google.com/maps/api/js';
    vm.selectedCities = [];
    // created an array with 5 cities available for this prototype , the map wont work for other cites
    vm.cities = [
        {id: 1,name: 'Munich', pos:[48.135125, 11.581981]},
        {id: 2,name: 'Hamburg',pos:[53.551085, 9.993682]},
        {id: 3,name: 'Frankfurt',pos:[50.110922, 8.682127]},
        {id: 4,name: 'Berlin',pos:[52.521248, 13.399038]},
        {id: 5,name: 'Cologne',pos:[50.937531, 6.960279]}
    ];
    vm.googleMapsUrl = 'https://maps.google.com/maps/api/js';
    vm.selectionsChanged = function(cityName){

        vm.selectedCities = [];

        angular.forEach(vm.cities,function (city) {
            if (city.name == cityName){
                vm.selectedCities.push(city);
            }
        })

        vm.zoomToIncludeMarkers();
    };

    vm.zoomToIncludeMarkers = function() {
        var bounds = new google.maps.LatLngBounds();
        vm.selectedCities.forEach(function(c) {
            var latLng = new google.maps.LatLng(c.pos[0],c.pos[1]);
            bounds.extend(latLng);
        });
        $scope.map.fitBounds(bounds);
        if(vm.selectedCities.length == 1){
            $scope.map.setZoom(5);
        }
    };
    // end handling map

    // this object represent time line with all available times
    vm.tempTimeline = {
        "07:00":0,
        "07:15":0,
        "07:30":0,
        "07:45":0,
        "08:00":0,
        "08:15":0,
        "08:30":0,
        "08:45":0,
        "09:00":0,
        "09:15":0,
        "09:30":0,
        "09:45":0,
        "10:00":0,
        "10:15":0,
        "10:30":0,
        "10:45":0,
        "11:00":0,
        "11:15":0,
        "11:30":0,
        "11:45":0,
        "12:00":0,
        "12:15":0,
        "12:30":0,
        "12:45":0,
        "13:00":0,
        "13:15":0,
        "13:30":0,
        "13:45":0,
        "14:00":0,
        "14:15":0,
        "14:30":0,
        "14:45":0,
        "15:00":0,
        "15:15":0,
        "15:30":0,
        "15:45":0,
        "16:00":0,
        "16:15":0,
        "16:30":0,
        "16:45":0,
        "17:00":0,
        "17:15":0,
        "17:30":0,
        "17:45":0,
        "18:00":0,
        "18:15":0,
        "18:30":0,
        "18:45":0,
        "19:00":0,


    };
    // to request rooms for the next day
    vm.nextDay = function () {
        var tempDay  =  moment(vm.selectedDate).add(1,'days');
        vm.selectedDate = new Date(tempDay);
        vm.getRooms();


    }
    // to request rooms for the prev day

    vm.prevDay = function () {
        var tempDay =  moment(vm.selectedDate).subtract(1,'days');
        vm.selectedDate = new Date(tempDay);
        vm.getRooms();



    }
    vm.tempTimeStep = [];
    angular.forEach(vm.tempTimeline,function (value,key) {
        vm.tempTimeStep.push(key);
    })
    vm.roomList = [];
    vm.selectedDate = new Date();

    // function to call the backend method and get data for selected day
    vm.getRooms = function () {
        vm.HeaderDate = moment(vm.selectedDate).format('DD-MM-YYYY');

        vm.formatedSelectedDate = moment(vm.selectedDate).format("YYYY-MM-DDT00:00:00")+"Z";
        $http.post('/getrooms',{date:vm.formatedSelectedDate})
            .success(function (result) {
                // $scope.handleCanvas()

                vm.roomList = result;
                // for each room
                angular.forEach(vm.roomList,function (room) {
                    room.slides = [];
                    // handles sliders for eachroom
                    angular.forEach(room.images,function (image,index) {
                        room.slides.push({
                            image: image,
                            id: index
                        });
                    })
                    //handels timeline for each room
                    room.timeline= angular.copy(vm.tempTimeline);
                    var availabiltyIndex = 0;
                    angular.forEach( room.avail,function (availableItem,availableKey) {
                        var valueToFill =0;
                        availabiltyIndex++;
                        angular.forEach(room.timeline,function (timelineValue,timelineKey) {
                             if(room.timeline[timelineKey] == 0){

                                 if (moment(availableItem.from).utc().format('HH:mm') == timelineKey){
                                     valueToFill = availabiltyIndex;
                                 }
                                 else if (moment(availableItem.to).utc().format('HH:mm') == timelineKey){

                                     valueToFill = 0
                                 }
                                 room.timeline[timelineKey] = valueToFill;
                             }
                        })

                    })

                })



            })
            .error(function (err) {
                NotifyService.error('Error',err);
            })
    }
    // getting rooms for today
    vm.getRooms();



    // for clearing the datepicker
    $scope.clear = function() {
        vm.dt = null;
    };
    // vars for handling date picker
    vm.myInterval = 5000;
    vm.isCollapsed = true;
    vm.noWrapSlides = false;
    vm.dateOptions = {
        formatYear: 'yy',
        startingDay: 1
    };







    // top open datepicker
    vm.open1 = function() {
        vm.popup1.opened = true;
    };
    vm.popup1 = {
        opened: false
    };


    // formats date picker
    vm.formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
    vm.format = vm.formats[0];
    vm.altInputFormats = ['M!/d!/yyyy'];

    // handles booknow button and opens a popup
    vm.bookNow =  function(room){
        // init popup
        var modalInstance = $uibModal.open({
            animation: true,
            ariaLabelledBy: 'modal-title',
            ariaDescribedBy: 'modal-body',
            templateUrl: 'myModalContent.html',
            // popup controller
            controller: ModalInstanceCtrl,
            controllerAs: 'popupVm',
            size: 'lg',
            resolve: {
                vm: function () {
                    return vm;
                },
                room:function () {
                    return room
                }
            }
        });
        function ModalInstanceCtrl($scope, $uibModalInstance, vm,room) {
            var vm2 = this
            vm2.test = 'test'
            vm2.vm = vm
            $scope.room = room
            vm2.attendeeName =  vm2.attendeeEmail = vm2.attendeePhone = vm2.eventDescription = vm2.eventTitle=  '';
            vm2.selectedMinValue = '07:00';
            vm2.selectedMaxValue = '19:00';
            vm2.manualSelectedMinValue = new Date ('01-01-2016 ' +vm2.selectedMinValue)
            vm2.manualSelectedMaxValue = new Date ('01-01-2016 ' +vm2.selectedMaxValue)
            vm2.updateDirective = true;
            vm2.validTimeLine = true;
            // regex for attendees infos
            var emailRegex = /^[-a-z0-9~!$%^&*_=+}{\'?]+(\.[-a-z0-9~!$%^&*_=+}{\'?]+)*@([a-z0-9_][-a-z0-9_]*(\.[-a-z0-9_]+)*\.([a-z0-9]{2,99}))(:[0-9]{1,5})?$/i;
            var nameRegex = /^([a-zA-Z]+\s)*[a-zA-Z]+$/ // only letters
            var PhoneRegex = /^(?=.*\d).{6,20}$/; // between  6~20 numbers
            // handles regular timepickers to make sure start time not more tha end time and to bind it with the pro slider
            vm2.changeManualDate= function () {

                var min = moment(vm2.manualSelectedMinValue).format('HH:mm')
                var max = moment(vm2.manualSelectedMaxValue).format('HH:mm')

                if(moment(vm2.manualSelectedMinValue).diff(moment(vm2.manualSelectedMaxValue)) >= 0)
                {
                    min = moment(vm2.manualSelectedMaxValue).subtract('minutes', 15).format('HH:mm')
                    vm2.manualSelectedMinValue = new Date ('01-01-2016 ' + min)
                }
                if(moment(vm2.manualSelectedMaxValue).diff(moment(vm2.manualSelectedMinValue)) <= 0)
                {
                    max = moment(vm2.manualSelectedMinValue).add('minutes', 15).format('HH:mm')
                    vm2.manualSelectedMaxValue = new Date ('01-01-2016 ' + max)
                }
                if (moment(vm2.manualSelectedMinValue).diff(moment('01-01-2016 07:00')) < 0 )
                {
                    min = '07:00'
                    vm2.manualSelectedMinValue = new Date ('01-01-2016 ' +'07:00')
                }
                if ( moment(vm2.manualSelectedMaxValue).diff(moment('01-01-2016 19:00')) > 0){
                    max = '19:00'
                    vm2.manualSelectedMaxValue = new Date ('01-01-2016 ' +'19:00')

                }
                if ( moment(vm2.manualSelectedMaxValue).diff(moment('01-01-2016 07:15')) < 0){
                    max = '07:15'
                    vm2.manualSelectedMaxValue = new Date ('01-01-2016 ' +'07:15')

                }

                vm2.slider.minValue  = vm2.selectedMinValue= min
                vm2.slider.maxValue  = vm2.selectedMaxValue= max
                vm2.updateDirective = !vm2.updateDirective

            }
            // handles the slider
            vm2.slider = {
                minValue: vm2.vm.tempTimeStep,
                maxValue: vm2.vm.tempTimeStep[vm2.vm.tempTimeStep.length-1],
                options: {
                    draggableRange: true,
                    stepsArray: vm2.vm.tempTimeStep,
                    minRange: 1,
                    noSwitching: true,
                    pushRange: true,
                    // to handle the color of the bar when valid green and when invalid red
                    getSelectionBarColor: function(min,max) {
                           var  minTimelineValue = $scope.room.timeline[min]
                           var  maxTimelineValue = $scope.room.timeline[moment('01-01-2016 '+max).subtract('minutes', 15).format('HH:mm')]

                        if ( minTimelineValue!= 0 && maxTimelineValue!= 0 && minTimelineValue == maxTimelineValue ){
                            vm2.validTimeLine = true;
                               return '#009547'
                        }
                        else{
                            vm2.validTimeLine = false;
                            return '#E31E2F'
                        }
                    },
                    // to update the canvas and bind the slider with manual timepickers
                    onChange: function(id,min,max) {
                        vm2.updateDirective = !vm2.updateDirective
                        vm2.selectedMinValue = min;
                        vm2.manualSelectedMinValue = new Date ('01-01-2016 ' +min)
                        vm2.manualSelectedMaxValue = new Date ('01-01-2016 ' +max)
                        vm2.selectedMaxValue= max;
                    }

                }

            };
            // refresh the slider whenever a popup opens
            var  refreshSlider = function () {
                $timeout(function () {
                    $scope.$broadcast('rzSliderForceRender');
                });
            };
            refreshSlider();
            vm2.attendeeList = [];
            vm2.attendeeCount = 1
            // adding attendees and validate them
            vm2.addAttendee =  function () {
                // using regex to validate atendees info
                var validEmail = emailRegex.test(vm2.attendeeEmail);
                var validName = nameRegex.test(vm2.attendeeName);
                var validPhone = PhoneRegex.test(vm2.attendeePhone);


                if (vm2.attendeeList.length+1 <= vm2.attendeeCount){

                    if (!validName){
                        vm2.bookingForm.$setValidity('attendeeName', false);
                        vm2.showNameError =  true
                    }
                    else    {
                        vm2.bookingForm.$setValidity('attendeeName', true);
                        vm2.showNameError =  false
                    }
                    if (!validEmail){
                        vm2.bookingForm.$setValidity('attendeeEmail', false);
                        vm2.showEmailError =  true
                    }
                     else{
                        vm2.bookingForm.$setValidity('attendeeEmail', true);
                        vm2.showEmailError =  false
                    }
                    if (!validPhone){
                        vm2.bookingForm.$setValidity('attendeePhone', false);
                        vm2.showPhoneError =  true
                    }
                    else{
                        vm2.bookingForm.$setValidity('attendeePhone', true);
                        vm2.showPhoneError =  false
                    }
                    // makes sure the form is valid
                    if (vm2.bookingForm.$valid )
                    {
                        vm2.attendeeList.push({
                            "name":vm2.attendeeName,
                            "email":vm2.attendeeEmail,
                            "phone":vm2.attendeePhone,

                        })
                        vm2.attendeeName =  vm2.attendeeEmail = vm2.attendeePhone =  '';
                    }
                }
                else{
                    // notification service to show errors
                    NotifyService.error('Error','You have riched the Attendees Count Limit ')
                }
            }
            vm2.loadAttendeeData= function (attendee) {
                vm2.htmlPopover = $sce.trustAsHtml( attendee.name+'<br>'+attendee.email+'<br>'+attendee.phone+'<br>');
            }
            vm2.deleteAttendee= function (index) {
                vm2.attendeeList.splice(index, 1);
            }
            // handels pressing ok button
            vm2.ok = function () {


                if (vm2.attendeeList.length == vm2.attendeeCount && vm2.validTimeLine && vm2.eventDescription.length != 0 && vm2.eventTitle!=0 ){
                    NotifyService.success('success','The API is static look at the console to see the final result ')


                    var dateForMinDate =vm2.vm.selectedDate
                    var dateForMaxDate =vm2.vm.selectedDate
                    var postItem=  {
                        booking: {
                            date:{
                                time_start:moment(moment(dateForMinDate).format('YYYY-MM-DD')+' ' +vm2.selectedMinValue+':00').unix(),
                                time_end:moment(moment(dateForMaxDate).format('YYYY-MM-DD')+' ' +vm2.selectedMaxValue+':00').unix()

                            },
                            title: vm2.eventTitle,
                            description: vm2.eventDescription,
                            room:$scope.room.name
                        },
                        passes: vm2.attendeeList  ,

                    }

                    console.log(postItem);
                    $http.post('/sendpass',postItem)

                    $uibModalInstance.dismiss('cancel');

                }
                else {
                    var notifyError = ''

                    console.log(vm2)
                    if (vm2.eventDescription.length == 0){

                        vm2.showEventDescriptionError =  true
                        notifyError = 'Please enter Event Description'

                    }
                    else    {

                        vm2.showEventDescriptionError =  false
                    }
                    if (vm2.eventTitle.length == 0){

                        vm2.showEventTitleError =  true
                        notifyError = 'Please enter Event Title'
                    }
                    else    {

                        vm2.showEventTitleError =  false
                    }



                    if (!vm2.validTimeLine){
                        notifyError = 'this room is not available at the selected time'
                    }
                    else if (vm2.attendeeList.length < vm2.attendeeCount){
                        notifyError = 'not all attendees were entered '
                    }
                    else   if (vm2.attendeeList.length > vm2.attendeeCount){
                        notifyError = 'attendees number is less thant attendees entered'

                    }

                    NotifyService.error('error',notifyError)
                }
                refreshSlider();





            }
            //handle pressing cancel button
            vm2.cancel = function () {
                $uibModalInstance.dismiss('cancel');

            }
        };

    }





;


}
RoomBookingCtrl.$inject = ['$http','$scope','$uibModal','$timeout','$sce','NotifyService','NgMap'];
module.exports = RoomBookingCtrl;

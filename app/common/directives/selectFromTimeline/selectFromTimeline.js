'use strict';
// directive to draw canvas with timeline with selection
var selectFromTimeline = function () {
    return {
        restrict: 'E',
        require:  'ngModel',

        link: function(scope, element, attrs) {

            scope.$watch(attrs.ngModel, function(newValue) {


                var room = angular.fromJson(scope.room);
                var canvas = element.parent();

                var ctx = canvas[0].getContext("2d");
                ctx.clearRect(0, 0, 500, 50);

                var startingHour =  moment('2016-01-01 07:00');
                var index = 0;
                var colors = {
                    "red":"red",
                    'green':'green',
                    'black':'black',
                    'yellow':'yellow',
                }
                var drawColor = colors.red;
                var timelineWithSelection ={}
                var startSelecting =  false;
                angular.forEach(room.timeline,function (value,key ) {
                    if (attrs.min == key )
                        startSelecting  = true ;
                    if (attrs.max == key )
                        startSelecting  = false ;

                    if (startSelecting)
                        timelineWithSelection[key]= 'selected'
                    else
                        timelineWithSelection[key]= value


                })
                var room = angular.fromJson(scope.room);
                var canvas = element.parent();
                var ctx = canvas[0].getContext("2d");
                var startingHour =  moment('2016-01-01 07:00');
                var index = 0;
                var colors = {
                    "red":"#E31E2F",
                    'green':'#009547',
                    'black':'black',
                    'yellow':'#FFE900',
                }
                var drawColor = colors.red;
                angular.forEach(room.timeline,function (value,key ) {



                    if (value != 0)
                        drawColor = colors.green;
                    else if (value == 0)
                        drawColor = colors.red;


                    ctx.fillStyle = drawColor;
                    if( index != 48){

                        ctx.fillRect(index*10+10, 0, 10, 20);
                        ctx.fillStyle = colors.black
                        ctx.fillRect((index*10 + 10)-0.5, 16, 1, 4);


                    }



                    if (index%4 == 0){
                        ctx.fillStyle = colors.black;
                        ctx.fillRect((index*10 +10)-1, 12, 2, 8);
                        ctx.fillText(moment('2016-01-01 '+key).format('HH'), index*10 +5, 30)
                        startingHour.add(1, 'hour');

                    }

                    index++;

                })
                index = 0
                angular.forEach(timelineWithSelection,function (value,key ) {



                    if (value == 'selected'){
                        drawColor = colors.yellow;
                        ctx.fillStyle = drawColor;
                        if( index != 48){

                            ctx.fillRect(index*10+10, 0, 10, 10);

                            ctx.fillStyle = colors.black
                            ctx.fillRect((index*10 + 10)-0.5, 16, 1, 4);


                        }



                        if (index%4 == 0){
                            ctx.fillStyle = colors.black;
                            ctx.fillRect((index*10 +10)-1, 12, 2, 8);
                            ctx.fillText(moment('2016-01-01 '+key).format('HH'), index*10 +5, 30)
                            startingHour.add(1, 'hour');

                        }

                    }
                    index++;




                })




            });

        }
    };};

selectFromTimeline.$inject = [ ];
module.exports = selectFromTimeline;
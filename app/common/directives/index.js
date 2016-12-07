'use strict';
// here where u load directives
module.exports = angular.module('common.directives', [])
    .directive('timeline', require('./timeline/timeline.js'))
    .directive('selectFromTimeline', require('./selectFromTimeline/selectFromTimeline.js'))



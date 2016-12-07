'use strict';

// loading my services and exporting them

module.exports = angular.module('common.services', [])
    .service('NotifyService', require('./NotifyService/NotifyService.js'))


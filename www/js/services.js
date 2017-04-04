'use strict';

angular.module('myapp.services', ['ngResource','myapp.config'])
.factory('invoiceFactory', ['$resource', 'API_URL', function ($resource, API_URL) {

    return $resource(API_URL + "invoices/:id", null, {
        'update': {
            method: 'PUT'
        }
    });

}])
.factory('customerFactory', ['$resource', 'API_URL', function ($resource, API_URL) {

    return $resource(API_URL + "customers/:id", null, {
        'update': {
            method: 'PUT'
        }
    });

}])
.factory('employeeFactory', ['$resource', 'API_URL', function ($resource, API_URL) {

    return $resource(API_URL + "employee/:id", null, {
        'update': {
            method: 'PUT'
        }
    });

}]);
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

}])
.service('financialYearService', function () {

    this.getCurrentFinancialYear=function(){
        var currentMonth = moment().format('M');
        var currentYear=moment().format('Y');

        var nextYear=moment().add(1, 'years').format('Y');
        if(currentMonth <= 3) {
            currentYear-=1;
            nextYear-=1;
        }
        var finYear={
                'start_date':moment(currentYear+'-04-01').format('YYYY-MM-DD'),
                'end_date':moment(nextYear+'-03-31').format('YYYY-MM-DD')
        };
        return finYear;
    }

});
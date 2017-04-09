'use strict';

angular.module('myapp.services', ['ngResource','myapp.config'])
.factory('invoiceFactory', ['$http', 'API_URL', function ($http, API_URL) {

    var invoiceFactory = {};

    invoiceFactory.getInvoices = function () {
        return $http.get(API_URL+'InvoiceController/search');
    };

    invoiceFactory.getInvoice = function (id) {
        return $http.get(API_URL + 'InvoiceController/Get&id='+ id);
    };

    invoiceFactory.insertInvoice = function (cust) {
        return $http.post(API_URL, cust);
    };

    invoiceFactory.updateInvoice = function (cust) {
        return $http.put(API_URL + '/' + cust.ID, cust)
    };

    invoiceFactory.deleteInvoice = function (id) {
        return $http.delete(API_URL + '/' + id);
    };

    return invoiceFactory;
}])
.factory('customerFactory', ['$http', 'API_URL', function ($http, API_URL) {

    var customerFactory = {};

    customerFactory.getCustomers = function () {
        return $http.get(API_URL+'CustomerController/search');
    };

    customerFactory.getCustomer = function (id) {
        return $http.get(API_URL + 'CustomerController/Get&id='+ id);
    };

    customerFactory.insertCustomer = function (cust) {
        return $http.post(API_URL, cust);
    };

    customerFactory.updateCustomer = function (cust) {
        return $http.put(API_URL + '/' + cust.ID, cust)
    };

    customerFactory.deleteCustomer = function (id) {
        return $http.delete(API_URL + '/' + id);
    };

    return customerFactory;

}])
.factory('employeeFactory', ['$http', 'API_URL', function ($http, API_URL) {

    var employeeFactory = {};

    employeeFactory.getEmployees = function () {
        return $http.get(API_URL+'EmployeeController/search');
    };

    employeeFactory.getEmployee = function (id) {
        return $http.get(API_URL + 'EmployeeController/Get&id=' + id);
    };

    employeeFactory.insertEmployee = function (cust) {
        return $http.post(API_URL, cust);
    };

    employeeFactory.updateEmployee = function (cust) {
        return $http.put(API_URL + '/' + cust.ID, cust)
    };

    employeeFactory.deleteEmployee = function (id) {
        return $http.delete(API_URL + '/' + id);
    };

    return employeeFactory;

}])
.factory('dashboardFactory', ['$http', 'API_URL', function ($http, API_URL) {

    var dashboardFactory = {};

    dashboardFactory.getDashboardData = function () {
        return $http.get(API_URL+'DashboardController/Get');
    };

    return dashboardFactory;

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

})
.factory('loadingFactory',['$ionicLoading',  function ($ionicLoading) {
    var loadingFactory={};

    loadingFactory.showLoader=function(message){
        $ionicLoading.show({
            template: '<ion-spinner></ion-spinner> '+message
        });
        console.log(message+" show");
    };

     loadingFactory.hideLoader=function(message){
        $ionicLoading.hide();
        console.log(" hide");
    };

    return loadingFactory;
}]);

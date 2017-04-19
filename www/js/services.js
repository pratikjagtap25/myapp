'use strict';

angular.module('myapp.services', ['ngResource','myapp.config'])
.factory('loginFactory', ['$http', 'API_URL','$localStorage','$httpParamSerializerJQLike','$q',
                        function ($http, API_URL,$localStorage,$httpParamSerializerJQLike,$q) {

    var loginFactory = {};

     var transform = function(data){
        return $httpParamSerializerJQLike(data);
    }
    loginFactory.authenticateUser = function (loginData) {
        return $http.post(API_URL+'UserController/Login', loginData,
                {
                    headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'},
                    transformRequest: transform
                }
            )
            .then (function(response, status, headers, config){
                if(response.data.data!=null)
                    {
                        var response_data=response.data.data;
                        var userDetails={
                                        'first_name':response_data.first_name,
                                        'last_name':response_data.last_name,
                                        'user_id':response_data.user_id,
                                        'employee_id':response_data.employee_id,
                                        'company_id':response_data.company_id,
                                        'photo': response_data.photo,
                                        'designation': response_data.designation,
                                        'gender':response_data.gender,
                                        'login_time':new Date()
                                        };

                        $localStorage.setObject('userDetails',{});

                        $localStorage.setObject('userDetails',userDetails);    

                        return {loginSuccess:true};
                    }
                    else
                    {
                        return {loginSuccess:false};
                    }
            }, function(data, status, headers, config) {
                return data;
            })
    };

    loginFactory.isAuthenticated=function(){
        return (!!$localStorage.getObject('userDetails',null)) ? true : false;
    };

    loginFactory.logoutUser=function(){
         
        return $localStorage.remove('userDetails');
    };

    loginFactory.userInfo=function(){
         
        return $localStorage.getObject('userDetails',null);
    };    

    return loginFactory;
}])
.factory('invoiceFactory', ['$http', 'API_URL', function ($http, API_URL) {

    var invoiceFactory = {};

    invoiceFactory.getInvoices = function (current_financial_year) {
        return $http.get(API_URL+'InvoiceController/search&year_id='+current_financial_year);
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

    dashboardFactory.getDashboardData = function (selected_financial_year) {
        return $http.get(API_URL+'DashboardController/Get&year_id='+selected_financial_year);
    };

    return dashboardFactory;

}])
.service('financialYearFactory', ['$http', 'API_URL', function ($http, API_URL) {

    var financialYearFactory={};

    financialYearFactory.getCurrentFinancialYear=function(){
        return $http.get(API_URL+'FinancialYearController/search&is_current_year=1');
    };


    financialYearFactory.getFinancialYears= function () {
        return $http.get(API_URL+'FinancialYearController/search');
    };

    financialYearFactory.getFinancialYear = function (id) {
        return $http.get(API_URL + 'FinancialYearController/Get&id=' + id);
    };
    
    return financialYearFactory;
}])
.factory('taxationFactory', ['$http', 'API_URL', function ($http, API_URL) {

    var taxationFactory = {};

    taxationFactory.getTaxationList = function () {
        return $http.get(API_URL+'TaxationController/search');
    };

    taxationFactory.getTaxDetails = function (id) {
        return $http.get(API_URL + 'CustomerController/Get&id='+ id);
    };

    taxationFactory.insertTaxDetails = function (cust) {
        return $http.post(API_URL, cust);
    };

    taxationFactory.updateTaxDetails= function (cust) {
        return $http.put(API_URL + '/' + cust.ID, cust)
    };

    taxationFactory.deleteTaxDetails = function (id) {
        return $http.delete(API_URL + '/' + id);
    };

    return taxationFactory;

}])
.factory('yearSummaryFactory', ['$http', 'API_URL','invoiceFactory','taxationFactory', 
                        function ($http, API_URL,invoiceFactory,taxationFactory) {

    var yearSummaryFactory = {};

    taxationFactory.getTaxationList = function () {
        return $http.get(API_URL+'TaxationController/search');
    };

    return taxationFactory;

}])
.factory('loadingFactory',['$ionicLoading',  function ($ionicLoading) {
    var loadingFactory={};

    loadingFactory.showLoader=function(message){
        $ionicLoading.show({
            template: '<ion-spinner></ion-spinner> '+message
        });
    };

     loadingFactory.hideLoader=function(message){
        $ionicLoading.hide();
    };

    return loadingFactory;
}])
.factory('$localStorage',['$window',function($window){
    return {
            set:function(key,value){
                $window.localStorage[key]=value;
            },
            get:function(key,defaultValue){
                return $window.localStorage[key] || defaultValue;
            },
            setObject:function(key,value){
                $window.localStorage[key]=JSON.stringify(value);
            },
            getObject:function(key,defaultValue){
                return JSON.parse($window.localStorage[key] || defaultValue);
            },
            remove:function(key){
              $window.localStorage.removeItem(key);  
            }
        }
}]);

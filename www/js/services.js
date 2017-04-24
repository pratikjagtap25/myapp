'use strict';

angular.module('myapp.services', ['ngResource','myapp.config'])
.factory('loginFactory', ['$http', 'API_URL','$localStorage','$httpParamSerializerJQLike','$q',
                        function ($http, API_URL,$localStorage,$httpParamSerializerJQLike,$q) {

    var loginFactory = {};

    var transform = function(data){
        return $httpParamSerializerJQLike(data);
    }

    var headersObj={ headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'}, transformRequest: transform };

    loginFactory.authenticateUser = function (loginData) {
        return $http.post(API_URL+'UserController/Login', loginData,headersObj)
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
.factory('invoiceFactory', ['$http', 'API_URL','$httpParamSerializerJQLike', function ($http, API_URL,$httpParamSerializerJQLike) {

    var invoiceFactory = {};

    var transform = function(data){
        return $httpParamSerializerJQLike(data);
    }

    var headersObj={ headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'}, transformRequest: transform };

    invoiceFactory.getInvoices = function (current_financial_year) {
        return $http.get(API_URL+'InvoiceController/search&year_id='+current_financial_year);
    };

    invoiceFactory.getInvoice = function (id) {
        return $http.get(API_URL + 'InvoiceController/Get&id='+ id);
    };

    invoiceFactory.insertInvoice = function (invoiceInfo) {
        return $http.post(API_URL+'InvoiceController/Create', invoiceInfo,headersObj)
            .then (function(response, status, headers, config){
                if(response.data.data!=null)
                    {
                        return {insertSuccess:true};
                    }
                    else
                    {
                        return {insertSuccess:false};
                    }
            }, function(data, status, headers, config) {
                return data;
            });
    };

    invoiceFactory.updateInvoice = function (invoiceInfo) {
        return $http.post(API_URL+'InvoiceController/Update&id='+invoiceInfo.id, invoiceInfo,headersObj)
            .then (function(response, status, headers, config){
                if(response.data.data!=null)
                    {
                        return {updateSuccess:true};
                    }
                    else
                    {
                        return {updateSuccess:false};
                    }
            }, function(data, status, headers, config) {
                return data;
            });
    };

    invoiceFactory.deleteInvoice = function (id) {
        return $http.delete(API_URL + '/' + id);
    };

    return invoiceFactory;
}])
.factory('customerFactory', ['$http', 'API_URL','$httpParamSerializerJQLike', function ($http, API_URL,$httpParamSerializerJQLike) {

    var customerFactory = {};

    var transform = function(data){
        return $httpParamSerializerJQLike(data);
    }

    var headersObj={ headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'}, transformRequest: transform };
    
    customerFactory.getCustomers = function () {
        return $http.get(API_URL+'CustomerController/search');
    };

    customerFactory.getCustomer = function (id) {
        return $http.get(API_URL + 'CustomerController/Get&id='+ id);
    };

    customerFactory.insertCustomer = function (cust) {
        return $http.post(API_URL+'CustomerController/Create', customerInfo,headersObj)
            .then (function(response, status, headers, config){
                if(response.data.data!=null)
                    {
                        return {insertSuccess:true};
                    }
                    else
                    {
                        return {insertSuccess:false};
                    }
            }, function(data, status, headers, config) {
                return data;
            });
    };

    customerFactory.updateCustomer = function (customerInfo) {
        return $http.post(API_URL+'CustomerController/Update&id='+customerInfo, customerInfo,headersObj)
            .then (function(response, status, headers, config){
                if(response.data.data!=null)
                    {
                        return {updateSuccess:true};
                    }
                    else
                    {
                        return {updateSuccess:false};
                    }
            }, function(data, status, headers, config) {
                return data;
            });
    };

    customerFactory.deleteCustomer = function (id) {
        return $http.delete(API_URL + '/' + id);
    };

    return customerFactory;

}])
.factory('employeeFactory', ['$http', 'API_URL','$httpParamSerializerJQLike', function ($http, API_URL,$httpParamSerializerJQLike) {

    var employeeFactory = {};

    var transform = function(data){
        return $httpParamSerializerJQLike(data);
    }

    var headersObj={ headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'}, transformRequest: transform };

    employeeFactory.getEmployees = function () {
        return $http.get(API_URL+'EmployeeController/search');
    };

    employeeFactory.getEmployee = function (id) {
        return $http.get(API_URL + 'EmployeeController/Get&id=' + id);
    };

    employeeFactory.insertEmployee = function (employeeInfo) {
        return $http.post(API_URL+'EmployeeController/Create', employeeInfo,headersObj)
            .then (function(response, status, headers, config){
                if(response.data.data!=null)
                    {
                        return {insertSuccess:true};
                    }
                    else
                    {
                        return {insertSuccess:false};
                    }
            }, function(data, status, headers, config) {
                return data;
            });
    };

    employeeFactory.updateEmployee = function (employeeInfo) {
       return $http.post(API_URL+'EmployeeController/Update&id='+employeeInfo.id, employeeInfo,headersObj)
            .then (function(response, status, headers, config){
                if(response.data.data!=null)
                    {
                        return {updateSuccess:true};
                    }
                    else
                    {
                        return {updateSuccess:false};
                    }
            }, function(data, status, headers, config) {
                return data;
            });
    };

    employeeFactory.deleteEmployee = function (id) {
        return $http.delete(API_URL + '/' + id);
    };

    return employeeFactory;

}])
.factory('companyFactory', ['$http', 'API_URL','$httpParamSerializerJQLike', function ($http, API_URL,$httpParamSerializerJQLike) {

    var companyFactory = {};

    var transform = function(data){
        return $httpParamSerializerJQLike(data);
    }

    var headersObj={ headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'}, transformRequest: transform };

    companyFactory.getCompanies = function () {
        return $http.get(API_URL+'CompanyController/search');
    };

    companyFactory.getCompanyInfo = function (id) {
        return $http.get(API_URL + 'CompanyController/Get&id='+ id);
    };

    companyFactory.updateCompanyInfo = function (companyInfo) {
        return $http.post(API_URL+'CompanyController/Update&id='+companyInfo.company_id, companyInfo,headersObj)
            .then (function(response, status, headers, config){
                if(response.data.data!=null)
                    {
                        return {updateSuccess:true};
                    }
                    else
                    {
                        return {updateSuccess:false};
                    }
            }, function(data, status, headers, config) {
                return data;
            });
    };

    return companyFactory;

}])
.factory('dashboardFactory',['$http', 'API_URL','$httpParamSerializerJQLike', function ($http, API_URL,$httpParamSerializerJQLike) {

    var dashboardFactory = {};

    dashboardFactory.getDashboardData = function (selected_financial_year) {
        return $http.get(API_URL+'DashboardController/Get&year_id='+selected_financial_year);
    };

    return dashboardFactory;

}])
.service('financialYearFactory', ['$http', 'API_URL','$httpParamSerializerJQLike', function ($http, API_URL,$httpParamSerializerJQLike) {

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
.factory('taxationFactory', ['$http', 'API_URL','$httpParamSerializerJQLike', function ($http, API_URL,$httpParamSerializerJQLike) {

    var taxationFactory = {};

    var transform = function(data){
        return $httpParamSerializerJQLike(data);
    }

    var headersObj={ headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'}, transformRequest: transform };

    taxationFactory.getTaxationList = function () {
        return $http.get(API_URL+'TaxationController/search');
    };

    taxationFactory.getTaxDetails = function (id) {
        return $http.get(API_URL + 'TaxationController/Get&id='+ id);
    };

    taxationFactory.insertTaxDetails = function (taxInfo) {
        return $http.post(API_URL+'TaxationController/Create', taxInfo,headersObj)
            .then (function(response, status, headers, config){
                if(response.data.data!=null)
                    {
                        return {insertSuccess:true};
                    }
                    else
                    {
                        return {insertSuccess:false};
                    }
            }, function(data, status, headers, config) {
                return data;
            });
    };

    taxationFactory.updateTaxDetails= function (cust) {
       return $http.post(API_URL+'TaxationController/Update&id='+taxInfo.id, taxInfo,headersObj)
            .then (function(response, status, headers, config){
                if(response.data.data!=null)
                    {
                        return {updateSuccess:true};
                    }
                    else
                    {
                        return {updateSuccess:false};
                    }
            }, function(data, status, headers, config) {
                return data;
            });
    };

    taxationFactory.deleteTaxDetails = function (id) {
        return $http.delete(API_URL + '/' + id);
    };

    return taxationFactory;

}])
.factory('paymentInfoFactory',['$http', 'API_URL','$httpParamSerializerJQLike', function ($http, API_URL,$httpParamSerializerJQLike) {

    var paymentInfoFactory = {};

    var transform = function(data){
        return $httpParamSerializerJQLike(data);
    }

    var headersObj={ headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'}, transformRequest: transform };

    paymentInfoFactory.getInvoicePaymentList = function (paymentInfo) {
        return $http.get(API_URL+'TaxationController/search&bill_no='+paymentInfo.bill_no);
    };

    paymentInfoFactory.getPaymentDetails = function (id) {
        return $http.get(API_URL + 'TaxationController/Get&id='+ id);
    };

    paymentInfoFactory.insertPaymentInfo = function (paymentInfo) {
        return $http.post(API_URL+'TaxationController/Create', paymentInfo,headersObj)
            .then (function(response, status, headers, config){
                if(response.data.data!=null)
                    {
                        return {insertSuccess:true};
                    }
                    else
                    {
                        return {insertSuccess:false};
                    }
            }, function(data, status, headers, config) {
                return data;
            });
    };

    paymentInfoFactory.updatePaymentInfo= function (paymentInfo) {
       return $http.post(API_URL+'TaxationController/Update&id='+paymentInfo.id, paymentInfo,headersObj)
            .then (function(response, status, headers, config){
                if(response.data.data!=null)
                    {
                        return {updateSuccess:true};
                    }
                    else
                    {
                        return {updateSuccess:false};
                    }
            }, function(data, status, headers, config) {
                return data;
            });
    };

    paymentInfoFactory.deletePaymentInfo = function (id) {
        return $http.delete(API_URL + '/' + id);
    };

    return paymentInfoFactory;

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

    loadingFactory.showLoader=function(message=""){
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

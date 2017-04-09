angular.module('myapp.controllers', ['myapp.config'])

.controller('AppCtrl', function($scope,$rootScope, $ionicModal, $timeout) {

  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //$scope.$on('$ionicView.enter', function(e) {
  //});

  // Form data for the login modal
  $scope.loginData = {};

  // Create the login modal that we will use later
  $ionicModal.fromTemplateUrl('templates/login.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.modal = modal;
  });

  // Triggered in the login modal to close it
  $scope.closeLogin = function() {
    $scope.modal.hide();
  };

  // Open the login modal
  $scope.login = function() {
    $scope.modal.show();
  };

  // Perform the login action when the user submits the login form
  $scope.doLogin = function() {
    console.log('Doing login', $scope.loginData);

    // Simulate a login delay. Remove this and replace with your login
    // code if using a login system
    $timeout(function() {
      $scope.closeLogin();
    }, 1000);
  };
})

.controller('PlaylistsCtrl', function($scope) {
  $scope.playlists = [
    { title: 'Reggae', id: 1 },
    { title: 'Chill', id: 2 },
    { title: 'Dubstep', id: 3 },
    { title: 'Indie', id: 4 },
    { title: 'Rap', id: 5 },
    { title: 'Cowbell', id: 6 }
  ];
})

.controller('InvoiceCtrl',['$scope', 'invoiceFactory','$ionicModal','$timeout','$ionicListDelegate','financialYearService','loadingFactory',
                  function($scope, invoiceFactory,$ionicModal,$timeout,$ionicListDelegate,financialYearService,loadingFactory) {
  $scope.message="";

  $scope.invoice={};
  
  $scope.invoiceHeader="Add Invoice";

  $scope.invoiceButtonText="Add";

  var financialYear=financialYearService.getCurrentFinancialYear();

  //$scope.dateFrom=financialYear.start_date;

  //$scope.dateTo=financialYear.end_date;

  $scope.dateFrom="";

  $scope.dateTo="";  

  $ionicModal.fromTemplateUrl('templates/manageInvoice.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.invoiceModal = modal;
  });

  $scope.showInvoiceModel=function(){
    $scope.invoiceModal.show();
  };

  $scope.closeInvoiceModel=function(){
    $scope.invoiceModal.hide();

    $scope.invoice={};

    $scope.invoiceHeader="Add Invoice";
  };

  $scope.addNewInvoice=function(){
    $scope.showInvoiceModel();

    $ionicListDelegate.closeOptionButtons();
  };

  $scope.editInvoice=function(invoice){
    $scope.invoice=invoice;

    $scope.invoiceHeader="Edit Invoice";

    $scope.invoiceButtonText="Save";

    $ionicListDelegate.closeOptionButtons();

    $scope.showInvoiceModel();
  };

  loadingFactory.showLoader("Loading");

  invoiceFactory.getInvoices()
      .then(function (response) {
          $scope.invoices = response.data.data;

          loadingFactory.hideLoader();
      }, function (error) {
          $scope.status = 'Unable to load customer data: ' + error.message;

          loadingFactory.hideLoader();
      });

  $scope.clearSearch=function(){
    $scope.searchFilter="";
  };
}])
.controller('InvoiceDetailCtrl',['$scope', 'invoiceFactory','$stateParams','loadingFactory',
                                function($scope, invoiceFactory,$stateParams,loadingFactory) {
  $scope.message="";

  loadingFactory.showLoader("Loading");

  invoiceFactory.getInvoice(parseInt($stateParams.id,10))
    .then(function (response) {
        $scope.invoiceDetail = response.data.data;

        loadingFactory.hideLoader();

    }, function (error) {
        $scope.status = 'Unable to load customer data: ' + error.message;

        loadingFactory.hideLoader();
    });
  
}])
.controller('CustomerCtrl',['$scope','customerFactory','$ionicModal','$timeout','$ionicListDelegate','loadingFactory',
          function($scope,customerFactory,$ionicModal,$timeout,$ionicListDelegate,loadingFactory){
  $scope.customer={};
  
  $scope.customerHeader="Add Customer";

  $scope.customerButtonText="Add";

  $ionicModal.fromTemplateUrl('templates/manageCustomer.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.customerModal = modal;
  });

  $scope.showCustomerModel=function(){
    $scope.customerModal.show();
  };

  $scope.closeCustomerModel=function(){
    $scope.customerModal.hide();

    $scope.customer={};

    $scope.customerHeader="Add Customer";
  };

  $scope.addNewCustomer=function(){
    $scope.showCustomerModel();

    $ionicListDelegate.closeOptionButtons();
  };

  $scope.editCustomer=function(customer){
    $scope.customer=customer;

    $scope.customerHeader="Edit Customer";

    $scope.customerButtonText="Save";

    $ionicListDelegate.closeOptionButtons();

    $scope.showCustomerModel();
  };

  loadingFactory.showLoader("Loading");

  customerFactory.getCustomers()
      .then(function (response) {
          $scope.customers = response.data.data;

          loadingFactory.hideLoader();
      }, function (error) {
          $scope.status = 'Unable to load customer data: ' + error.message;

          loadingFactory.hideLoader();
      });        
  
}])
.controller('CustomerDetailCtrl',['$scope', 'customerFactory','$stateParams','loadingFactory',
                        function($scope, customerFactory,$stateParams,loadingFactory) {
  $scope.message="";
  
  loadingFactory.showLoader("Loading");

  customerFactory.getCustomer(parseInt($stateParams.id,10))
    .then(function (response) {
        $scope.customerDetail = response.data.data;

        loadingFactory.hideLoader();
    }, function (error) {
        $scope.status = 'Unable to load customer data: ' + error.message;

        loadingFactory.hideLoader();
    });

}])
.controller('EmployeeCtrl',['$scope','employeeFactory','$ionicModal','$timeout','$ionicListDelegate','loadingFactory',
                  function($scope,employeeFactory,$ionicModal,$timeout,$ionicListDelegate,loadingFactory){
  $scope.employee={};
  
  $scope.employeeHeader="Add Employee";

  $scope.employeeButtonText="Add";

  $ionicModal.fromTemplateUrl('templates/manageEmployee.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.employeeModal = modal;
  });

  $scope.showEmployeeModel=function(){
    $scope.employeeModal.show();
  };

  $scope.closeEmployeeModel=function(){
    $scope.employeeModal.hide();

    $scope.employee={};

    $scope.employeeHeader="Add Employee";
  };

  $scope.addNewEmployee=function(){
    $scope.showEmployeeModel();

    $ionicListDelegate.closeOptionButtons();
  };

  $scope.editEmployee=function(employee){
    $scope.employee=employee;

    $scope.employeeHeader="Edit Employee";

    $scope.employeeButtonText="Save";

    $ionicListDelegate.closeOptionButtons();

    $scope.showEmployeeModel();
  };

  loadingFactory.showLoader("Loading");

  employeeFactory.getEmployees()
      .then(function (response) {
          $scope.employees = response.data.data;

          loadingFactory.hideLoader();

      }, function (error) {
          $scope.status = 'Unable to load customer data: ' + error.message;

          loadingFactory.hideLoader();
      });          
  


}])
.controller('EmployeeDetailCtrl',['$scope', 'employeeFactory','$stateParams','loadingFactory',
                          function($scope, employeeFactory,$stateParams,loadingFactory) {
  $scope.message="";
  
  loadingFactory.showLoader("Loading");

  employeeFactory.getEmployee(parseInt($stateParams.id,10))
    .then(function (response) {
        $scope.employeeDetail = response.data.data;
        loadingFactory.hideLoader();
    }, function (error) {
        $scope.status = 'Unable to load customer data: ' + error.message;
        loadingFactory.hideLoader();
    });

}])
.controller('DashboardCtrl',['$scope', 'dashboardFactory','$stateParams','loadingFactory',
                                function($scope, dashboardFactory,$stateParams,loadingFactory) {
  $scope.message="";

  loadingFactory.showLoader("Loading");

  dashboardFactory.getDashboardData()
    .then(function (response) {
        $scope.dashboardData = response.data.data;

        loadingFactory.hideLoader();

    }, function (error) {
        $scope.status = 'Unable to load customer data: ' + error.message;

        loadingFactory.hideLoader();
    });
  
}])

.directive('formattedDate', function(dateFilter) {
  return {
    require: 'ngModel',
    scope: {
      format: "@"
    },
    link: function(scope, element, attrs, ngModelController) {
      ngModelController.$parsers.push(function(data) {
        //convert data from view format to model format
        return dateFilter(data, scope.format); //converted
      });

      ngModelController.$formatters.push(function(data) {
        //convert data from model format to view format
        return dateFilter(data, scope.format); //converted
      });
    }
  }
})
.filter('titleCase', function() {
    return function(input) {
      input = input || '';
      return input.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
    };
  })
.filter('myfilter', function($filter) {
    return function(items, startDate, endDate) {
            var filteredArray = [];

            if (!startDate && !endDate) {
              return items;
            }

            if(startDate=="" || endDate=="")
            {
              return items;
            }

              angular.forEach(items, function(obj){
                  var invoiceDate = obj.invoice_date;        
                  if(moment(invoiceDate).isAfter(startDate) && moment(invoiceDate).isBefore(endDate)) {
                      filteredArray.push(obj);
                  }
              });

              return filteredArray;
      };
  });

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

.controller('InvoiceCtrl',['$scope', 'invoiceFactory','$ionicModal','$timeout','$ionicListDelegate','financialYearService',
                  function($scope, invoiceFactory,$ionicModal,$timeout,$ionicListDelegate,financialYearService) {
  $scope.message="";

  $scope.invoice={};
  
  $scope.invoiceHeader="Add Invoice";

  $scope.invoiceButtonText="Add";

  var financialYear=financialYearService.getCurrentFinancialYear();

  $scope.dateFrom=financialYear.start_date;

  $scope.dateTo=financialYear.end_date;

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

  invoiceFactory.query(
      function(response){
        $scope.invoices=response;
      },
      function(response){
        $scope.message = "Error: "+response.status + " " + response.statusText;
      }
  );
}])
.controller('InvoiceDetailCtrl',['$scope', 'invoiceFactory','$stateParams',function($scope, invoiceFactory,$stateParams) {
  $scope.message="";
  
  invoiceFactory.get({id:parseInt($stateParams.id,10)}).$promise.then(
        function(response){
            $scope.invoiceDetail = response;
        },
        function(response) {
            $scope.message = "Error: "+response.status + " " + response.statusText;
        }
    );
}])
.controller('CustomerCtrl',['$scope','customerFactory','$ionicModal','$timeout','$ionicListDelegate',
          function($scope,customerFactory,$ionicModal,$timeout,$ionicListDelegate){
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

        
  customerFactory.query(
      function(response){
        $scope.customers=response;
      },
      function(response){
        $scope.message = "Error: "+response.status + " " + response.statusText;
      }
  );

}])
.controller('CustomerDetailCtrl',['$scope', 'customerFactory','$stateParams',function($scope, customerFactory,$stateParams) {
  $scope.message="";
  
  customerFactory.get({id:parseInt($stateParams.id,10)}).$promise.then(
        function(response){
            $scope.customerDetail = response;
        },
        function(response) {
            $scope.message = "Error: "+response.status + " " + response.statusText;
        }
    );
}])
.controller('EmployeeCtrl',['$scope','employeeFactory','$ionicModal','$timeout','$ionicListDelegate',
          function($scope,employeeFactory,$ionicModal,$timeout,$ionicListDelegate){
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

        
  employeeFactory.query(
      function(response){
        $scope.employees=response;
      },
      function(response){
        $scope.message = "Error: "+response.status + " " + response.statusText;
      }
  );

}])
.controller('EmployeeDetailCtrl',['$scope', 'employeeFactory','$stateParams',function($scope, employeeFactory,$stateParams) {
  $scope.message="";
  
  employeeFactory.get({id:parseInt($stateParams.id,10)}).$promise.then(
        function(response){
            $scope.employeeDetail = response;
        },
        function(response) {
            $scope.message = "Error: "+response.status + " " + response.statusText;
        }
    );
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

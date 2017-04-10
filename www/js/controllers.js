angular.module('myapp.controllers', ['myapp.config'])

.controller('AppCtrl', ['$scope', '$rootScope','loginFactory','$timeout','$state','loadingFactory',
                function($scope,$rootScope,loginFactory,$timeout,$state,loadingFactory) {

  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //$scope.$on('$ionicView.enter', function(e) {
  //});

  $scope.isLoggedIn=loginFactory.isAuthenticated();

  $scope.userInfo=loginFactory.userInfo();

  $scope.logoutUser=function(){
    loadingFactory.showLoader("Logging out");

    loginFactory.logoutUser();

    $timeout(function() {
          loadingFactory.hideLoader();
    }, 1000);

    $state.go('app.login');
  };

}])

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
.controller('LoginCtrl', ['$scope', '$ionicSideMenuDelegate','loginFactory','loadingFactory','$localStorage','$state','$ionicViewService',
                  function($scope,$ionicSideMenuDelegate,loginFactory,loadingFactory,$localStorage,$state,$ionicViewService) {

  $ionicSideMenuDelegate.canDragContent(false);

  $scope.loginData = {'username':'PratikJ','password':'1112233'};

  $scope.doLogin = function(loginData) {

    loadingFactory.showLoader("Loading");

    loginFactory.authenticateUser($scope.loginData)
    .then(function (response) {

      $ionicViewService.nextViewOptions({
        disableBack: true
      });

      $scope.loginData = {};

      loadingFactory.hideLoader();

      $state.go('app.dashboard');

    }, function (error) {
        $scope.status = 'Unable to load customer data: ' + error.message;
        loadingFactory.hideLoader();
    });
  };

}])
.controller('InvoiceCtrl',['$scope', 'invoiceFactory','$ionicModal','$timeout','$ionicListDelegate','financialYearFactory','loadingFactory',
                  function($scope, invoiceFactory,$ionicModal,$timeout,$ionicListDelegate,financialYearFactory,loadingFactory) {
  $scope.message="";

  $scope.invoice={};
  
  $scope.invoiceHeader="Add Invoice";

  $scope.invoiceButtonText="Add";

  $scope.invoiceFilter={};

  $scope.financialYearList={};

  var financialYear=financialYearFactory.getCurrentFinancialYear();

  financialYearFactory.getFinancialYears()
    .then(function (response) {
        $scope.financialYearList = response.data.data;

        loadingFactory.hideLoader();
      }, function (error) {
        $scope.status = 'Unable to load customer data: ' + error.message;
  });
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

  /*$ionicModal.fromTemplateUrl('invoiceFilter.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.invoiceFilterModal = modal;
  });

  $scope.showInvoiceFilter=function(){
    $scope.invoiceFilterModal.show();
  };

  $scope.closeInvoiceFilter=function(){
    $scope.invoiceFilterModal.hide();

    $scope.invoiceFilter={};
  };*/

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
.controller('DashboardCtrl',['$scope', 'dashboardFactory','$stateParams','loadingFactory','financialYearFactory','$ionicModal',
                                function($scope, dashboardFactory,$stateParams,loadingFactory,financialYearFactory,$ionicModal) {
  $scope.message="";

  var currentFinancialYear=financialYearFactory.getCurrentFinancialYear();

  $scope.financial_year_start_date = currentFinancialYear.start_date;

  $scope.financial_year_end_date = currentFinancialYear.end_date;

  $scope.selected_financial_year=1;

  loadingFactory.showLoader("Loading");

  dashboardFactory.getDashboardData()
    .then(function (response) {
        $scope.dashboardData = response.data.data;
        $scope.dashboardData.tax_payments=10;
        loadingFactory.hideLoader();

    }, function (error) {
        $scope.status = 'Unable to load customer data: ' + error.message;

        loadingFactory.hideLoader();
    });
    
    financialYearFactory.getFinancialYears()
      .then(function (response) {
          $scope.financialYearList = response.data.data;

        }, function (error) {
          $scope.status = 'Unable to load customer data: ' + error.message;
    });

    $ionicModal.fromTemplateUrl('templates/selectFinancialYear.html', {
      scope: $scope
    }).then(function(modal) {
      $scope.financialYearModal = modal;
    });

    $scope.changeFinancialYear=function(){
      $scope.financialYearModal.show();
    };

    $scope.closeFinancialYearModal=function(){
      $scope.financialYearModal.hide();
    };
  
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

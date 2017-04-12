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
.controller('InvoiceCtrl',['$scope','$rootScope' ,'invoiceFactory','$ionicModal','$timeout','$ionicListDelegate','financialYearFactory','loadingFactory','$ionicPopup',
                  function($scope,$rootScope, invoiceFactory,$ionicModal,$timeout,$ionicListDelegate,financialYearFactory,loadingFactory,$ionicPopup) {
  $scope.message="";

  $scope.invoice={};

  $scope.searchFilter="";
  
  $scope.invoiceHeader="Add Invoice";

  $scope.invoiceButtonText="Add";

  $scope.financialYearList={};

  $scope.currentFinancialYear={};

  $scope.selected_financial_year="";

  $scope.year_data={
    value:""
  };

  $scope.paymentEntry={
    id:"",
    bill_id:"",
    bill_no:"",
    company_id:1,
    payment_type:"",
    cheque_no:"",
    cheque_date:"",
    bank_name:"",
    payment_date:"",
    amount:"",
    invoice_amount:""
  };

  $timeout(function() {
          $scope.financial_year_start_date=$rootScope.financial_year_start_date;

          $scope.financial_year_end_date=$rootScope.financial_year_end_date;

          $scope.current_financial_year=$rootScope.current_financial_year;

          $scope.selected_financial_year=$rootScope.current_financial_year;

          $scope.financial_year_title=$rootScope.financial_year_title;

          $scope.year_data.value=$scope.selected_financial_year;

          $scope.getInvoiceData($scope.current_financial_year);
    }, 1000);

  financialYearFactory.getFinancialYears()
    .then(function (response) {
        $scope.financialYearList = response.data.data;

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

    //$ionicListDelegate.closeOptionButtons();
  };

  $scope.editInvoice=function(invoice){
    $scope.invoice=invoice;

    $scope.invoiceHeader="Edit Invoice";

    $scope.invoiceButtonText="Save";

    //$ionicListDelegate.closeOptionButtons();

    $scope.showInvoiceModel();
  };

  $scope.calculateAmount=function(){
    if($scope.invoice.gross_amount!="" && $scope.invoice.service_tax!="")
    {
      var tax_amount=(parseFloat($scope.invoice.gross_amount)*parseFloat($scope.invoice.service_tax))/100;
      var total_amount=parseFloat($scope.invoice.gross_amount)+parseFloat(tax_amount);

      $scope.invoice.service_tax_amount=tax_amount;

      $scope.invoice.net_amount=total_amount;
    }
  };
  loadingFactory.showLoader("Loading");

  $scope.getInvoiceData=function(current_financial_year){
    invoiceFactory.getInvoices(current_financial_year)
      .then(function (response) {
          $scope.invoices = response.data.data;

          loadingFactory.hideLoader();
      }, function (error) {
          $scope.status = 'Unable to load customer data: ' + error.message;

          loadingFactory.hideLoader();
      });
  };
  
  $scope.clearSearch=function(){
    $scope.searchFilter="";
  };

    $scope.changeFinancialYear=function(){
      //$scope.financialYearModal.show();
      // An elaborate, custom popup

      $scope.changed_financial_year=$scope.selected_financial_year;

      var myPopup = $ionicPopup.show({
        template: '<ion-radio ng-repeat="option in financialYearList" ng-value="option.id" ng-model="year_data.value"> {{ option.year_title }} </ion-radio>',
        title: 'Select Financial Year',
        scope: $scope,
        cssClass:'finYearPopup',
        buttons: [
          { text: 'Cancel' },
          {
            text: '<b>Apply</b>',
            type: 'button-assertive',
            onTap: function(e) {
             $scope.applyYearFilter();
            }
          }
        ]
      });
    };

  $scope.applyYearFilter=function(){

    loadingFactory.showLoader("");

    var radionSelectedYear=$scope.financialYearList.filter(function(item) {
        return item.id === $scope.year_data.value;
    })[0];

    $scope.financial_year_title=radionSelectedYear.year_title;

    $scope.getInvoiceData($scope.year_data.value);
  };


  $ionicModal.fromTemplateUrl('templates/paymentEntry.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.paymentEntryModal = modal;
  });

  $scope.showPaymentEntryModel=function(invoice){

    $scope.paymentEntry.bill_no=invoice.bill_no;

    $scope.paymentEntry.invoice_amount=invoice.net_amount;

    $scope.paymentEntry.bill_id=invoice.id;

    $scope.paymentEntryModal.show();
  };

  $scope.closePaymentEntryModel=function(){
    $scope.paymentEntryModal.hide();

    $scope.paymentEntry={};

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
.controller('DashboardCtrl',['$scope','$rootScope' ,'dashboardFactory','$stateParams','loadingFactory','financialYearFactory','$ionicModal','$timeout','$ionicPopup',
                                function($scope,$rootScope, dashboardFactory,$stateParams,loadingFactory,financialYearFactory,$ionicModal,$timeout,$ionicPopup) {
  $scope.message="";

  loadingFactory.showLoader("Loading");

  $scope.invoiced_amount="00.00";

  $scope.received_amount="00.00";

  $scope.outstanding_amount="00.00";

  $scope.currentFinancialYear={};

  $scope.selected_financial_year="";

  $scope.year_data={
    value:""
  };

  $timeout(function() {
          $scope.financial_year_start_date=$rootScope.financial_year_start_date;

          $scope.financial_year_end_date=$rootScope.financial_year_end_date;

          $scope.current_financial_year=$rootScope.current_financial_year;

          $scope.selected_financial_year=$rootScope.current_financial_year;

          $scope.financial_year_title=$rootScope.financial_year_title;

          $scope.year_data.value=$scope.selected_financial_year;

          $scope.getDashboardData();
    }, 1000);

  $scope.getDashboardData=function(){
    dashboardFactory.getDashboardData()
    .then(function (response) {
        $scope.dashboardData = response.data.data;
        $scope.dashboardData.tax_payments=10;

        $scope.invoiced_amount="1800000";
        $scope.received_amount="1100000";
        $scope.outstanding_amount="900000";
        loadingFactory.hideLoader();

    }, function (error) {
        $scope.status = 'Unable to load customer data: ' + error.message;

        loadingFactory.hideLoader();
    });
  };
    
    financialYearFactory.getFinancialYears()
      .then(function (response) {
          $scope.financialYearList = response.data.data;

        }, function (error) {
          $scope.status = 'Unable to load customer data: ' + error.message;
    });

    $scope.changeFinancialYear=function(){
      //$scope.financialYearModal.show();
      // An elaborate, custom popup

      $scope.changed_financial_year=$scope.selected_financial_year;

      var myPopup = $ionicPopup.show({
        template: '<ion-radio ng-repeat="option in financialYearList" ng-value="option.id" ng-model="year_data.value"> {{ option.year_title }} </ion-radio>',
        title: 'Select Financial Year',
        scope: $scope,
        cssClass:'finYearPopup',
        buttons: [
          { text: 'Cancel' },
          {
            text: '<b>Apply</b>',
            type: 'button-assertive',
            onTap: function(e) {
             $scope.applyYearFilter();
            }
          }
        ]
      });
    };

    $scope.applyYearFilter=function(){

    loadingFactory.showLoader("");

    var radionSelectedYear=$scope.financialYearList.filter(function(item) {
        return item.id === $scope.year_data.value;
    })[0];

    $scope.financial_year_title=radionSelectedYear.year_title;
    
    loadingFactory.hideLoader();
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
  })
.directive('positionBarsAndContent', function($timeout) {
 return {
    
    restrict: 'AC',
    
    link: function(scope, element) {
      
      var offsetTop = 0;
      
      // Get the parent node of the ion-content
      var parent = angular.element(element[0].parentNode);
      
      // Get all the headers in this parent
      var headers = parent[0].getElementsByClassName('bar');

      // Iterate through all the headers
      for(x=0;x<headers.length;x++)
      {
        // If this is not the main header or nav-bar, adjust its position to be below the previous header
        if(x > 0) {
          headers[x].style.top = offsetTop + 'px';
        }
        
        // Add up the heights of all the header bars
        offsetTop = offsetTop + headers[x].offsetHeight;
      }      
      
      // Position the ion-content element directly below all the headers
      element[0].style.top = offsetTop + 'px';
      
    }
  };  
});

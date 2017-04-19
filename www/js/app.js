// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('myapp', ['ionic', 'myapp.controllers','myapp.services'])

.run(function($ionicPlatform,$rootScope,loginFactory,financialYearFactory,$state,$timeout) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);

    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
  });

  $rootScope.financial_year_start_date="";

  $rootScope.financial_year_end_date="";

  $rootScope.current_financial_year="";

  $rootScope.financial_year_title="";

  $rootScope.selected_financial_year="";

  $rootScope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams) {
    if (toState.name !== 'app.login' && !loginFactory.isAuthenticated()) {
      event.preventDefault();
      $state.go('app.login');
    }
  });

  /*if(loginFactory.isAuthenticated())
  {
      financialYearFactory.getCurrentFinancialYear()
      .then(function (response) {
           var currentFinancialYear = response.data.data;

           $rootScope.financial_year_start_date = currentFinancialYear[0].year_start_date;

            $rootScope.financial_year_end_date = currentFinancialYear[0].year_end_date;

            $rootScope.current_financial_year=currentFinancialYear[0].id;

            $rootScope.financial_year_title=currentFinancialYear[0].year_title;

        }, function (error) {
          $scope.status = 'Unable to load customer data: ' + error.message;
    });
  }*/
})

.config(function($stateProvider, $urlRouterProvider,$ionicConfigProvider) {
  $stateProvider

    .state('app', {
    url: '/app',
    abstract: true,
    templateUrl: 'templates/menu.html',
    controller: 'AppCtrl'
  })

  .state('app.dashboard', {
    url: '/dashboard',
    views: {
      'menuContent': {
        templateUrl: 'templates/dashboard.html',
        controller: "DashboardCtrl"
      }
    }
  })
  .state('app.login', {
    url: '/login',
    views: {
      'menuContent': {
        templateUrl: 'templates/login.html',
        controller: "LoginCtrl"
      }
    }
  })
    .state('app.customer', {
      url: '/customer',
      views: {
        'menuContent': {
          templateUrl: 'templates/customer.html',
          controller: 'CustomerCtrl'
        }
      }
    })
    .state('app.customerDetails', {
      url: '/customer/:id',
      views: {
        'menuContent': {
          templateUrl: 'templates/customerDetail.html',
          controller: 'CustomerDetailCtrl'
        }
      }
    })
    .state('app.employee', {
      url: '/employee',
      views: {
        'menuContent': {
          templateUrl: 'templates/employee.html',
          controller: 'EmployeeCtrl'
        }
      }
    })
    .state('app.employeeDetails', {
      url: '/employee/:id',
      views: {
        'menuContent': {
          templateUrl: 'templates/employeeDetail.html',
          controller: 'EmployeeDetailCtrl'
        }
      }
    })
    .state('app.taxation', {
      url: '/taxation',
      views: {
        'menuContent': {
          templateUrl: 'templates/taxation.html',
          controller: 'TaxationCtrl'
        }
      }
    })
    .state('app.invoice', {
      url: '/invoice',
      views: {
        'menuContent': {
          templateUrl: 'templates/invoice.html',
          controller:'InvoiceCtrl'
        }
      }
    })
  .state('app.inoviceDetails', {
    url: '/invoice/:id',
    views: {
      'menuContent': {
        templateUrl: 'templates/invoiceDetail.html',
        controller: 'InvoiceDetailCtrl'
      }
    }
  })
  .state('app.year_summary', {
      url: '/year_summary',
      views: {
        'menuContent': {
          templateUrl: 'templates/yearSummary.html',
          controller:'YearSummaryCtrl'
        }
      }
    });
  // if none of the above states are matched, use this as the fallback
   $urlRouterProvider.otherwise(function($injector, $location){
      var $state = $injector.get("$state");
      $state.go('app.login');
  });

  $ionicConfigProvider.backButton.previousTitleText(false).text('');
});

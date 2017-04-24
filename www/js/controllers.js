angular.module('myapp.controllers', ['myapp.config'])

    .controller('AppCtrl', ['$scope', '$rootScope', 'loginFactory', '$timeout', '$state', 'loadingFactory',
        function($scope, $rootScope, loginFactory, $timeout, $state, loadingFactory) {

            // With the new view caching in Ionic, Controllers are only called
            // when they are recreated or on app start, instead of every page change.
            // To listen for when this page is active (for example, to refresh data),
            // listen for the $ionicView.enter event:
            //$scope.$on('$ionicView.enter', function(e) {
            //});

            $scope.isLoggedIn = loginFactory.isAuthenticated();

            $timeout(function() {
                $scope.userInfo = loginFactory.userInfo();
            }, 200);

            $scope.logoutUser = function() {
                loadingFactory.showLoader("Logging out");

                loginFactory.logoutUser();

                $timeout(function() {
                    loadingFactory.hideLoader();
                }, 1000);

                $state.go('app.login');
            };

        }
    ])
    .controller('LoginCtrl', ['$scope', '$ionicSideMenuDelegate', 'loginFactory', 'loadingFactory', '$localStorage', '$state', '$ionicViewService', '$ionicPopup',
        function($scope, $ionicSideMenuDelegate, loginFactory, loadingFactory, $localStorage, $state, $ionicViewService, $ionicPopup) {

            $ionicSideMenuDelegate.canDragContent(false);

            $scope.loginData = {
                'username': 'superuser',
                'password': 'superuser'
            };

            $scope.doLogin = function(loginData) {

                loadingFactory.showLoader("Loading");

                loginFactory.authenticateUser($scope.loginData)
                    .then(function(response) {
                        if (response.loginSuccess) {
                            $ionicViewService.nextViewOptions({
                                disableBack: true
                            });

                            $scope.loginData = {};

                            loadingFactory.hideLoader();

                            $state.go('app.dashboard');
                        } else {
                            loadingFactory.hideLoader();

                            var alertPopup = $ionicPopup.alert({
                                title: 'Error',
                                template: 'Invalid Username or Password !!!!'
                            });

                            $state.go('app.login');
                        }
                    }, function(error) {
                        $scope.status = 'Unable to load customer data: ' + error.message;

                        loadingFactory.hideLoader();
                    });
            };

        }
    ])
    .controller('InvoiceCtrl', ['$scope', '$rootScope', 'invoiceFactory', '$ionicModal', '$timeout', '$ionicListDelegate', 'financialYearFactory', 'loadingFactory', '$ionicPopup', 'customerFactory','paymentInfoFactory','$ionicPopup',
        function($scope, $rootScope, invoiceFactory, $ionicModal, $timeout, $ionicListDelegate, financialYearFactory, loadingFactory, $ionicPopup, customerFactory,paymentInfoFactory,$ionicPopup) {
            $scope.message = "";

            $scope.invoice = {};

            $scope.searchFilter = "";

            $scope.invoiceHeader = "Add Invoice";

            $scope.invoiceButtonText = "Add";

            $scope.financialYearList = {};

            $scope.currentFinancialYear = {};

            $scope.selected_financial_year = "";

            $scope.year_data = {
                value: ""
            };

            $scope.dateFrom = "";

            $scope.dateTo = "";

            $scope.customerList = [];

            $scope.paymentEntry = {
                id: "",
                bill_id: "",
                bill_no: "",
                company_id: 1,
                payment_type: "",
                cheque_no: "",
                cheque_date: "",
                bank_name: "",
                payment_date: "",
                amount: "",
                invoice_amount: ""
            };

            /** Data Fetch Functions Start **/
            $scope.getFinancialYearList=function(){
              financialYearFactory.getFinancialYears()
                .then(function(response) {
                    $scope.financialYearList = response.data.data;

                }, function(error) {
                    $scope.status = 'Unable to load customer data: ' + error.message;
                });
            }
            
            $scope.getCustomers = function() {
                customerFactory.getCustomers()
                  .then(function(response) {
                      $scope.customerList = response.data.data;

                      loadingFactory.hideLoader();
                  }, function(error) {
                      $scope.status = 'Unable to load customer data: ' + error.message;

                      loadingFactory.hideLoader();
                  });
            }

            $scope.getInvoiceData = function(current_financial_year) {

                invoiceFactory.getInvoices(current_financial_year)
                  .then(function(response) {
                      $scope.invoices = response.data.data;

                      loadingFactory.hideLoader();
                  }, function(error) {
                      $scope.status = 'Unable to load customer data: ' + error.message;

                      loadingFactory.hideLoader();
                  });
            };
            /** Data Fetch  Functions End **/

            $scope.loadExternalModals=function(){

              /*Manage Invoice Modal*/

              $ionicModal.fromTemplateUrl('templates/manageInvoice.html', {
                scope: $scope
              }).then(function(modal) {
                  $scope.invoiceModal = modal;
              });

              /*Payment Entry Modal*/
              $ionicModal.fromTemplateUrl('templates/paymentEntry.html', {
                  scope: $scope
              }).then(function(modal) {
                  $scope.paymentEntryModal = modal;
              });

            }

            $scope.init=function(){

              loadingFactory.showLoader("Loading");

              $timeout(function() {
                  $scope.financial_year_start_date = $rootScope.financial_year_start_date;

                  $scope.financial_year_end_date = $rootScope.financial_year_end_date;

                  $scope.current_financial_year = $rootScope.current_financial_year;

                  $scope.selected_financial_year = $rootScope.selected_financial_year;

                  $scope.financial_year_title = $rootScope.financial_year_title;

                  $scope.year_data.value = $scope.selected_financial_year;

                  $scope.getInvoiceData($scope.selected_financial_year);
              }, 1000);
              
              $scope.loadExternalModals();

              $scope.getFinancialYearList();

              $scope.getCustomers();

            }

            $scope.init();

            /**Inovice Create / Update End**/
            
            $scope.ManageInvoiceSubmit = function() {

                loadingFactory.showLoader();

                if ($scope.invoice.id != "") {

                    invoiceFactory.updateInvoice($scope.invoice)
                    .then(
                        function(response) {
                            if (response.updateSuccess) {
                                var alertPopup = $ionicPopup.alert({
                                    title: 'Success',
                                    template: 'Invoice Info Updated !!!!'
                                });

                                $scope.invoice = {};

                                loadingFactory.hideLoader();
                            } else {
                                $scope.invoice = {};

                                var alertPopup = $ionicPopup.alert({
                                    title: 'Error',
                                    template: 'Please try after some time!!!!'
                                });

                                loadingFactory.hideLoader();

                            }
                        },
                        function(error) {
                            $scope.status = 'Unable to load customer data: ' + error.message;

                            $scope.invoice = {};

                            loadingFactory.hideLoader();
                        }
                    );

                } 
                else {
                    invoiceFactory.insertInvoice($scope.invoice)
                    .then(
                        function(response) {
                            if (response.insertSuccess) {
                                var alertPopup = $ionicPopup.alert({
                                    title: 'Success',
                                    template: 'Invoice Info added !!!!'
                                });

                                $scope.invoice = {};

                                loadingFactory.hideLoader();
                            } else {

                                var alertPopup = $ionicPopup.alert({
                                    title: 'Error',
                                    template: 'Please try after some time!!!!'
                                });

                                $scope.invoice = {};

                                loadingFactory.hideLoader();

                            }
                        },
                        function(error) {
                            $scope.status = 'Unable to load customer data: ' + error.message;

                            $scope.invoice = {};

                            loadingFactory.hideLoader();
                        }
                    );
                }
            };

            $scope.showInvoiceModel = function() {
                $scope.invoiceModal.show();
            };

            $scope.closeInvoiceModel = function() {
                $scope.invoiceModal.hide();

                $scope.invoice = {};

                $scope.invoiceHeader = "Add Invoice";
            };

            $scope.addNewInvoice = function() {
                $scope.showInvoiceModel();
            };

            $scope.editInvoice = function(invoice) {
                $scope.invoice = invoice;

                $scope.invoiceHeader = "Edit Invoice";

                $scope.invoiceButtonText = "Save";

                $scope.showInvoiceModel();
            };

            /**Inovice Create / Update End**/
            

            $scope.calculateAmount = function() {
                if ($scope.invoice.gross_amount != "" && $scope.invoice.service_tax != "") {

                    var tax_amount = (parseFloat($scope.invoice.gross_amount) * parseFloat($scope.invoice.service_tax)) / 100;

                    var total_amount = parseFloat($scope.invoice.gross_amount) + parseFloat(tax_amount);

                    $scope.invoice.service_tax_amount = tax_amount;

                    $scope.invoice.net_amount = total_amount;
                }
            };
            

            $scope.clearSearch = function() {
                $scope.searchFilter = "";
            };

            $scope.changeFinancialYear = function() {
                //$scope.financialYearModal.show();
                // An elaborate, custom popup

                $scope.changed_financial_year = $scope.selected_financial_year;

                var myPopup = $ionicPopup.show({
                    template: '<ion-radio ng-repeat="option in financialYearList" ng-value="option.id" ng-model="year_data.value"> {{ option.year_title }} </ion-radio>',
                    title: 'Select Financial Year',
                    scope: $scope,
                    cssClass: 'finYearPopup',
                    buttons: [{
                            text: 'Cancel'
                        },
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

            $scope.applyYearFilter = function() {

                loadingFactory.showLoader("");

                var radionSelectedYear = $scope.financialYearList.filter(function(item) {
                    return item.id === $scope.year_data.value;
                })[0];

                $scope.financial_year_title = $rootScope.financial_year_title = radionSelectedYear.year_title;

                $scope.selected_financial_year = $rootScope.selected_financial_year = radionSelectedYear.id;

                $scope.getInvoiceData($scope.year_data.value);
            };

            $scope.ManagePaymentEntrySubmit=function(){
              loadingFactory.showLoader();

                if ($scope.paymentEntry.id != "") {

                    paymentInfoFactory.updatePaymentInfo($scope.paymentEntry)
                        .then(
                            function(response) {
                                if (response.updateSuccess) {
                                    var alertPopup = $ionicPopup.alert({
                                        title: 'Success',
                                        template: 'Payment Info Updated !!!!'
                                    });

                                    $scope.invoice = {};

                                    loadingFactory.hideLoader();
                                } else {
                                    $scope.invoice = {};

                                    var alertPopup = $ionicPopup.alert({
                                        title: 'Error',
                                        template: 'Please try after some time!!!!'
                                    });

                                    loadingFactory.hideLoader();

                                }
                            },
                            function(error) {
                                $scope.status = 'Unable to load customer data: ' + error.message;

                                loadingFactory.hideLoader();
                            });
                } else {
                    paymentInfoFactory.insertPaymentInfo($scope.paymentEntry)
                        .then(
                            function(response) {
                                if (response.insertSuccess) {
                                    var alertPopup = $ionicPopup.alert({
                                        title: 'Success',
                                        template: 'Payment Info added !!!!'
                                    });

                                    $scope.employee = {};

                                    loadingFactory.hideLoader();
                                } else {

                                    var alertPopup = $ionicPopup.alert({
                                        title: 'Error',
                                        template: 'Please try after some time!!!!'
                                    });

                                    loadingFactory.hideLoader();

                                }
                            },
                            function(error) {
                                $scope.status = 'Unable to load customer data: ' + error.message;

                                loadingFactory.hideLoader();
                            });
                }
            };

            $scope.showPaymentEntryModel = function(invoice) {

                $scope.paymentEntry.bill_no = invoice.bill_no;

                $scope.paymentEntry.invoice_amount = invoice.net_amount;

                $scope.paymentEntry.bill_id = invoice.id;

                $scope.paymentEntryModal.show();
            };

            $scope.closePaymentEntryModel = function() {
                $scope.paymentEntryModal.hide();

                $scope.paymentEntry = {};
            };
        }
    ])
    .controller('InvoiceDetailCtrl', ['$scope', 'invoiceFactory', '$stateParams', 'loadingFactory','$ionicPopup',
        function($scope, invoiceFactory, $stateParams, loadingFactory,$ionicPopup) {
            $scope.message = "";

            loadingFactory.showLoader("Loading");

            invoiceFactory.getInvoice(parseInt($stateParams.id, 10))
                .then(function(response) {
                    $scope.invoiceDetail = response.data.data;

                    loadingFactory.hideLoader();

                }, function(error) {
                    $scope.status = 'Unable to load customer data: ' + error.message;

                    loadingFactory.hideLoader();
                });

        }
    ])
    .controller('CustomerCtrl', ['$scope', 'customerFactory', '$ionicModal', '$timeout', '$ionicListDelegate', 'loadingFactory','$ionicPopup',
        function($scope, customerFactory, $ionicModal, $timeout, $ionicListDelegate, loadingFactory,$ionicPopup) {
            
            $scope.customer = {};

            $scope.customerHeader = "Add Customer";

            $scope.customerButtonText = "Add";

            $scope.init=function(){

                loadingFactory.showLoader("Loading");

                $ionicModal.fromTemplateUrl('templates/manageCustomer.html', {
                    scope: $scope
                }).then(function(modal) {
                    $scope.customerModal = modal;
                });

                $scope.getCustomers();
            };
            
            $scope.getCustomers = function() {
                customerFactory.getCustomers()
                    .then(function(response) {
                        $scope.customers = response.data.data;

                        loadingFactory.hideLoader();
                    }, function(error) {
                        $scope.status = 'Unable to load customer data: ' + error.message;

                        loadingFactory.hideLoader();
                    });
            };

            $scope.init();

            $scope.showCustomerModel = function() {
                $scope.customerModal.show();
            };

            $scope.closeCustomerModel = function() {
                $scope.customerModal.hide();

                $scope.customer = {};

                $scope.customerHeader = "Add Customer";
            };

            $scope.addNewCustomer = function() {
                $scope.showCustomerModel();

                $ionicListDelegate.closeOptionButtons();
            };

            $scope.editCustomer = function(customer) {
                $scope.customer = customer;

                $scope.customerHeader = "Edit Customer";

                $scope.customerButtonText = "Save";

                $ionicListDelegate.closeOptionButtons();

                $scope.showCustomerModel();
            };

            $scope.ManageCustomerSubmit=function(){

                loadingFactory.showLoader();

                if ($scope.customer.id != "") {

                    customerFactory.updateCustomer($scope.customer)
                    .then(
                        function(response) {
                            if (response.updateSuccess) {
                                var alertPopup = $ionicPopup.alert({
                                    title: 'Success',
                                    template: 'Customer Info Updated !!!!'
                                });

                                $scope.customer = {};

                                loadingFactory.hideLoader();
                            } else {
                                $scope.customer = {};

                                var alertPopup = $ionicPopup.alert({
                                    title: 'Error',
                                    template: 'Please try after some time!!!!'
                                });

                                loadingFactory.hideLoader();

                            }
                        },
                        function(error) {
                            $scope.status = 'Unable to load customer data: ' + error.message;

                            loadingFactory.hideLoader();

                            $scope.customer = {};
                        }
                    );
                } 
                else {
                    customerFactory.insertCustomer($scope.customer)
                    .then(
                        function(response) {
                            if (response.insertSuccess) {
                                var alertPopup = $ionicPopup.alert({
                                    title: 'Success',
                                    template: 'Customer Info added !!!!'
                                });

                                $scope.customer = {};

                                loadingFactory.hideLoader();
                            } else {

                                var alertPopup = $ionicPopup.alert({
                                    title: 'Error',
                                    template: 'Please try after some time!!!!'
                                });

                                $scope.customer = {};

                                loadingFactory.hideLoader();

                            }
                        },
                        function(error) {
                            $scope.status = 'Unable to load customer data: ' + error.message;

                            $scope.customer = {};

                            loadingFactory.hideLoader();
                        }
                    );
                }
            };
        }
    ])
    .controller('CustomerDetailCtrl', ['$scope', 'customerFactory', '$stateParams', 'loadingFactory','$ionicPopup',
        function($scope, customerFactory, $stateParams, loadingFactory,$ionicPopup) {
            $scope.message = "";

            loadingFactory.showLoader("Loading");

            customerFactory.getCustomer(parseInt($stateParams.id, 10))
                .then(function(response) {
                    $scope.customerDetail = response.data.data;

                    loadingFactory.hideLoader();
                }, function(error) {
                    $scope.status = 'Unable to load customer data: ' + error.message;

                    loadingFactory.hideLoader();
                });

        }
    ])
    .controller('EmployeeCtrl', ['$scope', 'employeeFactory', '$ionicModal', '$timeout', '$ionicListDelegate', 'loadingFactory','$ionicPopup',
        function($scope, employeeFactory, $ionicModal, $timeout, $ionicListDelegate, loadingFactory,$ionicPopup) {
            $scope.employee = {};

            $scope.employeeHeader = "Add Employee";

            $scope.employeeButtonText = "Add";

            $scope.init=function(){

                $ionicModal.fromTemplateUrl('templates/manageEmployee.html', {
                    scope: $scope
                }).then(function(modal) {
                    $scope.employeeModal = modal;
                });

                loadingFactory.showLoader("Loading");

                $scope.getEmployees();
            };

            $scope.getEmployees=function(){
                employeeFactory.getEmployees()
                .then(function(response) {
                    $scope.employees = response.data.data;

                    loadingFactory.hideLoader();

                }, function(error) {
                    $scope.status = 'Unable to load customer data: ' + error.message;

                    loadingFactory.hideLoader();
                });
            };

            $scope.init();

            $scope.showEmployeeModel = function() {
                $scope.employeeModal.show();
            };

            $scope.closeEmployeeModel = function() {
                $scope.employeeModal.hide();

                $scope.employee = {};

                $scope.employeeHeader = "Add Employee";
            };

            $scope.addNewEmployee = function() {
                $scope.showEmployeeModel();

                $ionicListDelegate.closeOptionButtons();
            };

            $scope.editEmployee = function(employee) {
                $scope.employee = employee;

                $scope.employeeHeader = "Edit Employee";

                $scope.employeeButtonText = "Save";

                $ionicListDelegate.closeOptionButtons();

                $scope.showEmployeeModel();
            };

            $scope.ManageEmployeeSubmit = function() {

                loadingFactory.showLoader();

                if ($scope.employee.id != "") {

                    employeeFactory.updateEmployee($scope.employee)
                    .then(
                        function(response) {
                            if (response.updateSuccess) {
                                var alertPopup = $ionicPopup.alert({
                                    title: 'Success',
                                    template: 'Employee Info Updated !!!!'
                                });

                                $scope.employee = {};

                                loadingFactory.hideLoader();
                            } 
                            else {
                                $scope.employee = {};

                                var alertPopup = $ionicPopup.alert({
                                    title: 'Error',
                                    template: 'Please try after some time!!!!'
                                });

                                loadingFactory.hideLoader();

                            }
                        },
                        function(error) {
                            $scope.status = 'Unable to load customer data: ' + error.message;

                            loadingFactory.hideLoader();
                        }
                    );
                } 
                else {
                    employeeFactory.insertEmployee($scope.employee)
                    .then(
                        function(response) {
                            if (response.insertSuccess) {
                                var alertPopup = $ionicPopup.alert({
                                    title: 'Success',
                                    template: 'Employee Info added !!!!'
                                });

                                $scope.employee = {};

                                loadingFactory.hideLoader();
                            } else {

                                var alertPopup = $ionicPopup.alert({
                                    title: 'Error',
                                    template: 'Please try after some time!!!!'
                                });

                                loadingFactory.hideLoader();

                            }
                        },
                        function(error) {
                            $scope.status = 'Unable to load customer data: ' + error.message;

                            loadingFactory.hideLoader();
                        }
                    );
                }
            };
        }
    ])
    .controller('EmployeeDetailCtrl', ['$scope', 'employeeFactory', '$stateParams', 'loadingFactory',
        function($scope, employeeFactory, $stateParams, loadingFactory) {
            $scope.message = "";

            loadingFactory.showLoader("Loading");

            employeeFactory.getEmployee(parseInt($stateParams.id, 10))
                .then(function(response) {
                    $scope.employeeDetail = response.data.data;
                    loadingFactory.hideLoader();
                }, function(error) {
                    $scope.status = 'Unable to load customer data: ' + error.message;
                    loadingFactory.hideLoader();
                });

        }
    ])
    .controller('DashboardCtrl', ['$scope', '$rootScope', 'dashboardFactory', '$stateParams', 'loadingFactory', 'financialYearFactory', '$ionicModal', '$timeout', '$ionicPopup',
        function($scope, $rootScope, dashboardFactory, $stateParams, loadingFactory, financialYearFactory, $ionicModal, $timeout, $ionicPopup) {

            $scope.message = "";

            $scope.invoiced_amount = "00.00";

            $scope.received_amount = "00.00";

            $scope.outstanding_amount = "00.00";

            $scope.currentFinancialYear = {};

            $scope.selected_financial_year = "";

            $scope.year_data = {
                value: ""
            };

            $scope.init=function(){

                loadingFactory.showLoader("Loading");

                $scope.getCurrentFinancialYearData();

                $scope.getFinancialYearList();


                $scope.labels = ["Invoiced Amount", "Received Amount"];

                $scope.colors = ["rgba(159,204,0,0.5)","rgba(250,109,33,0.7)"];

                $scope.graphOptions={ responsive: true,maintainAspectRatio: true};
            };
            
            $scope.getCurrentFinancialYearData = function() {
                financialYearFactory.getCurrentFinancialYear()
                    .then(function(response) {

                        var currentFinancialYear = response.data.data;

                        $rootScope.financial_year_start_date = $scope.financial_year_start_date = currentFinancialYear[0].year_start_date;

                        $rootScope.financial_year_end_date = $scope.financial_year_end_date = currentFinancialYear[0].year_end_date;

                        $rootScope.current_financial_year = $scope.current_financial_year = currentFinancialYear[0].id;

                        $rootScope.financial_year_title = currentFinancialYear[0].year_title;

                        $rootScope.selected_financial_year = $scope.selected_financial_year = currentFinancialYear[0].id;

                        $scope.financial_year_title = $rootScope.financial_year_title;

                        $scope.year_data.value = $scope.selected_financial_year;

                        $scope.getDashboardData($rootScope.selected_financial_year);

                    }, function(error) {
                        $scope.status = 'Unable to load customer data: ' + error.message;
                    });
            }

            
            $scope.getDashboardData = function(selected_financial_year) {

                dashboardFactory.getDashboardData(selected_financial_year)
                    .then(function(response) {
                        $scope.dashboardData = response.data.data;

                        $scope.dashboardData.tax_payments = 10;
                        $scope.outstanding_amount = parseFloat($scope.dashboardData.invoice_details.invoice_amount) - parseFloat($scope.dashboardData.invoice_details.received_amount);
                         $scope.data = [$scope.invoiced_amount,$scope.received_amount];
                        loadingFactory.hideLoader();

                    }, function(error) {
                        $scope.status = 'Unable to load customer data: ' + error.message;

                        loadingFactory.hideLoader();
                    });
            };

            $scope.getFinancialYearList=function(){
                financialYearFactory.getFinancialYears()
                .then(function(response) {
                    $scope.financialYearList = response.data.data;

                }, function(error) {
                    $scope.status = 'Unable to load customer data: ' + error.message;
                });
            };

            $scope.init();

            $scope.changeFinancialYear = function() {

                $scope.changed_financial_year = $scope.selected_financial_year;

                var myPopup = $ionicPopup.show({
                    template: '<ion-radio ng-repeat="option in financialYearList" ng-value="option.id" ng-model="year_data.value"> {{ option.year_title }} </ion-radio>',
                    title: 'Select Financial Year',
                    scope: $scope,
                    cssClass: 'finYearPopup',
                    buttons: [{
                            text: 'Cancel'
                        },
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

            $scope.applyYearFilter = function() {

                loadingFactory.showLoader("");

                var radionSelectedYear = $scope.financialYearList.filter(function(item) {
                    return item.id === $scope.year_data.value;
                })[0];

                $scope.financial_year_title = $rootScope.financial_year_title = radionSelectedYear.year_title;

                $scope.selected_financial_year = $rootScope.selected_financial_year = radionSelectedYear.id;

                $scope.getDashboardData($scope.selected_financial_year);

                loadingFactory.hideLoader();
            };
        }
    ])
    .controller('CompanyInfoCtrl', ['$scope', 'companyFactory', '$stateParams', 'loadingFactory', '$ionicModal','$ionicPopup',
        function($scope, companyFactory, $stateParams, loadingFactory, $ionicModal,$ionicPopup) {
            
            $scope.message = "";

            $scope.getCompanyProfile=function(company_id){

                companyFactory.getCompanyInfo(company_id)
                .then(function(response) {

                    $scope.companyInfo = response.data.data;

                    loadingFactory.hideLoader();

                }, function(error) {
                    $scope.status = 'Unable to load customer data: ' + error.message;

                    loadingFactory.hideLoader();
                });
            };

            $scope.init=function(){
                loadingFactory.showLoader("Loading");

                $ionicModal.fromTemplateUrl('templates/manageCompanyInfo.html', {
                    scope: $scope
                }).then(function(modal) {
                    $scope.companyInfoModal = modal;
                });

                $scope.getCompanyProfile(1);
            };

            $scope.init();

            $scope.showCompanyInfoModel = function() {
                
                $scope.companyInfoModal.show();
            };

            $scope.closeCompanyInfoModel = function() {

                $scope.companyInfoEdit={};

                $scope.companyInfoModal.hide();
            };

            $scope.updateCompanyProfile = function() {
                
                $scope.companyInfoEdit=$scope.companyInfo;

                $scope.showCompanyInfoModel();
            };

            $scope.ManageCompanyProfileUpdate = function() {
                loadingFactory.showLoader();

                companyFactory.updateCompanyInfo($scope.companyInfoEdit)
                .then(
                    function(response) {
                        if (response.updateSuccess) {
                            var alertPopup = $ionicPopup.alert({
                                title: 'Success',
                                template: 'Company Info Updated !!!!'
                            });

                            $scope.closeCompanyInfoModel();

                            $scope.companyInfoEdit = {};

                            $scope.getCompanyProfile(1);

                            loadingFactory.hideLoader();
                        } 
                        else {
                            $scope.companyInfoEdit = {};

                            var alertPopup = $ionicPopup.alert({
                                title: 'Error',
                                template: 'Please try after some time!!!!'
                            });
                            $scope.closeCompanyInfoModel();
                            
                            loadingFactory.hideLoader();

                        }
                    },
                    function(error) {
                        $scope.status = 'Unable to load customer data: ' + error.message;

                        loadingFactory.hideLoader();
                    }
                );
            };
        }
    ])
    .controller('TaxationCtrl', ['$scope', 'taxationFactory', '$ionicModal', '$timeout', '$ionicListDelegate', 'loadingFactory', 'TAXATION_DOCS_URL','$ionicPopup',
        function($scope, taxationFactory, $ionicModal, $timeout, $ionicListDelegate, loadingFactory, TAXATION_DOCS_URL,$ionicPopup) {

            $scope.TAXATION_DOCS_URL = TAXATION_DOCS_URL;

            $scope.tax_details = {};

            $scope.taxationHeader = "Add Customer";

            $scope.taxationButtonText = "Add";

            $scope.init=function(){

                loadingFactory.showLoader("Loading");

                $ionicModal.fromTemplateUrl('templates/manageTaxation.html', {
                    scope: $scope
                }).then(function(modal) {
                    $scope.taxationModal = modal;
                });

                 $scope.getTaxationList();
            };

            $scope.getTaxationList=function(){

                taxationFactory.getTaxationList()
                .then(function(response) {
                    $scope.taxationList = response.data.data;

                    loadingFactory.hideLoader();
                }, function(error) {
                    $scope.status = 'Unable to load customer data: ' + error.message;

                    loadingFactory.hideLoader();
                });
            };

            $scope.init();

            $scope.showTaxDetailsModel = function() {
                $scope.taxationModal.show();
            };

            $scope.closeTaxDetailsModel = function() {
                $scope.taxationModal.hide();

                $scope.tax_details = {};

                $scope.taxationHeader = "Add Tax Details";
            };

            $scope.addNewTaxDetails = function() {
                $scope.showTaxDetailsModel();

                $ionicListDelegate.closeOptionButtons();
            };

            $scope.editTaxDetails = function(tax_details) {
                $scope.tax_details = tax_details;

                $scope.taxationHeader = "Edit Tax Details";

                $scope.taxationButtonText = "Save";

                $ionicListDelegate.closeOptionButtons();

                $scope.showTaxDetailsModel();
            };

            $scope.ManageTaxationSubmit=function(){

                loadingFactory.showLoader();

                if ($scope.tax_details.id != "") {

                    taxationFactory.updateTaxDetails($scope.tax_details)
                    .then(
                        function(response) {
                            if (response.updateSuccess) {
                                var alertPopup = $ionicPopup.alert({
                                    title: 'Success',
                                    template: 'Taxation Info Updated !!!!'
                                });

                                $scope.tax_details = {};

                                loadingFactory.hideLoader();
                            } else {
                                $scope.tax_details = {};

                                var alertPopup = $ionicPopup.alert({
                                    title: 'Error',
                                    template: 'Please try after some time!!!!'
                                });

                                loadingFactory.hideLoader();

                            }
                        },
                        function(error) {
                            $scope.status = 'Unable to load customer data: ' + error.message;

                            loadingFactory.hideLoader();

                            $scope.tax_details = {};
                        }
                    );

                } 
                else {
                    taxationFactory.insertTaxDetails($scope.tax_details)
                    .then(
                        function(response) {
                            if (response.insertSuccess) {
                                var alertPopup = $ionicPopup.alert({
                                    title: 'Success',
                                    template: 'Taxation Info added !!!!'
                                });

                                $scope.tax_details = {};

                                loadingFactory.hideLoader();
                            } else {

                                var alertPopup = $ionicPopup.alert({
                                    title: 'Error',
                                    template: 'Please try after some time!!!!'
                                });

                                $scope.tax_details = {};

                                loadingFactory.hideLoader();

                            }
                        },
                        function(error) {
                            $scope.status = 'Unable to load customer data: ' + error.message;

                            $scope.tax_details = {};

                            loadingFactory.hideLoader();
                        }
                    );
                }
            };
        }
    ])
    .controller('YearSummaryCtrl', ['$scope', '$rootScope', 'loadingFactory', 'financialYearFactory', '$ionicSlideBoxDelegate', '$timeout',
        function($scope, $rootScope, loadingFactory, financialYearFactory, $ionicSlideBoxDelegate, $timeout) {

            $scope.currentFinancialYear = {};

            $scope.selected_financial_year = "";

            $scope.active_financial_year_index = 0;

            $timeout(function() {
                $scope.current_financial_year = $rootScope.current_financial_year;

                $scope.selected_financial_year = $rootScope.current_financial_year;

                $scope.financial_year_title = $rootScope.financial_year_title;

                $scope.getFinancialYearList();

            }, 1000);

            $scope.getFinancialYearList = function() {
                financialYearFactory.getFinancialYears()
                    .then(function(response) {
                        $scope.financialYearList = response.data.data;
                        $ionicSlideBoxDelegate.update();
                        $scope.active_financial_year_index = $scope.financialYearList.findIndex(function(element, index, array) {
                            if (element.id === $scope.selected_financial_year) {
                                return true;
                            }
                        });
                    }, function(error) {
                        $scope.status = 'Unable to load customer data: ' + error.message;
                    });
            };
            // Called to navigate to the main app
            $scope.next = function() {

                var next = $scope.financialYearList[($scope.active_financial_year_index + 1) % $scope.financialYearList.length];

                $scope.active_financial_year_index = $scope.active_financial_year_index + 1 % $scope.financialYearList.length;

                $scope.financial_year_title = next.year_title;

                console.log("current_financial_year_index", $scope.active_financial_year_index, "next", next);

                $ionicSlideBoxDelegate.next();
            };
            $scope.previous = function() {

                var previous = $scope.financialYearList[($scope.active_financial_year_index - 1) % $scope.financialYearList.length];

                $scope.active_financial_year_index = ($scope.active_financial_year_index - 1) % $scope.financialYearList.length;

                $scope.financial_year_title = previous.year_title;

                console.log("current_financial_year_index", $scope.active_financial_year_index, "previous", previous);

                $ionicSlideBoxDelegate.previous();
            };
            // Called each time the slide changes
            $scope.slideChanged = function(index) {
                $scope.slideIndex = index;
            };
        }
    ])
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
            return input.replace(/\w\S*/g, function(txt) {
                return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
            });
        };
    })
    .filter('myfilter', function($filter) {
        return function(items, startDate, endDate) {
            var filteredArray = [];

            if (!startDate && !endDate) {
                return items;
            }

            if (startDate == "" || endDate == "") {
                return items;
            }

            angular.forEach(items, function(obj) {
                var invoiceDate = obj.invoice_date;
                if (moment(invoiceDate).isAfter(startDate) && moment(invoiceDate).isBefore(endDate)) {
                    filteredArray.push(obj);
                }
            });

            return filteredArray;
        };
    })
    .filter('invoicefilter', function($filter) {
        return function(items, searchStr) {
            if (!searchStr) {
                return items;
            }

            return items.filter(function(element, index, array) {
                var isNumber = /^[0-9.]+$/.test(searchStr);
                if (isNumber) {
                    return element.bill_no.includes(searchStr);
                } else {
                    return element.customer_name.toLowerCase().includes(searchStr.toLowerCase()) ||
                        element.bill_date.includes(searchStr) ||
                        element.description.toLowerCase().includes(searchStr.toLowerCase());
                }

            });

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
                for (x = 0; x < headers.length; x++) {
                    // If this is not the main header or nav-bar, adjust its position to be below the previous header
                    if (x > 0) {
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
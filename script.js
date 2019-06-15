let app = angular.module('myApp', []);
let api_url = 'http://localhost:3000/';

app.factory('testFactory',['$http', function($http) {
    function testFactory() {
    }
    testFactory = {
        loginTest: function () {
            // let username = $scope.login_username;
            // let password = $scope.login_pw;

            let data = {
                userName: "chen",
                password: "barvaz"
            };

            let config = {
                headers: {
                    'Content-Type': undefined
                }
            };

            let token = $http.post('http://localhost:3000/login', JSON.stringify(data), config);
            return token;
        },
    };
    return testFactory;
}]);

app.controller('myController', ['$scope', '$http', 'testFactory', function($scope, $http, testFactory) {

    self.url = api_url;
    self.testFactory = testFactory;
    $scope.showRegister = function () {
        $scope.loginDiv = false;
        $scope.registerDiv = true;
        $scope.restorePWDiv = false;
        $scope.searchDiv = false;
        $window.alert("reg");
    };
    $scope.showLogin = function () {
        $scope.loginDiv = true;
        $scope.registerDiv = false;
        $scope.restorePWDiv = false;
        $scope.searchDiv = false;
        $window.alert("login");
    };
    $scope.showSearch = function () {
        $scope.loginDiv = false;
        $scope.registerDiv = false;
        $scope.restorePWDiv = false;
        $scope.searchDiv = true;
        alert("search");
    };
    $scope.showRestorePW = function () {
        $scope.loginDiv = false;
        $scope.registerDiv = false;
        $scope.restorePWDiv = true;
        $scope.searchDiv = false;
        $window.alert("restore");
    };

    $scope.loginCheck = function() {
        self.testFactory.loginTest()
        {
        }
    };

}]);


            // $scope.loginCheck = function(){
            //     // let username = $scope.login_username;
            //     // let password = $scope.login_pw;
            //     //
            //     // let data = {
            //     //     "userName": "chen",
            //     //     "password": "barvaz"
            //     // };
            //     //
            //     // let config = {
            //     //     headers : {
            //     //         'Content-Type': undefined
            //     //     }
            //     // };
            //     //
            //     // let token = $http.post('http://localhost:3000/login', data, config);
            //     // return token;
            // };

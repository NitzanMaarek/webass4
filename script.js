let app = angular.module('myApp', []);
let api_url = 'http://localhost:3000/';

app.controller('myController', ['$scope', '$http', function($scope, $http) {

    self.url = api_url;

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

    $scope.loginCheck = function(){
        let username = $scope.login_username;
        let password = $scope.login_pw;

        let data = {
            userName: username,
            password: password
        };

        let token = $http.post('http://localhost:3000/login', data);

        // let req = {
        //     method: 'POST',
        //     url: 'http://localhost:3000/login',
        //     headers: {
        //         'content-Type': undefined
        //     },
        //     body: {
        //         userName: username,
        //         password: password
        //     }
        // }

        // let token = $http(req);
        return token;
    };

}]);
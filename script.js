let app = angular.module('myApp', []);
app.controller('myController', function($scope) {
    $scope.loginDiv = true;
    $scope.registerDiv = false;
    $scope.restorePWDiv = false;
    $scope.searchDiv = false;
    $scope.showLogin = function () {
        $scope.loginDiv = true;
        $scope.registerDiv = false;
        $scope.restorePWDiv = false;
        $scope.searchDiv = false;
    };
    $scope.showRegister = function () {
        $scope.loginDiv = false;
        $scope.registerDiv = true;
        $scope.restorePWDiv = false;
        $scope.searchDiv = false;
    };
    $scope.showSearch = function () {
        $scope.loginDiv = false;
        $scope.registerDiv = false;
        $scope.restorePWDiv = false;
        $scope.searchDiv = true;
    };
    $scope.showRestorePW = function () {
        $scope.loginDiv = false;
        $scope.registerDiv = false;
        $scope.restorePWDiv = true;
        $scope.searchDiv = false;
    };
    $scope.loginCheck = function(){

    };
});
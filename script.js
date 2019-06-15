let app = angular.module('myApp', []);
let api_url = 'http://localhost:3000/';

let config = {
    headers: {
        'Content-Type': undefined
    }
};

app.factory('testFactory',['$http', function($http) {
    function testFactory() {
    }
    testFactory = {
        loginTest: function (username, password) {

            let data = {
                "userName": username,
                "password": password
            };

            var config = {
                headers: {
                    'Content-Type': 'application/json'
                }
            };
            alert(username+" : "+password);

            let token = $http.post('http://localhost:3000/login', data, config).then
            (function successCallback(response) {
                alert(response.data);
            }, function errorCallback(response) {
                alert(response.status);
            });
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
        let username = $scope.login_username;
        let password = $scope.login_pw;
        let data = {
            "userName": username,
            "password": password
        };

        var config = {
            headers: {
                'Content-Type': 'application/json'
            }
        };

        self.token = $http.post(api_url + 'login', data, config).then
        (function successCallback(response) {
            alert(response.data);
        }, function errorCallback(response) {
            alert(response.status);
        })
        self.authentication();
    };

    self.authentication = function() {
        let data = {
            "token": self.token
        };

        var config = {
            headers: {
                'Content-Type': 'application/json'
            }
        };

        let response = $http.post(api_url + 'auth', data, config).then
        (function successCallback(response) {
            alert(response.data);
        }, function errorCallback(response) {
            alert(response.status);
        });
        alert(response);
    };

    self.getCategories = function () {
        self.categories = $http.get(api_url + 'getCategories')
        return self.categories;
    };

    $scope.register = function () {
        let username = $scope.register_username;
        let password = $scope.register_password;
        let q1 = $scope.register_q1;
        let a1 = $scope.register_a1;
        let q2 = $scope.register_q2;
        let a2 = $scope.register_a2;

        let questions = [q1, q2]
        let answers = [a1, a2]

        let data = {
            userName: $scope.register_username,
            pw: $scope.register_password,
            fname: $scope.register_fname,
            lname: $scope.register_lname,
            city: $scope.register_city,
            country: $scope.register_country,
            email: $scope.register_email,
            interests: $scope.register_category,
            questions: questions,
            answers: answers
        };

        $http.post(api_url + 'registerUser', data, config).then
        (function successCallback(response) {
            alert(response.data);
        }, function errorCallback(response) {
            alert(response.status);
        });
    }

}]);
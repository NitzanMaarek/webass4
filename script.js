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

    showRandomPOIS();
    $scope.restore_pw_q = "";
    $scope.restore_pw_username = "";
    $scope.user_label = "Guest";
    self.token = "";
    self.url = api_url;
    self.testFactory = testFactory;
    $scope.showRegister = function () {
        $scope.loginDiv = false;
        $scope.registerDiv = true;
        $scope.restorePWDiv = false;
        $scope.searchDiv = false;
    };
    $scope.showLogin = function () {
        $scope.loginDiv = true;
        $scope.registerDiv = false;
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
        $window.alert("restore");
    };

    $scope.getSecurityQuestions = function(){
        let userName = $scope.restore_pw_username;
        $http.get(api_url + 'getUserSecurityQuestions/' + userName).then
        (function successCallback(response) {
            // alert(response.data);
            $scope.restore_pw_q = response.data[0]['question'];
        }, function errorCallback(response) {
            alert(response.status);
        });
    };

    $scope.restore_pw_a = "";

    $scope.restorePassword = function(){
        let answer = $scope.restore_pw_a;
        let userName = $scope.restore_pw_username;
        let question = $scope.restore_pw_q;
        alert("Security question is: " + question);
        $http.get(api_url + 'restorePassword/' + userName + "/" + answer + "/" + question).then
        (function successCallback(response) {
            // alert(response.data);
            $scope.restore_pw_password = response.data[0]['pass'];
        }, function errorCallback(response) {
            alert(response.status);
        });
    };

    function getAndShowPopularPois(){
        $http.get(api_url + 'getRandomPOI/100').then
        (function successCallback(response) {
            // alert(response.data);
            let topTwoRankedPois = getTwoTopRankedPois(response.data);
            $scope.loggedInUserPopularLbl1 = topTwoRankedPois[0]['poiName'];
            $scope.loggedInUserPopularLbl2 = topTwoRankedPois[1]['poiName'];
            $scope.loggedInUserPopularImg1 = topTwoRankedPois[0]['image'];
            $scope.loggedInUserPopularImg2 = topTwoRankedPois[1]['image'];
        }, function errorCallback(response) {
            alert(response.status);
        });
    }

    function getTwoTopRankedPois(pois){
        let ans = [];
        pois.sort(function(a, b){
            return parseFloat(a.poiRank) - parseFloat(b.poiRank);
        });
        ans.push(pois[0]);
        ans.push(pois[1]);
        return ans;
    }

    function showLastTwoFavoritePois(){
        let userName = $scope.user_label;
        $http.get(api_url + 'auth/getUserFavoriteInterests/' + userName, {headers:{"x-auth-token": self.token}}).then
        (function successCallback(response) {
            let dataLength = response.data.length;
            if(dataLength > 0){
                $scope.showNoFavoritesMessage = false;
                $scope.loggedInUserFavoriteLbl1 = response.data[dataLength - 1]['poiName'];
                $scope.loggedInUserFavoriteImg1 = response.data[dataLength - 1]['image'];
                if(dataLength > 1){
                    $scope.loggedInUserFavoriteLbl2 = response.data[dataLength - 2]['poiName'];
                    $scope.loggedInUserFavoriteImg2 = response.data[dataLength - 2]['image'];
                }
            }
        }, function errorCallback(response) {
            alert("failure, response message is: " + response.data);
        });
        //getUserFavoriteInterests

    }

    function showRandomPOIS(){
        let numOfPois = "3";
        $http.get(api_url + 'getRandomPOI/' + numOfPois).then
        (function successCallback(response) {
            $scope.first_poi_home = response.data[0]['poiName'];
            $scope.second_poi_home = response.data[1]['poiName'];
            $scope.third_poi_home = response.data[2]['poiName'];
            $scope.first_poi_image = response.data[0]['image'];
            $scope.second_poi_image = response.data[1]['image'];
            $scope.third_poi_image = response.data[2]['image'];
        }, function errorCallback(response) {
            alert(response.status);
        });
    }


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

        $http.post(api_url + 'login', data, config).then
        (function successCallback(response) {
            alert(response.data);
            self.token = response.data;
            alert("Current token is: " + self.token);
            $scope.registerNav = false;
            $scope.user_label = username;
            getAndShowPopularPois();
            showLastTwoFavoritePois();
            $scope.showSearch();
            $scope.showLoggedInPoiTable = true;
        }, function errorCallback(response) {
            alert(response.status);
        });
    };

    $scope.authentication = function() {
        alert("Current token is: " + self.token);
        var config = {
            headers: {
                "x-auth-token": self.token
            }
        };
        $http.get(api_url + 'auth/nizo', {headers:{"x-auth-token": self.token}}).then
        (function successCallback(response) {
            alert("success, response message is: " + response.data);
        }, function errorCallback(response) {
            alert("failure, response message is: " + response.data);
        });
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
    };


}]);
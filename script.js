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
    let modal = document.getElementById('myModal');
    let span = document.getElementsByClassName("close")[0];
    $scope.restore_pw_q = "";
    $scope.restore_pw_username = "";
    $scope.user_label = "Guest";
    $scope.numOfFavorites = 0;
    self.token = "";
    self.url = api_url;
    self.testFactory = testFactory;
    $scope.showRegister = function () {
        $scope.loginDiv = false;
        $scope.registerDiv = true;
        $scope.restorePWDiv = false;
        $scope.searchDiv = false;
        $scope.favoritesDiv = false;
    };
    $scope.showLogin = function () {
        if($scope.user_label !== "Guest"){
            alert("You are already logged in.");
        }
        else {
            $scope.loginDiv = true;
            $scope.registerDiv = false;
            $scope.restorePWDiv = false;
            $scope.searchDiv = false;
            $scope.favoritesDiv = false;
        }
    };
    $scope.showSearch = function () {
        $scope.loginDiv = false;
        $scope.registerDiv = false;
        $scope.restorePWDiv = false;
        $scope.searchDiv = true;
        $scope.favoritesDiv = false;
    };
    $scope.showRestorePW = function () {
        $scope.loginDiv = false;
        $scope.registerDiv = false;
        $scope.restorePWDiv = true;
        $scope.searchDiv = false;
        $scope.favoritesDiv = false;
    };
    $scope.showFavorites = function () {
        $scope.loginDiv = false;
        $scope.registerDiv = false;
        $scope.restorePWDiv = false;
        $scope.searchDiv = false;
        $scope.favoritesDiv = true;
        getAndShowFavorites();

    };

    $scope.popPoiInfo = function(poiName){
        $scope.popup_poi_name = poiName;
        $http.get(api_url + 'getInterestByName/' + poiName).then
        (function successCallback(response) {
            if(response.data.length > 0){
                let poi = response.data[0];
                $scope.popup_poi_image = poi['image'];
                $scope.popup_poi_views = poi['viewsNum'];
                let rank = poi['poiRank'];
                rank = rank/5;
                $scope.popup_poi_rank = rank.toString();
                if(poi['lastReviewID'] === -1){
                    $scope.popup_poi_first_review = $scope.popup_poi_second_review = "Sorry! No review was posted yet.";
                }
                else if(poi['beforeLastReviewID'] === -1){
                    $scope.popup_poi_first_review = 'SHOW FIRST REVIEW HERE :0';
                    $scope.popup_poi_second_review = "Sorry! No review was posted yet.";
                }
                else{
                    $scope.popup_poi_first_review = 'SHOW first REVIEW HERE :0';
                    $scope.popup_poi_second_review = "SHOW second REVIEW HERE :0";
                }
            }
        }, function errorCallback(response) {
            alert(response.status);
        });


        modal.style.display = "block";
    };

    span.onclick = function() {
        modal.style.display = "none";
    };
    //might delete later
    document.onkeydown = function(e) {
        e = e || window.event;
        var esc = false;
        if ("key" in e)
        {
            esc = (e.key === "Esc" || e.key === "Escape");
        }
        else
        {
            esc = (e.keyCode === 27);
        }
        if (esc) {
            modal.style.display = "none";
        }
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

    function getAndShowFavorites(){
        let userName = $scope.user_label;
        $scope.userFavoritePois = ['blaa!'];
        $scope.userFavoritePoiNames = ['bla'];
        $scope.userFavoritePoiImages = ['blaaa'];
        $http.get(api_url + 'auth/getUserFavoriteInterests/' + userName,{headers:{"x-auth-token": self.token}}).then
        (function successCallback(response) {
            $scope.userFavoritePois.splice(0,1);
            $scope.userFavoritePois = response.data;
            // alert(response.data.length + "length");
            // for(i=0; i < response.data; i++){
            //     alert('entered for');
            //     $scope.userFavoritePoiNames[i] = response.data[i]['poiName'];
            //     alert('poiName is:' + response.data[i]['poiName']);
            //     $scope.userFavoritePoiImages[i] = response.data[i]['image'];
            //     alert('poi image is:' + $scope.userFavoritePoiImages[i]);
            // }
        }, function errorCallback(response) {
            alert(response.status);
        });
    }

    function getAndShowNumberOfFavorites(){
        let userName = $scope.user_label;
        $http.get(api_url + 'auth/getNumberOfFavorites/' + userName,{headers:{"x-auth-token": self.token}}).then
        (function successCallback(response) {
            $scope.numOfFavorites = response.data[0]['count'];
        }, function errorCallback(response) {
            alert(response.status);
        });
    }

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
            // alert(response.data);
            self.token = response.data;
            // alert("Current token is: " + self.token);
            $scope.registerNav = false;
            $scope.favoritesNav = true;
            $scope.user_label = username;
            getAndShowPopularPois();
            showLastTwoFavoritePois();
            getAndShowNumberOfFavorites();
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
let app = angular.module('myApp', []);
let api_url = 'http://localhost:3000/';

let config = {
    headers: {
        'Content-Type': 'application/json'
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
    $scope.userLoggedInFlag = false;
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
        $scope.searchedPoiDiv = false;
        $scope.searchResultCategory = false;
        $scope.searchResultCategory = false;
        $scope.showSortSearchByRankButton = true;
        $scope.searchedByRankPoiDiv = false;
        if($scope.user_label !== 'Guest') {
            showLastTwoFavoritePois();
        }
    };
    $scope.showRestorePW = function () {
        $scope.loginDiv = false;
        $scope.registerDiv = false;
        $scope.restorePWDiv = true;
        $scope.searchDiv = false;
        $scope.favoritesDiv = false;
        $scope.searchedPoiDiv = false;
    };
    $scope.showFavorites = function () {
        $scope.searchResultCategory = false;
        $scope.loginDiv = false;
        $scope.registerDiv = false;
        $scope.restorePWDiv = false;
        $scope.searchDiv = false;
        $scope.favoritesDiv = true;
        $scope.randomFavoritesDiv = true;
        $scope.searchedPoiDiv = false;
        $scope.byCategoryFavoritesDiv = false;
        getAndShowFavorites();
    };

    $scope.popPoiInfo = function(poiName){
        $scope.popup_poi_name = poiName;
        $scope.popupReviewDiv = false;
        $http.get(api_url + 'getInterestByName/' + poiName).then
        (function successCallback(response) {
            if(response.data.length > 0) {
                setFavoriteMarkValue(poiName);
                let poi = response.data[0];
                $scope.popup_poi_image = poi['image'];
                $scope.popup_poi_views = poi['viewsNum'];
                $scope.popup_poi_description = poi['poiDescription'];
                getInterestRankPoi(poiName); //getInterestRankPoi
                $scope.popup_poi_second_review = "Sorry! No review was posted yet.";
                $scope.popup_poi_first_review = "Sorry! No review was posted yet.";
                $http.get(api_url + 'getReviews/' + poiName).then
                    (function successCallback(response) {
                        let ansLength = response.data.length;
                        if(ansLength > 1){
                            $scope.popup_poi_first_review = response.data[ansLength-1]['reviewDescription'];
                            $scope.popup_poi_second_review = response.data[ansLength-2]['reviewDescription'];
                        }
                        else if(ansLength > 0){
                            $scope.popup_poi_first_review = response.data[ansLength-1]['reviewDescription'];
                        }
                        else{
                            $scope.popup_poi_second_review = "Sorry! No review was posted yet.";
                            $scope.popup_poi_first_review = "Sorry! No review was posted yet.";
                        }
                    }, function errorCallback(response) {
                        alert(response.status);
                });
                // if (poi['lastReviewID'] === -1) {
                //     $scope.popup_poi_first_review = $scope.popup_poi_second_review = "Sorry! No review was posted yet.";
                // } else if (poi['beforeLastReviewID'] === -1) {
                //     $scope.popup_poi_first_review = 'SHOW FIRST REVIEW HERE :0';
                //     $scope.popup_poi_second_review = "Sorry! No review was posted yet.";
                // } else {
                //     $scope.popup_poi_first_review = 'SHOW first REVIEW HERE :0';
                //     $scope.popup_poi_second_review = "SHOW second REVIEW HERE :0";
                //     //TODO: Need to use the review id to get from DB the review content.
                // }
            }
        }, function errorCallback(response) {
            alert(response.status);
        });


        modal.style.display = "block";
    };

    function getInterestRankPoi(poiName){
        $http.get(api_url + 'getInterestRank/' + poiName).then
        (function successCallback(response) {
            // alert(response.data.length);
            // let rank = rank / 5;
            $scope.popup_poi_rank = response.data[0]['average'].toString();
            // let avgrank = response.data[0]['average'];
            // return avgrank;
        }, function errorCallback(response) {
            alert(response.status);
        });

    }

    $scope.addReview = function(poiName){
        $scope.popupReviewDiv = true;
    };

    function setFavoriteMarkValue(poiName){
        $scope.isPoiFavoritedValue = false;
        if($scope.userLoggedInFlag) {
            let userName = $scope.user_label;
            $http.get(api_url + 'auth/getUserFavoriteInterests/' + userName, {headers: {"x-auth-token": self.token}}).then
            (function successCallback(response) {
                if (response.data.length > 0) {
                    for (let i = 0; i < response.data.length && !$scope.isPoiFavoritedValue; i++)
                        if (response.data[i]['poiName'] === poiName) {
                            $scope.isPoiFavoritedValue = true;
                        }
                }
            }, function errorCallback(response) {
                alert(response.status);
            });
        }
    }

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
        // alert("Security question is: " + question);
        $http.get(api_url + 'restorePassword/' + userName + "/" + answer + "/" + question).then
        (function successCallback(response) {
            // alert(response.data);
            $scope.restore_pw_password = response.data[0]['pass'];
        }, function errorCallback(response) {
            alert(response.status);
        });
    };

    /**
     * Function basically only sorts favorite poi categories and assigns them to array: userFavoritePoisCategories
     * Assumption: $scope.userFavoritePois is not empty
     */
    $scope.sortByFavoritesCategories = function(){
        $scope.byCategoryFavoritesDiv = true;
        $scope.randomFavoritesDiv = false;
        $scope.userFavoritePoisCategories = {'bla':'kaka'};
        let categories = [];
        delete $scope.userFavoritePoisCategories['bla'];
        for(let i=0; i<$scope.userFavoritePois.length; i++){
            let category = $scope.userFavoritePois[i]['categoryName'];
            if(!categories.includes(category)){
                categories.push(category);
            }
        }
        categories.sort();
        for(let i=0; i<categories.length; i++){
            $scope.userFavoritePoisCategories[categories[i]] = [];
            for(let j=0; j<$scope.userFavoritePois.length; j++){
                let category = $scope.userFavoritePois[j]['categoryName'];
                if(categories[i] === category){
                    $scope.userFavoritePoisCategories[category].push($scope.userFavoritePois[j]);
                }
            }
        }
    };

    $scope.sortByFavoritesRank = function(){
        $scope.byCategoryFavoritesDiv = false;
        $scope.randomFavoritesDiv = true;
        $scope.userFavoritePois.sort(function(a, b){
            return b.poiRank - a.poiRank;
        });
    };

    $scope.favoriteCheckboxClicked = function(poiName){
        let value = $scope.isPoiFavoritedValue;
        let userName = $scope.user_label;
        let data = {
            "poiName": poiName,
            "userName": userName
        };

        var config = {
            headers: {
                'x-auth-token': self.token,
                'Content-Type': 'application/json'
            }
        };
        if(!$scope.isPoiFavoritedValue){ //Already favorited -> remove it.
            $http.post(api_url + 'auth/removeInterestFromFavorites', data, config).then
            (function successCallback(response) {
                alert(poiName + ' removed from your favorites!');
                getAndShowNumberOfFavorites();
                if($scope.randomFavoritesDiv || $scope.byCategoryFavoritesDiv) {
                    $scope.showFavorites();
                }
            }, function errorCallback(response) {
                alert(response.status);
            });
        }
        else{   //not favorited? add it.
            $http.post(api_url + 'auth/addInterestToFavorites', data, config).then
            (function successCallback(response) {
                alert(poiName + ' added to your favorites!');
                getAndShowNumberOfFavorites();
                if($scope.randomFavoritesDiv || $scope.byCategoryFavoritesDiv) {
                    $scope.showFavorites();
                }
            }, function errorCallback(response) {
                alert(response.status);
            });
        }
    };

    $scope.showSearchResultCategory = function(){
        $scope.searchPoisByName();
        $scope.searchResultCategory = true;
    };

    $scope.searchPoisByName = function(){
        $scope.byCategoryFavoritesDiv = true;
        $scope.randomFavoritesDiv = false;
        $scope.searchResultCategory = false;
        $scope.showSortSearchByRankButton = false;
        $scope.searchedByRankPoiDiv = false;
        $scope.userSearchPoisCategories = {'bla':'kaka'};
        let categories = [];
        $scope.searchedPois = ['bla'];
        let name = $scope.searchInputText;
        if(name.length > 0) {
            $http.get(api_url + 'getInterestByName/' + name).then
            (function successCallback(response) {
                delete $scope.userSearchPoisCategories['bla'];
                if (response.data.length > 0) {
                    $scope.searchedPoiDiv = true;
                    let category = response.data[0]['categoryName'];
                    $scope.userSearchPoisCategories[category] = [];
                    $scope.userSearchPoisCategories[category].push(response.data[0]);
                } else {
                    alert("No results were found.");
                    $scope.searchedPoiDiv = false;
                }
            }, function errorCallback(response) {
                alert(response.status);
            });
        }
        else{
            delete $scope.userSearchPoisCategories['bla'];
            $scope.searchedPoiDiv = true;
            $scope.searchResultCategory = true;
            $scope.showSortSearchByRankButton = true;
            $http.get(api_url + 'getRandomPOI/100').then
            (function successCallback(response) {
                for(let i=0; i<response.data.length; i++){
                    let category = response.data[i]['categoryName'];
                    if(!categories.includes(category)){
                        categories.push(category);
                    }
                }
                categories.sort();
                for(let i=0; i<categories.length; i++){
                    $scope.userSearchPoisCategories[categories[i]] = [];
                    for(let j=0; j<response.data.length; j++){
                        let category = response.data[j]['categoryName'];
                        if(categories[i] === category){
                            $scope.userSearchPoisCategories[category].push(response.data[j]);
                        }
                    }
                }

            }, function errorCallback(response) {
                alert(response.status);
            });
        }
    };

    $scope.postReview = function(poiName){
        let reviewDesc = $scope.reviewDescription;
        let reviewRank = $scope.reviewRank;
        let reviewNum = parseInt(reviewRank);
        if(reviewDesc.length == 0){
            alert('Please enter text to post a review.');
        }
        else if(reviewRank.length == 0 || reviewNum>5 || reviewNum<1){
            alert('Please enter rank between 1 and 5 to post a review.');
        }
        else{
            let data = {
                "poiName": poiName,
                "reviewDescription": reviewDesc,
                "reviewRank": reviewRank
            };
            var config = {
                headers: {
                    'x-auth-token': self.token,
                    'Content-Type': 'application/json'
                }
            };
                $http.post(api_url + 'auth/addReview', data, config).then
                (function successCallback(response) {
                    alert('Review posted!');
                }, function errorCallback(response) {
                    alert(response.status);
                });
            }

    };

    $scope.sortSearchResultsByRank = function(){
        if($scope.searchInputText.length == 0) {
            $scope.searchResultCategory = false;
            $scope.searchedPoiDiv = false;
            $scope.searchedByRankPoiDiv = true;
            $http.get(api_url + 'getRandomPOI/100').then
            (function successCallback(response) {
                let searchResults = sortPoisByRank(response.data);
                $scope.userSearchPoisRank = searchResults;
            }, function errorCallback(response) {
                alert(response.status);
            });
        }
    };

    function sortPoisByRank(pois){
        let ans = [];
        pois.sort(function(a, b){
            return b.poiRank - a.poiRank;
        });
        for(let i=0; i<pois.length; i++){
            ans.push(pois[i]);
        }
        return ans;
    }

    function getAndShowFavorites(){
        let userName = $scope.user_label;
        $scope.userFavoritePois = ['blaa!'];
        $scope.userFavoritePoiNames = ['bla'];
        $scope.userFavoritePoiImages = ['blaaa'];
        $http.get(api_url + 'auth/getUserFavoriteInterests/' + userName,{headers:{"x-auth-token": self.token}}).then
        (function successCallback(response) {
            $scope.userFavoritePois.splice(0,1);
            $scope.userFavoritePois = response.data;
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
            return b.poiRank - a.poiRank;
        });
        ans.push(pois[0]);
        ans.push(pois[1]);
        return ans;
    }

    function showLastTwoFavoritePois(){
        let userName = $scope.user_label;
        $scope.showUserFavoriteImage1 = false;
        $scope.showUserFavoriteImage2 = false;
        $http.get(api_url + 'auth/getUserFavoriteInterests/' + userName, {headers:{"x-auth-token": self.token}}).then
        (function successCallback(response) {
            let dataLength = response.data.length;
            if(dataLength > 0){
                $scope.showNoFavoritesMessage = false;
                $scope.loggedInUserFavoriteLbl1 = response.data[dataLength - 1]['poiName'];
                $scope.loggedInUserFavoriteImg1 = response.data[dataLength - 1]['image'];
                $scope.showUserFavoriteImage1 = true;
                if(dataLength > 1){
                    $scope.loggedInUserFavoriteLbl2 = response.data[dataLength - 2]['poiName'];
                    $scope.loggedInUserFavoriteImg2 = response.data[dataLength - 2]['image'];
                    $scope.showUserFavoriteImage2 = true;
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
            $scope.userLoggedInFlag = true;
            $scope.addReviewButton = true;
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
        // let username = $scope.register_username;
        // let password = $scope.register_password;
        let q1 = $scope.register_q1;
        let a1 = $scope.register_a1;
        let q2 = $scope.register_q2;
        let a2 = $scope.register_a2;

        let questions = [q1, q2]
        let answers = [a1, a2]

        let data = {
            "userName": $scope.register_username,
            "password": $scope.register_password,
            "fname": $scope.register_fname,
            "lname": $scope.register_lname,
            "city": $scope.register_city,
            "country": $scope.register_country,
            "email": $scope.register_email,
            "interests": $scope.register_category,
            "questions": questions,
            "answers": answers
        };

        $http.post(api_url + 'registerUser', data, config).then
        (function successCallback(response) {
            alert(response.data);
            $scope.showLogin();
        }, function errorCallback(response) {
            alert(response.status);
        });
    };


}]);
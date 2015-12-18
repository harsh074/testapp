askmonkApp.controller('settingCtrl', ['$scope','utility','$ionicHistory','$rootScope','$http','$state', function($scope,utility,$ionicHistory,$rootScope,$http,$state){
  $scope.logout = function(){
  	// utility.logout();
  	$scope.setAuth(false);
  	$ionicHistory.clearCache();
		$ionicHistory.clearHistory();
		$rootScope.profileData = null;
		localStorage.removeItem('token');
    localStorage.removeItem('userId');
    localStorage.removeItem("name");
    localStorage.removeItem("email");

    delete $http.defaults.headers.common.Authorization;
    $state.go('login');
    window.plugins.nativepagetransitions.slide(
      {"direction":"left"},
      function (msg) {console.log("success: " + msg)}, // called when the animation has finished
      function (msg) {alert("error: " + msg)} // called in case you pass in weird values
    );
  }

}]);
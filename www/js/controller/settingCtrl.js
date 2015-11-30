askmonkApp.controller('settingCtrl', ['$scope','utility','$ionicHistory','$rootScope', function($scope,utility,$ionicHistory,$rootScope){
  $scope.logout = function(){
  	utility.logout();
  	$scope.setAuth(false);
  	$ionicHistory.clearCache();
		$ionicHistory.clearHistory();
		$rootScope.profileData = null;
  }

}]);
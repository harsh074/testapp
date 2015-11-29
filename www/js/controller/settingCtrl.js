askmonkApp.controller('settingCtrl', ['$scope','utility', function($scope,utility){
  $scope.logout = function(){
  	utility.logout();
  	$scope.setAuth(false);
  }

}]);
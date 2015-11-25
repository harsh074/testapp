askmonkApp.controller('appCtrl', ['$scope', function($scope){
}]);

askmonkApp.controller('bodyCtrl', ['$scope','utility','CONSTANT','$rootScope','CONSTANT', function($scope,utility,CONSTANT,$rootScope,CONSTANT){
	document.addEventListener("deviceready", onDeviceReady, false);
  function onDeviceReady() {
  	console.log('deviceReady');
  }
	
	utility.initialize(CONSTANT.baseUrl, false, $scope, $rootScope);
}]);
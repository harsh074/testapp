askmonkApp.controller('appCtrl', ['$scope', function($scope){
}]);

askmonkApp.controller('bodyCtrl', ['$scope','utility','CONSTANT','$rootScope', function($scope,utility,CONSTANT,$rootScope){
		utility.initialize(CONSTANT.baseUrl, false, $scope, $rootScope);
}]);
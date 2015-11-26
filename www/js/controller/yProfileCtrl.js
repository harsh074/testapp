askmonkApp.controller('yProfileCtrl', ['$scope','$state', function($scope,$state){
	  $scope.askQuestion = function(){
	  	$state.go('app.askQuestion',{},{"reload":true})
	  }
}]);
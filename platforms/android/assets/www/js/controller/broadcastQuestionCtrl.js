askmonkApp.controller('broadcastQuestionCtrl', ['$scope','$state','utility','$stateParams','CONSTANT', function($scope,$state,utility,$stateParams,CONSTANT){
	
	if(!$scope.authenticated){
    $state.go('login');
  }
  $scope.floatingBtnAction = false;
  $scope.$on('$ionicView.enter', function(){
    $scope.floatingBtnAction = true;
    // $scope.showLoader();
  });

  $scope.loginType = CONSTANT.loginType;
  $scope.showLoader();
  utility.getSingleQuestions($stateParams.id)
  .then(function(data){
  	console.log(data);
    $scope.hideLoader();
    $scope.question = data;
  },function(data){
    $scope.hideLoader();
    if(data && data.error.statusCode == 422){
      $scope.showMessage(data.error.message);
    }else{
      $scope.showMessage("Something went wrong. Please try again.");
    }
  	// console.log(data);
  });

  $scope.goToWalletFromModal = function(){
    $scope.closeModal();
    $state.go('app.wallet');
  }
}])
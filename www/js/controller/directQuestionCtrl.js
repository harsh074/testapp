askmonkApp.controller('directQuestionCtrl', ['$scope','utility','$state','$stateParams', function($scope,utility,$state,$stateParams){

	$scope.noQuestionFound = false;
	$scope.search = {"searchInput":""};
  // $scope.loginType = CONSTANT.loginType;
  $scope.showClear = false;
  $scope.$on('$ionicView.enter', function(){
    $scope.showLoader();
  });

  utility.getDirectQuestion()
  .then(function(data){
    $scope.hideLoader();
    console.log(data);
    if(data.length>0){
      $scope.groups = data;
    }else{
      $scope.noQuestionFound = true
    }
  },function(data){
    $scope.hideLoader();
    console.log(data);
  });

  $scope.doRefresh = function() {
    // $scope.showLoader();
    utility.getDirectQuestion()
    .then(function(data){
      // $scope.hideLoader();
      $scope.$broadcast('scroll.refreshComplete');
      console.log(data);
      if(data.length>0){
        $scope.groups = data;
      }else{
        $scope.noQuestionFound = true
      }
    },function(data){
      $scope.hideLoader();
      console.log(data);
    });
  };


  $scope.goToQuestion = function(id){
    $stateParams.id = id;
    $state.go('app.singlequestion',$stateParams);
    $scope.transitionAnimation('left',180);
  }
  
  $scope.inputSearch = function(){
    if($scope.search.searchInput){
      $scope.showClear = true;
    }else{
      $scope.showClear = false;
    }
  }

  $scope.clearSearch = function(){
    $scope.showClear = false;
    $scope.search.searchInput = "";
  };
}]);
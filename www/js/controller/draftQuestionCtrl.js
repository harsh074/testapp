askmonkApp.controller('draftQuestionCtrl', ['$scope','utility','$state','$stateParams', function($scope,utility,$state,$stateParams){

  $scope.noQuestionFound = false;
  $scope.search = {"searchInput":""};
  // $scope.loginType = CONSTANT.loginType;
  $scope.showClear = false;
  $scope.$on('$ionicView.beforeEnter', function(){
    $scope.showLoader();
  });
  var indexGetQuestion = 0;
  $scope.noMoreQuestion = false;


  utility.monkDraftQuestion()
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
    if(data && data.error.statusCode == 422){
      $scope.showMessage(data.error.message);
    }else{
      $scope.showMessage("Something went wrong. Please try again.");
    }
    console.log(data);
  });

  $scope.doRefresh = function() {
    // $scope.showLoader();
    indexGetQuestion = 0;
    $scope.noMoreQuestion = false;

    utility.monkDraftQuestion()
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
      if(data && data.error.statusCode == 422){
        $scope.showMessage(data.error.message);
      }else{
        $scope.showMessage("Something went wrong. Please try again.");
      }
      console.log(data);
    });
  }

  $scope.goToQuestion = function(id){
    $stateParams.id = id;
    $state.go('app.singlequestion',$stateParams);
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
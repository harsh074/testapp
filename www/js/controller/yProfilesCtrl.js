askmonkApp.controller('yProfilesCtrl', ['$scope','$state','utility','$stateParams','CONSTANT','$timeout', function($scope,$state,utility,$stateParams,CONSTANT,$timeout){

  $scope.loginType = CONSTANT.loginType;
  $scope.showFilterMenu = false;

  $scope.sortedFilterValue = true;
  $scope.sortedFilter = 'rating';

  if(sessionStorage.monksProfiles){
    utility.getAllMonksCount()
    .then(function(data){
      $scope.monksProfiles = JSON.parse(sessionStorage.monksProfiles);
      for(var i=0;i<$scope.monksProfiles.length;i++){
        for (var key in data){
          if($scope.monksProfiles[i].id == key){
            $scope.monksProfiles[i].questionsAnswered = data[key][0]
            $scope.monksProfiles[i].profileViews = data[key][1]
            break;
          }
        }
      }
    },function(data){
      $scope.hideLoader();
      if(data && data.error.statusCode == 422){
        $scope.showMessage(data.error.message);
      }else{
        $scope.showMessage("Something went wrong. Please try again.");
      }
      sessionStorage.removeItem('monksProfiles');
      // console.log(data,"error");
    });

  }else{
    $scope.showLoader();
  	utility.getAllMonks()
  	.then(function(data){
  		$scope.hideLoader();
      $scope.monksProfiles = data;
      sessionStorage.setItem('monksProfiles',JSON.stringify(data));
  	},function(data){
      $scope.hideLoader();
      if(data && data.error.statusCode == 422){
        $scope.showMessage(data.error.message);
      }else{
        $scope.showMessage("Something went wrong. Please try again.");
      }
  		// console.log(data,"error");
  	});
  }

  $scope.goToYogiProfile = function(id){
  	$stateParams.id = id;
  	$state.go('app.yprofile',$stateParams);
  }

  $scope.askQuestion = function(){
  	$state.go('app.askQuestion');
  }

  $scope.showFilter = function(){
    $scope.showFilterMenu = true;
  }
  $scope.closeFilterMenu = function(){
    $scope.showFilterMenu = false;
  }

  $scope.sortFilter = function(value){
    if(value=="name"){
      $scope.sortedFilterValue = ($scope.sortedFilter === value) ? !$scope.sortedFilterValue : false;
    }else{
      $scope.sortedFilterValue = ($scope.sortedFilter === value) ? !$scope.sortedFilterValue : true;
    }
    $scope.sortedFilter = value;
    $scope.showFilterMenu = false;
  }
}]);
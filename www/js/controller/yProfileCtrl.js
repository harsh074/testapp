askmonkApp.controller('yProfileCtrl', ['$scope','$state','$stateParams','utility','$timeout', function($scope,$state,$stateParams,utility,$timeout){
	if($stateParams.id){

		$scope.$on('$ionicView.enter', function(){
    	$scope.showLoader();
  	});

		// if(localStorage.getItem('monksProfiles')){
		// 	var monksProfiles = JSON.parse(localStorage.getItem('monksProfiles'));
		// 	for(var i=0;i<monksProfiles.length;i++){
		// 		if(monksProfiles[i].id == $stateParams.id){
		// 			$scope.monkProfileData = monksProfiles[i];
		// 			$timeout(function(){
		// 				$scope.hideLoader();
		// 			}, 100);
		// 			break;
		// 		}
		// 	}
		// }else{
			utility.getSingleMonk($stateParams.id)
			.then(function(data){
				$scope.hideLoader();
				$scope.monkProfileData = data;
			},function(data){
				console.log(data);
				$scope.hideLoader();
			});
		// }

		$scope.askQuestion = function(){
			localStorage.setItem('directQuestion',JSON.stringify({'monkId':$scope.monkProfileData.id,'monkName':$scope.monkProfileData.name,"monkEmail":$scope.monkProfileData.email,"isDirect":true}));
	  	$state.go('app.askQuestion');
    	$scope.transitionAnimation('left',180);
	  }
	}else{
		$state.go('app.yprofiles');
  	$scope.transitionAnimation('left',180);
	}
}]);
askmonkApp.controller('yProfileCtrl', ['$scope','$state','$stateParams','utility','$timeout','CONSTANT','$ionicPopup', function($scope,$state,$stateParams,utility,$timeout,CONSTANT,$ionicPopup){
	if($stateParams.id){

		$scope.$on('$ionicView.beforeEnter', function(){
    	$scope.showLoader();
  	});
  	
  	$scope.loginType = CONSTANT.loginType;

		/*if(localStorage.getItem('monksProfiles')){
			var monksProfiles = JSON.parse(localStorage.getItem('monksProfiles'));
			for(var i=0;i<monksProfiles.length;i++){
				if(monksProfiles[i].id == $stateParams.id){
					$scope.monkProfileData = monksProfiles[i];
					$timeout(function(){
						$scope.hideLoader();
					}, 100);
					break;
				}
			}
		}else{*/
			utility.getSingleMonk($stateParams.id)
			.then(function(data){
				$scope.hideLoader();
				$scope.monkProfileData = data;
			},function(data){
				$scope.hideLoader();
				if(data && data.error.statusCode == 422){
	        $scope.showMessage(data.error.message);
	      }else{
	        $scope.showMessage("Something went wrong. Please try again.");
      	}
				// console.log(data);
			});
		// }

		$scope.askQuestion = function(){
			if($scope.monkProfileData.isAvailable){
				localStorage.setItem('directQuestion',JSON.stringify({'monkId':$scope.monkProfileData.id,'monkName':$scope.monkProfileData.name,"monkEmail":$scope.monkProfileData.email,"isDirect":true}));
		  	$state.go('app.askQuestion');
	    }else{
	    	var confirmPopup = $ionicPopup.show({
		      cssClass:"ios",
		      title: 'Monk is not available right now. Please try again after some time or post open question.',
		      // template:'Do u wish to continue ?',
		      buttons: [
			      {text: 'Yes',type:'button-ios button-clear',
			        onTap: function(e) {
			          return true;
			        }
			      },
			      {text:'No',type:'button-ios button-clear noBold',
			        onTap: function(e) {
			          return false;
			        }
			      }
			    ]
		    });
		    confirmPopup.then(function(res) {
		      if(res){
		        console.log('You are sure');
		        $state.go('app.askQuestion');
		      } else {
		        console.log('You are not sure');
		      }
		    });
	    }
	  }
	}else{
		$state.go('app.yprofiles');
	}
}]);
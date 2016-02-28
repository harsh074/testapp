askmonkApp.controller('fullPackagesCtrl', ['$scope','utility','$state','$ionicPopup','CONSTANT', function($scope,utility,$state,$ionicPopup,CONSTANT){

	$scope.args = {"email":localStorage.email,"userId":localStorage.userId,"question":"","questionTag":"","amount":"","durationMonths":""};

	if(sessionStorage.fullPackage){
		$scope.packages = JSON.parse(sessionStorage.fullPackage);
	}else{
		$scope.showLoader();
		utility.getFullPackages()
		.then(function(data){
			$scope.hideLoader();
			$scope.packages = data;
			sessionStorage.setItem('fullPackage',JSON.stringify(data));
		},function(data){
			$scope.hideLoader();
			if(data && data.error.statusCode == 422){
	      $scope.showMessage(data.error.message);
	    }else{
	      $scope.showMessage("Something went wrong. Please try again.");
	    }
			// console.log("error", data);
		});
	}

	utility.getUserCount()
  .then(function(data){
    $scope.getUserCount = data;
  },function(data){
    if(data && data.error.statusCode == 422){
      $scope.showMessage(data.error.message);
    }else{
      $scope.showMessage("Something went wrong. Please try again.");
    }
    // console.log(data);
  });

	$scope.selectedPackage = function(pack){
		console.log(pack);
		$scope.args.question = pack.name;
		$scope.args.questionTag = pack.questionTag;
		$scope.args.displayTag = pack.displayTag;
		$scope.args.amount = pack.amount;
		$scope.args.durationMonths = pack.durationMonths;
		$scope.postQuestion(pack);
	}

	$scope.money = {"customMoney":""};
	$scope.options = function(){
		$scope.amount = $scope.money.customMoney*100;
		var profileData = JSON.parse(localStorage.profile);
	 	var data = {
	  	description: "Ask Question",
	    currency: 'INR',
	    key: CONSTANT.razorPayKey,
	    amount: $scope.amount,
	    name: 'Askmonk',
	    prefill: {email:profileData.email,contact:profileData.mobile,name:profileData.name},
	    theme: {color: '#00BCD2'}
	  }
	  return data;
	}
	var successCallback = function(payment_id) {
    // alert('payment_id: ' + payment_id);
    if(payment_id){
    	$scope.showLoader();
	    utility.addMoney({'userId':localStorage.userId,'email':localStorage.email,'amount':$scope.amount,'payment_id':payment_id})
	    .then(function(data){
	    	$scope.hideLoader();
	    	$scope.showMessage('Transaction successful');
				localStorage.profile = JSON.stringify(data);
				$scope.postQuestion();
	    },function(data){
	    	$scope.hideLoader();
	    	if(data){
	        $scope.showMessage(data.error.message);
	      }else{
	        $scope.showMessage("Something went wrong. Please try again.");
	      }
	    });
	  }else{
			$scope.showMessage('Something went wrong. Try again');
	  }
  }
  var cancalCallback = function(error) {
    // alert(error.description + ' (Error '+error.code+')');
    $scope.showMessage(error.description);
  }	
	$scope.openInsufficientPopup = function(){
		var confirmPopup = $ionicPopup.show({
	    cssClass:"ios",
	    title: 'Insufficient Funds. Please pay to continue asking',
	    template:'<ion-md-input name="addMoney" type="tel" placeholder="Rs." highlight-color="calm" ng-pattern="/^[0-9]+$/" ng-model="money.customMoney" ng-disabled="true"></ion-md-input>',
	    scope:$scope,
	    buttons: [
	      {text: 'Yes',type:'button-ios button-clear',
	        onTap: function(e) {
	          return true;
	        }
	      },
	      {text:'No',type:'button-ios button-clear',
	        onTap: function(e) {
	          return false;
	        }
	      }
	    ]
	  });
	  // angular.element(document.getElementByClassName('backdrop').style('opacity',1));
	  confirmPopup.then(function(res) {
	    if(res) {
	    	RazorpayCheckout.open($scope.options(), successCallback, cancalCallback);
	      console.log('You are sure');
	    } else {
	      console.log('You are not sure');
	    }
	  });
	}

	$scope.postQuestion = function(pack){
		// console.log($scope.args);
		if($scope.getUserCount.emailVerified){
			$scope.showLoader();
			utility.postQuestionPackages($scope.args)
			.then(function(data){
				console.log(data);
				$state.go('app.dashboard');
			},function(data){
				$scope.hideLoader();
				if(data.error.message.indexOf('Insufficient Funds') == 0){
					console.log($scope.getUserCount);
					$scope.showMessage(data.error.message);
					if($scope.getUserCount && $scope.getUserCount.walletMoney){
						$scope.money.customMoney = pack.amount - $scope.getUserCount.walletMoney;
					}else{
						$scope.money.customMoney = pack.amount;
					}
					$scope.openInsufficientPopup();
				}else if(data && data.error.statusCode == 422){
	        $scope.showMessage(data.error.message);
	      }else{
	        $scope.showMessage("Something went wrong. Please try again.");
	      }
			});
		}else{
    	$scope.showMessage("Please verify your email");
    	return;
    }
	}
}]);
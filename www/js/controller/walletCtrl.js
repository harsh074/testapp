askmonkApp.controller('walletCtrl', ['$scope','utility','$state','CONSTANT','$timeout', function($scope,utility,$state,CONSTANT,$timeout){
	
	$scope.floatingBtnAction = false;
  $scope.$on('$ionicView.enter', function(){
    $scope.floatingBtnAction = true;
    $scope.showLoader();
  });
  $scope.loginType = CONSTANT.loginType;

  $scope.askQuestion = function(){
  	$state.go('app.askQuestion');
		$scope.transitionAnimation('left',180);
  }
  if(localStorage.getItem("profile")){
    $scope.userProfileData = JSON.parse(localStorage.getItem("profile"));
    $timeout(function(){
      $scope.hideLoader();
    }, 100);
  }else{
	  if($scope.loginType == 'user'){
			utility.getUserProfile(localStorage.getItem('userId'))
			.then(function(data){
				$scope.userProfileData = data;
				$scope.hideLoader();
			},function(data){
				console.log(data);
				$scope.hideLoader();
			});
		}else{
			utility.getMonkProfile()
			.then(function(data){
				$scope.userProfileData = data;
				$scope.hideLoader();
			},function(data){
				console.log(data);
				$scope.hideLoader();
			});
		}
	}


	// Razorpay payment gateway
	$scope.options = function(args){
	 	var data = {
	  	description: args.name,
	    currency: 'INR',
	    key: 'rzp_test_2jGmoGfR3KHvoA',
	    amount: args.amount*100,
	    name: 'Askmonk',
	    prefill: {email:$scope.userProfileData.email, name:$scope.userProfileData.name},
	    theme: {color: '#00BCD2'}
	  }
	  return data;
	}
  var successCallback = function(payment_id) {
    alert('payment_id: ' + payment_id);
  }
  var cancalCallback = function(error) {
    alert(error.description + ' (Error '+error.code+')');
  }	
	$scope.getPayment = function(args){
		// console.log(args,$scope.userProfileData);
  	RazorpayCheckout.open($scope.options(args), successCallback, cancalCallback);
  }


  if(localStorage.getItem('packs')){
  	$scope.packs = JSON.parse(localStorage.getItem('packs'));
  }else{
		utility.getPacks()
		.then(function(data){
			localStorage.setItem('packs',JSON.stringify(data));
			$scope.packs = data;
		},function(data){
			console.log(data);
		});
	}
  
}]);

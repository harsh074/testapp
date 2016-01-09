askmonkApp.controller('walletCtrl', ['$scope','utility','$state','CONSTANT','$timeout', function($scope,utility,$state,CONSTANT,$timeout){
	
	$scope.floatingBtnAction = false;
  $scope.$on('$ionicView.enter', function(){
    $scope.floatingBtnAction = true;
    $scope.showLoader();
  });
  $scope.loginType = CONSTANT.loginType;
  $scope.money = {'customMoney':"100"};

  $scope.askQuestion = function(){
  	$state.go('app.askQuestion');
		$scope.transitionAnimation('left',180);
  }
  if(localStorage.getItem("profile")){
    $scope.walletMoney = JSON.parse(localStorage.getItem("profile")).walletMoney;
    $timeout(function(){
      $scope.hideLoader();
    }, 100);
  }else{
	  if($scope.loginType == 'user'){
			utility.getUserProfile(localStorage.getItem('userId'))
			.then(function(data){
				$scope.walletMoney = data.walletMoney;
				$scope.hideLoader();
			},function(data){
				console.log(data);
				$scope.hideLoader();
			});
		}else{
			utility.getMonkProfile()
			.then(function(data){
				$scope.walletMoney = data.walletMoney;
				$scope.hideLoader();
			},function(data){
				console.log(data);
				$scope.hideLoader();
			});
		}
	}


	// Razorpay payment gateway
	$scope.options = function(args){
		$scope.amount = args.amount*100;
		var profileData = JSON.parse(localStorage.profile);
	 	var data = {
	  	description: args.name,
	    currency: 'INR',
	    key: 'rzp_test_2jGmoGfR3KHvoA',
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
	    utility.addMoney({'userId':localStorage.getItem('userId'),'email':localStorage.getItem('email'),'amount':$scope.amount,'payment_id':payment_id})
	    .then(function(data){
	    	$scope.hideLoader();
	    	$scope.showMessage('Transaction successfull');
	    	$scope.walletMoney = data.walletMoney;
				localStorage.profile = JSON.stringify(data);
	    },function(data){
	    	$scope.showMessage('Something went wrong. Try again');
	    });
	  }else{
			$scope.showMessage('Something went wrong. Try again');
	  }
  }
  var cancalCallback = function(error) {
    // alert(error.description + ' (Error '+error.code+')');
    $scope.showMessage(error.description);
  }	
	$scope.getPayment = function(args){
		// console.log(args,$scope.userProfileData);
  	RazorpayCheckout.open($scope.options(args), successCallback, cancalCallback);
  }
  $scope.addCustomMoney = function(formData){
  	if(formData.$valid){
  		if($scope.money.customMoney>=100){
				$scope.getPayment({'amount':$scope.money.customMoney,'name':"Custom"})				  			
  		}else{
  			$scope.showMessage('Minimum amount Rs.100');
  		}
  	}else{
  		$scope.showMessage('Please enter valid amount');
  	}
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

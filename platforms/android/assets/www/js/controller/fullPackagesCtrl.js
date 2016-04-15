askmonkApp.controller('fullPackagesCtrl', ['$scope','utility','$state','$ionicPopup','CONSTANT','$ionicModal', function($scope,utility,$state,$ionicPopup,CONSTANT,$ionicModal){

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
		$scope.selectedPackageDetails = pack;
		$scope.args.question = pack.name;
		$scope.args.questionTag = pack.questionTag;
		$scope.args.displayTag = pack.displayTag;
		$scope.args.amount = pack.amount;
		$scope.args.durationMonths = pack.durationMonths;
		var confirmPopup = $ionicPopup.show({
	    cssClass:"ios",
	    title: 'Please Select Preferred Language',
	    buttons: [
	      {text: 'English',type:'button-ios button-clear noBold',
	        onTap: function(e) {
	          return "english";
	        }
	      },
	      {text:'Hindi',type:'button-ios button-clear',
	        onTap: function(e) {
	          return "hindi";
	        }
	      }
	    ]
	  });
	  // angular.element(document.getElementByClassName('backdrop').style('opacity',1));
	  confirmPopup.then(function(res) {
	  	if(res){
	    	$scope.args.languageSelection = res;
				// $scope.postQuestion(pack);
				$scope.goTopaymentModal();
	  	}
	  });
	}

	/*$scope.options = function(){
		$scope.amount = $scope.money.customMoney*100;
		var profileData = JSON.parse(localStorage.profile);
	 	var data = {
	  	description: "Ask Question",
	    currency: 'INR',
	    image: CONSTANT.razorPayImage,
	    key: CONSTANT.razorPayKey,
	    amount: $scope.amount,
	    name: 'Askmonk',
	    prefill: {email:profileData.email,contact:profileData.mobile,name:profileData.name},
	    theme: {color: '#00BCD2'}
	  }
	  return data;
	}*/

	$scope.startPostingQuestion = function(paymentId,transactionId,paymentType) {
		// if(CONSTANT.PRODUCTION_MODE){
	 //  	$scope.amount = $scope.args.amount;
		// }else{
			$scope.amount = 1;
		// }
		var options = {'userId':localStorage.userId,'email':localStorage.email,'paymentId':paymentId,'transactionId':transactionId,'paymentType':paymentType,'amount':$scope.amount};

    utility.addMoney(options)
    .then(function(data){
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
	}
  /*var cancalCallback = function(error) {
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
	}*/
	$scope.goTopaymentModal = function(){
		if(!$scope.getUserCount.emailVerified){
    	$scope.showMessage("Please verify your email");
    	return;
    }
    $ionicModal.fromTemplateUrl('paymentAnalysisDetailsModal.html', function (modal) {
      $scope.paymentDetailsModal = modal;
      $scope.paymentDetailsModal.show();
    },{
      scope: $scope,
      animation: 'slide-in-right',
      hardwareBackButtonClose: true
    });
	}

	$scope.postQuestion = function(){
		// console.log($scope.args);
		if($scope.getUserCount.emailVerified){
			utility.postQuestionPackages($scope.args)
			.then(function(data){
				utility.getUserCount()
				.then(function(data1){
					var profileData = JSON.parse(localStorage.profile);
					profileData.totalQuestionsAsked = data1.totalQuestionsAsked;
					localStorage.setItem('updateDashboard',true);
					localStorage.profile = JSON.stringify(profileData);
					$scope.hideLoader();
					$scope.closeModal();
					$state.go('app.dashboard');
				},function(data1){
					$scope.hideLoader();
					if(data1 && data1.error.statusCode == 422){
		        $scope.showMessage(data1.error.message);
		      }else{
		        $scope.showMessage("Something went wrong. Please try again.");
		      }
				});
			},function(data){
				$scope.hideLoader();
				/* if(data.error.message.indexOf('Insufficient Funds') == 0){
					console.log($scope.getUserCount);
					$scope.showMessage(data.error.message);
					if($scope.getUserCount && $scope.getUserCount.walletMoney){
						$scope.money.customMoney = pack.amount - $scope.getUserCount.walletMoney;
					}else{
						$scope.money.customMoney = pack.amount;
					}
					$scope.openInsufficientPopup();
				}else*/
				if(data && data.error.statusCode == 422){
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

	$scope.closeModal = function(){
		if($scope.paymentDetailsModal && $scope.paymentDetailsModal.isShown()){
      $scope.paymentDetailsModal.remove();
    }
	}
}]);

askmonkApp.controller('paymentAnalysisDetailsModalCtrl', ['$scope','base64Encoding','CONSTANT', function($scope,base64Encoding,CONSTANT){
	console.log($scope.selectedPackageDetails);
	$scope.paymentAskQuestion =  angular.copy($scope.selectedPackageDetails);
	$scope.totalAmount = $scope.paymentAskQuestion.amount;
	$scope.serviceTax = $scope.totalAmount*0.15;
	$scope.basicCost = $scope.totalAmount - $scope.serviceTax;

	$scope.payWithPayU = function(){
		$scope.showLoader();
		// TODO: payUId ain place of 121195
		// TODO : paymentType = paytm, payUMoney
		var paymentId;
		// if(CONSTANT.PRODUCTION_MODE){
		// 	var ref = window.open('https://www.payumoney.com/paybypayumoney/#/'+selectedPackageDetails.payUId, '_blank', 'location=no');
		// }else{
			var ref = window.open('https://www.payumoney.com/paybypayumoney/#/121195', '_blank', 'location=no');
			// var ref = window.open('https://www.payumoney.com/payment/notification/success/#/101232542', '_blank', 'location=no');
		// }
    ref.addEventListener('loadstart', function(event) { 
      if(event.url.indexOf('payumoney') > -1){
        if(event.url.indexOf('payment/notification/success') > -1){
          paymentId = event.url.split('/')[event.url.split('/').length-1];
          var paymentType = "payUMoney";
          var transactionId = '121195-'+paymentId;
      		ref.close();
      		$scope.startPostingQuestion(paymentId,transactionId,paymentType);
        }
      }
    });
    ref.addEventListener('exit', function(event) {
    	if(typeof paymentId =='undefined' || !paymentId){
    		$scope.hideLoader();
    		$scope.showMessage('Transaction Cancelled');
    		alert(event.type);
    	};
    });
	}

	var successCallback = function(data){
		// alert(JSON.stringify(data));
		console.log(data);
    var paymentType = "paytm";
		var transactionId = data.ORDERID;
		var paymentId = data.TXNID;
		$scope.startPostingQuestion(paymentId,transactionId,paymentType);
	}

	var failureCallback = function(data){
		$scope.hideLoader();
		console.log(data);
	}

	$scope.payWithPayTm = function(){
		$scope.showLoader();
		var order_id = base64Encoding.encode("ASKMONK|"+Date.now())
		var customer_id = localStorage.userId;
		var email = localStorage.email;
		var phone = JSON.parse(localStorage.profile).mobile;
		var amount = $scope.totalAmount;
		window.plugins.paytm.startPayment(order_id, customer_id, email, phone, amount, successCallback, failureCallback);
	}

}]);
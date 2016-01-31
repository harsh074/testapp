askmonkApp.controller('singleQuestionCtrl', ['$scope','$state','utility','$timeout','$stateParams','CONSTANT','$ionicModal','$ionicPopup', function($scope, $state, utility,$timeout,$stateParams,CONSTANT,$ionicModal,$ionicPopup){
  if(!$scope.authenticated){
    $state.go('login');
  }
  $scope.floatingBtnAction = false;
  $scope.$on('$ionicView.enter', function(){
    $scope.floatingBtnAction = true;
    $scope.showLoader();
  });

  if(localStorage.getItem('questionStatus') == "underObservation"){
    CONSTANT.isComingFromSignUp = true;
    $scope.$emit('writeAnswerActive');
  }

  $scope.loginType = CONSTANT.loginType;
  $scope.ratingSubmitted = false;
  $scope.ratingEdit = false;

  $scope.askQuestion = function(){
  	$state.go('app.askQuestion');
    $scope.transitionAnimation('left',180);
  }

  utility.getSingleQuestions($stateParams.id)
  .then(function(data){
  	console.log(data);
    $scope.hideLoader();
    $scope.question = data;
    if($scope.question.status == "underObservation"){
      var alertPopup = $ionicPopup.alert({
        cssClass:"ios",
        title: 'This question is already taken. Please try another question',
        buttons: [
          {text: 'Ok',type:'button-ios button-clear',
            onTap: function(e) {
              return true;
            }
          }
        ]
      });
      alertPopup.then(function(res) {
        $state.go('app.dashboard');
      });
    }
  },function(data){
    $scope.hideLoader();
  	console.log(data);
  });

  $scope.viewPartnerDetails = function(){
    $ionicModal.fromTemplateUrl('views/viewPartnerDetailModal.html', function (modal) {
      $scope.viewPartnerDetailModal = modal;
      $scope.viewPartnerDetailModal.show();
    }, {
      scope: $scope,
      animation: 'slide-in-up'
    });
  }
  $scope.editQuestion = function(){
    $ionicModal.fromTemplateUrl('views/editQuestionModal.html', function (modal) {
      $scope.editQuestionModal = modal;
      $scope.editQuestionModal.show();
    }, {
      scope: $scope,
      animation: 'slide-in-right'
    });
  }

  $scope.ratingEditing = function(){
    $scope.ratingEdit = true;
  }

  $scope.rateQuestion = function(){
    console.log($scope.question);
    utility.ratingQuestion({"userId":localStorage.getItem('userId'),"email":$scope.question.email,"id":$scope.question.id,"status":$scope.question.status,"rating":$scope.question.rating})
    .then(function(data){
      console.log("success",data);
      $scope.question = angular.copy(data);
      $scope.ratingSubmitted = true;
      $scope.ratingEdit = false;
    },function(data){
      console.log(data,"error");
    })
  }

  // For Monk
  $scope.writtenAnswer = localStorage.getItem('answer');
  $scope.openWriteModal = function(){
    $ionicModal.fromTemplateUrl('views/writeAnswerModal.html', function (modal) {
      $scope.writeAnswerModal = modal;
      $scope.writeAnswerModal.show();
    }, {
      scope: $scope,
      animation: 'slide-in-up',
      hardwareBackButtonClose: true
    });
  }
  
  $scope.userDetail = function(){
    $ionicModal.fromTemplateUrl('views/userDetailModal.html', function (modal) {
      $scope.userDetailModal = modal;
      $scope.userDetailModal.show();
    }, {
      scope: $scope,
      animation: 'slide-in-up'
    });
  }

  $scope.acceptQuestion = function(){
    $scope.showLoader();
    utility.acceptQuestionMonk({"userId":$scope.question.userId,"email":$scope.question.email,"id":$scope.question.id,"monkId":localStorage.getItem('userId'),"monkEmail":localStorage.getItem('email'),"status": "asked"})
    .then(function(data){
      CONSTANT.isComingFromSignUp = true;
      $scope.$emit("writeAnswerActive");
      $scope.question = angular.copy(data);
      localStorage.setItem('questionStatus',$scope.question.status);
      localStorage.setItem('questionId',$scope.question.id);
      $scope.hideLoader();
      $timeout(function(){
        $scope.openWriteModal();
      }, 100);
      console.log(data,"success");
    },function(data){
      console.log(data,"error");
    })
  }

  $scope.askBeforeAccept = function(){
    var confirmPopup = $ionicPopup.show({
      cssClass:"ios",
      title: 'After accepting a question answering it is mandatory.',
      template:'Do u want to proceed ?',
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
    confirmPopup.then(function(res) {
      if(res) {
        $scope.acceptQuestion();
      } else {
        console.log('You are not sure');
      }
    });
  }

  $scope.closeAnswerPopup = function(){
    $scope.writtenAnswer = localStorage.getItem('answer');
    if ($scope.writeAnswerModal && $scope.writeAnswerModal.isShown()) {
      $scope.writeAnswerModal.remove();
    }
  }

  $scope.postAnswer = function(){
    if(localStorage.getItem('answer') != ""){
      $scope.question.answer = localStorage.getItem('answer');
      var confirmPopup = $ionicPopup.show({
        cssClass:"ios",
        title: 'Going further would send the answer to the user.',
        template:'Do u wish to continue ?',
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
      confirmPopup.then(function(res) {
        if(res) {
          if($scope.question.answer.length<100){
            $scope.showMessage("Minimum character length is 100.");
            return;
          }
          $scope.showLoader();
          console.log('You are sure');
          utility.submitAnswer($scope.question)
          .then(function(data){
            // console.log(data);
            $scope.hideLoader();
            CONSTANT.isComingFromSignUp = false;
            $scope.$emit("writeAnswerActive");
            $scope.writtenAnswer = '';
            localStorage.removeItem('answer');
            localStorage.removeItem('questionStatus');
            localStorage.removeItem('questionId');
            $scope.question = angular.copy(data);
          },function(data){
            $scope.hideLoader();
            console.log(data);
          });
        } else {
          console.log('You are not sure');
        }
      });
    }
  }

  $scope.closeEditModal = function(data){
    $scope.question = angular.copy(data);
    $scope.hideLoader();
    if($scope.editQuestionModal && $scope.editQuestionModal.isShown()){
      $scope.editQuestionModal.remove();
    }
  }

  $scope.closeModal = function(){
    if($scope.userDetailModal && $scope.userDetailModal.isShown()){
      $scope.userDetailModal.remove();
    }
    if($scope.writeAnswerModal && $scope.writeAnswerModal.isShown()){
      $scope.writeAnswerModal.remove();
    }
    if($scope.viewPartnerDetailModal && $scope.viewPartnerDetailModal.isShown()){
      $scope.viewPartnerDetailModal.remove();
    }
    if($scope.editQuestionModal && $scope.editQuestionModal.isShown()){
      $scope.editQuestionModal.remove();
    }
  }
  $scope.goToWalletFromModal = function(){
    $scope.closeModal();
    $state.go('app.wallet');
  }
  
}]);

askmonkApp.controller('writeAnswerModalPopupCtrl', ['$scope','$timeout', function($scope,$timeout){
  $scope.writeAnswerTextarea = {'answer':""};
  if(localStorage.getItem('answer')){
    $scope.writeAnswerTextarea.answer = localStorage.getItem('answer');
  }
  $scope.closeWriteAnswerPopup = function(){
    $timeout(function(){
      $scope.closeAnswerPopup();
    }, 250);
    cordova.plugins.Keyboard.close();
  }
  $scope.expandText = function(){
    localStorage.setItem('answer',$scope.writeAnswerTextarea.answer);
    var element = document.getElementById("writeAnswerTextarea");
    element.style.height =  element.scrollHeight + "px";
  }
}]);

askmonkApp.controller('userDetailModalPopupCtrl', ['$scope','utility','getMoonSign', function($scope,utility,getMoonSign){
  $scope.profileInfo = angular.copy(getMoonSign($scope.question));
  $scope.profileImage = 'img/moonSign/'+$scope.profileInfo.moonSign+'.png';
}]);

askmonkApp.controller('viewPartnerDetailModalCtrl', ['$scope','getMoonSign', function($scope,getMoonSign){
  $scope.partnerProfileInfo = angular.copy(getMoonSign($scope.question.matchMakingDetails));
  $scope.partnerProfileImage = 'img/moonSign/'+$scope.partnerProfileInfo.moonSign+'.png';;
}]);

askmonkApp.controller('editQuestionModalCtrl', ['$scope','utility','$timeout', function($scope,utility,$timeout){
  $scope.editQuestion = angular.copy($scope.question);
  console.log($scope.question);
  if(localStorage.tagQuestion){
    $scope.questionTag = JSON.parse(localStorage.getItem('tagQuestion'));
    $scope.hideLoader();
  }else{
    utility.getAllQuestion()
    .then(function(data){
      $scope.hideLoader();
      $scope.questionTag = data;
      localStorage.setItem('tagQuestion',JSON.stringify(data));
    },function(data){
      $scope.hideLoader();
      console.log(data);
    });
  }

  if($scope.editQuestion.questionTag == "Match Making"){
    $scope.editQuestion.matchMakingDetails.partnerBirthTime = angular.copy(new Date($scope.editQuestion.matchMakingDetails.partnerBirthTime));
    $scope.editQuestion.matchMakingDetails.partnerDOB = angular.copy(new Date($scope.editQuestion.matchMakingDetails.partnerDOB));
    $timeout(function(){
      if($scope.editQuestion.matchMakingDetails.partnerBirthPlace){
        angular.element(document.getElementsByClassName('ion-google-place')).addClass('used');
      }
    }, 50);
    $scope.datepickerObject = {
      titleLabel: 'DOB',
      todayLabel: 'Today',
      closeLabel: 'Close',
      setLabel: 'Set',
      setButtonType : 'button-askmonk',
      todayButtonType : 'button-askmonk',
      closeButtonType : 'button-askmonk',
      inputDate: $scope.editQuestion.matchMakingDetails.partnerDOB,
      mondayFirst: true,
      templateType: 'popup',
      showTodayButton: 'false',
      modalHeaderColor: 'bar-positive',
      modalFooterColor: 'bar-positive',
      from: new Date(1940, 1, 1),
      to: new Date(),
      callback: function (val) {
        datePickerCallback(val);
      },
      dateFormat: 'dd-MM-yyyy',
      closeOnSelect: true
    };
    
    function datePickerCallback(val){
      $scope.showDate = true;
      if(val){
        $scope.datepickerObject.inputDate = val;
      }else{
        $scope.datepickerObject.inputDate = new Date();
      }
      $scope.editQuestion.matchMakingDetails.partnerDOB = angular.copy($scope.datepickerObject.inputDate);
    }
  }

  $scope.saveEditQuestion = function(){
    $scope.showLoader();
    utility.editQuestion($scope.editQuestion)
    .then(function(data){
      console.log(data,"success");
      $scope.closeEditModal(data);
    },function(data){
      $scope.hideLoader();
      console.log(data,"error");
    })
  }
}]);
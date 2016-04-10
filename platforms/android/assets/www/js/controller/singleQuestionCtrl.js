askmonkApp.controller('singleQuestionCtrl', ['$scope','$state','utility','$timeout','$stateParams','CONSTANT','$ionicModal','$ionicPopup', function($scope, $state, utility,$timeout,$stateParams,CONSTANT,$ionicModal,$ionicPopup){
  if(!$scope.authenticated){
    $state.go('login');
  }
  $scope.floatingBtnAction = false;
  $scope.$on('$ionicView.enter', function(){
    $scope.floatingBtnAction = true;
    // $scope.showLoader();
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
  }
  
  $scope.showLoader();
  utility.getSingleQuestions($stateParams.id)
  .then(function(data){
  	console.log(data);
    $scope.hideLoader();
    $scope.question = data;
    if($scope.question.status == "underObservation" && $scope.question.monkId != localStorage.userId){
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
    /*else if($scope.question.status == "answered" && $scope.question.monkId != localStorage.userId){
      var confirmPopup = $ionicPopup.show({
        cssClass:"ios",
        title: 'Please rate the question.',
        template:'<div class="ratingMonkQuestion"><rating ng-model="question.rating" max="5"></rating></div>',
        scope: $scope,
        buttons: [
          {text: 'Submit',type:'button-ios button-clear',
            onTap: function(e) {
              return true;
            }
          },
          {text:'Close',type:'button-ios button-clear',
            onTap: function(e) {
              return false;
            }
          }
        ]
      });
      confirmPopup.then(function(res) {
        if(res) {
          $scope.rateQuestion();
          console.log('You are sure');
        } else {
          console.log('You are not sure');
        }
      });
    }*/
  },function(data){
    $scope.hideLoader();
    if(data && data.error.statusCode == 422){
      $scope.showMessage(data.error.message);
    }else{
      $scope.showMessage("Something went wrong. Please try again.");
    }
  	// console.log(data);
  });

  $scope.viewPartnerDetails = function(){
    $ionicModal.fromTemplateUrl('views/viewPartnerDetailModal.html', function (modal) {
      $scope.viewPartnerDetailModal = modal;
      $scope.viewPartnerDetailModal.show();
    }, {
      scope: $scope,
      animation: 'slide-in-right'
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
    $scope.showLoader();
    utility.ratingQuestion({"userId":localStorage.getItem('userId'),"email":$scope.question.email,"id":$scope.question.id,"status":$scope.question.status,"rating":$scope.question.rating})
    .then(function(data){
      console.log("success",data);
      $scope.hideLoader();
      $scope.question = angular.copy(data);
      $scope.ratingSubmitted = true;
      $scope.ratingEdit = false;
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

  $scope.writtenSolution = localStorage.getItem('solution');
  $scope.openWriteSolutionModal = function(){
    $ionicModal.fromTemplateUrl('views/writeSolutionModal.html', function (modal) {
      $scope.writeSolutionModal = modal;
      $scope.writeSolutionModal.show();
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
      animation: 'slide-in-right'
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
      $scope.hideLoader();
      if(data && data.error.statusCode == 422){
        $scope.showMessage(data.error.message);
      }else{
        $scope.showMessage("Something went wrong. Please try again.");
      }
      // console.log(data,"error");
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

  $scope.closeSolutionPopup = function(){
    $scope.writtenSolution = localStorage.getItem('solution');
    if ($scope.writeSolutionModal && $scope.writeSolutionModal.isShown()) {
      $scope.writeSolutionModal.remove();
    }
  }

  $scope.postAnswer = function(){
    if(localStorage.getItem('answer') == ""){
      $scope.showMessage("Please write your answer");
      return;
    }
    if(localStorage.getItem('solution') == ""){
      $scope.showMessage("Please write your solution");
      return;
    }
    $scope.question.answer = localStorage.getItem('answer');
    $scope.question.solution = localStorage.getItem('solution');
    var confirmPopup = $ionicPopup.show({
      cssClass:"ios",
      title: 'Going further would sent the answer to the user.',
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
        if(!$scope.question.answer){
          $scope.showMessage("Please write answer");
          return;
          if($scope.question.answer.length<100){
            $scope.showMessage("Minimum character length is 100.");
            return;
          }
        }
        if(!$scope.question.solution){
          $scope.showMessage("Please write solution");
          return;
          if($scope.question.solution.length<25){
            $scope.showMessage("Minimum character length is 25.");
            return;
          }
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
          $scope.writtenSolution = '';
          localStorage.removeItem('solution');
          localStorage.removeItem('questionStatus');
          localStorage.removeItem('questionId');
          $scope.question = angular.copy(data);
        },function(data){
          $scope.hideLoader();
          if(data && data.error.statusCode == 422){
            $scope.showMessage(data.error.message);
          }else{
            $scope.showMessage("Something went wrong. Please try again.");
          }
          console.log(data);
        });
      } else {
        console.log('You are not sure');
      }
    });
  }

  $scope.closeEditModal = function(data){
    $scope.question = angular.copy(data);
    $scope.hideLoader();
    if($scope.editQuestionModal && $scope.editQuestionModal.isShown()){
      $scope.editQuestionModal.remove();
    }
    if($scope.askInformationModal && $scope.askInformationModal.isShown()){
      $scope.askInformationModal.remove();
    }
    if($scope.postInformationModal && $scope.postInformationModal.isShown()){
      $scope.postInformationModal.remove();
    }
  }

  $scope.closeAskInformationModal = function(data){
    $scope.question = angular.copy(data);
    console.log($scope.question)
    $scope.hideLoader();
    
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
    if($scope.askInformationModal && $scope.askInformationModal.isShown()){
      $scope.askInformationModal.remove();
    }
    if($scope.postInformationModal && $scope.postInformationModal.isShown()){
      $scope.postInformationModal.remove();
    }
  }

  $scope.goToWalletFromModal = function(){
    $scope.closeModal();
    $state.go('app.wallet');
  }
  
  $scope.showMonkPage = function(){
    $state.go('app.yprofile',{id:$scope.question.monkId});
  }

  // Monk Modal
  $scope.askInformation = function(){
    $ionicModal.fromTemplateUrl('views/askInformationModal.html', function (modal) {
      $scope.askInformationModal = modal;
      $scope.askInformationModal.show();
    }, {
      scope: $scope,
      animation: 'slide-in-right'
    });
  }

  // User Modal
  $scope.openInformationModal = function(){
    $ionicModal.fromTemplateUrl('views/postInformationModal.html', function (modal) {
      $scope.postInformationModal = modal;
      $scope.postInformationModal.show();
    }, {
      scope: $scope,
      animation: 'slide-in-right'
    });
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

askmonkApp.controller('writeSolutionModalPopupCtrl', ['$scope','$timeout', function($scope,$timeout){
  $scope.writeSolutionTextarea = {'solution':""};
  if(localStorage.getItem('solution')){
    $scope.writeSolutionTextarea.solution = localStorage.getItem('solution');
  }
  $scope.closeWriteSolutionPopup = function(){
    $timeout(function(){
      $scope.closeSolutionPopup();
    }, 250);
    cordova.plugins.Keyboard.close();
  }
  $scope.expandText = function(){
    localStorage.setItem('solution',$scope.writeSolutionTextarea.solution);
    var element = document.getElementById("writeAnswerTextarea");
    element.style.height =  element.scrollHeight + "px";
  }
}]);

askmonkApp.controller('userDetailModalPopupCtrl', ['$scope','getMoonSign', function($scope,getMoonSign){
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
      if(data && data.error.statusCode == 422){
        $scope.showMessage(data.error.message);
      }else{
        $scope.showMessage("Something went wrong. Please try again.");
      }
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
      if($scope.editQuestion.matchMakingDetails.partnerBirthTime){
        angular.element(document.getElementsByClassName('ion-birth-time')).addClass('used');
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
    $scope.timePickerObject12Hour = {
      inputEpochTime:($scope.editQuestion.matchMakingDetails.partnerBirthTime?(new Date($scope.editQuestion.matchMakingDetails.partnerBirthTime)).getHours()*60*60+60*(new Date($scope.editQuestion.matchMakingDetails.partnerBirthTime)).getMinutes():(new Date()).getHours()*60*60),
      step: 1,
      format: 12,
      titleLabel: 'Partner Birth Time',
      closeLabel: 'Close',
      setLabel: 'Set',
      setButtonType: 'button-askmonk',
      closeButtonType: 'button-askmonk',
      callback: function (val) {
        timePicker12Callback(val);
      }
    }

    $scope.timePicker12Callback= function(val){
      angular.element(document.getElementsByClassName('ion-birth-time')).addClass('used');
      /*if (typeof (val) === 'undefined'){
        // console.log('Time not selected');
        $scope.editQuestion.matchMakingDetails.partnerBirthTime = new Date();
      } else {
        var selectedTime = new Date(val * 1000);
        $scope.editQuestion.matchMakingDetails.partnerBirthTime = new Date();
        $scope.editQuestion.matchMakingDetails.partnerBirthTime.setMinutes(selectedTime.getUTCMinutes());
        $scope.editQuestion.matchMakingDetails.partnerBirthTime.setHours(selectedTime.getUTCHours());
        // console.log($scope.editProfileData.birthTime);
      }*/
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
      if(data && data.error.statusCode == 422){
        $scope.showMessage(data.error.message);
      }else{
        $scope.showMessage("Something went wrong. Please try again.");
      }
      console.log(data,"error");
    })
  }
}]);

askmonkApp.controller('askInformationModalCtrl', ['$scope','utility','$ionicPopup', function($scope,utility,$ionicPopup){
  $scope.editQuestion = angular.copy($scope.question);
  console.log($scope.editQuestion);
  $scope.modal = {"monkId":localStorage.userId,"monkEmail":localStorage.email,"monkName":localStorage.name,"userId":$scope.editQuestion.userId,"id":$scope.editQuestion.id,"status":$scope.editQuestion.status,askInformation:""};
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
      if(data && data.error.statusCode == 422){
        $scope.showMessage(data.error.message);
      }else{
        $scope.showMessage("Something went wrong. Please try again.");
      }
      console.log(data);
    });
  }

  $scope.postInformation = function(){
    if(!$scope.modal.askInformation){
      $scope.showMessage('Please write desired information')
      return;
    }
    var confirmPopup = $ionicPopup.show({
      cssClass:"ios",
      title: 'Asking information to user would make this question mandatory for you to answer.',
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
      if(res){
        $scope.showLoader();
        utility.postInformation($scope.modal)
        .then(function(data){
          $scope.hideLoader();
          $scope.closeEditModal(data);
          $scope.showMessage('Information has been sent to user');
        },function(data){
          $scope.hideLoader();
          if(data && data.error.statusCode == 422){
            $scope.showMessage(data.error.message);
          }else{
            $scope.showMessage("Something went wrong. Please try again.");
          }
          console.log(data,"error");
        });
      }else{
        console.log('You are not sure');
      }
    });
  }
}]);


askmonkApp.controller('postInformationModalCtrl', ['$scope','utility','$ionicPopup', function($scope,utility,$ionicPopup){
  $scope.editQuestion = angular.copy($scope.question);
  console.log($scope.editQuestion);
  $scope.modal = {"monkId":localStorage.userId,"userId":$scope.editQuestion.userId,"id":$scope.editQuestion.id,"status":$scope.editQuestion.status,answerInformation:""};

  $scope.postInformation = function(){
    if(!$scope.modal.answerInformation){
      $scope.showMessage('Please ask the desired information')
      return;
    }
    var confirmPopup = $ionicPopup.show({
      cssClass:"ios",
      title: 'Going further would sent the information to the monk.',
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
      if(res){
        $scope.showLoader();
        utility.postAnswerInformation($scope.modal)
        .then(function(data){
          $scope.hideLoader();
          $scope.closeEditModal(data);
          $scope.showMessage('Information has been sent to monk');
        },function(data){
          $scope.hideLoader();
          if(data && data.error.statusCode == 422){
            $scope.showMessage(data.error.message);
          }else{
            $scope.showMessage("Something went wrong. Please try again.");
          }
          console.log(data,"error");
        });
      }else{
        console.log('You are not sure');
      }
    });
  }
}]);
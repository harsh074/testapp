askmonkApp.controller('editProfileCtrl', ['$scope','$state', function($scope,$state){
  $scope.editData = {"gender":""};
  $scope.showDate = false;
  $scope.datepickerObject = {
    titleLabel: 'DOB',  //Optional
    todayLabel: 'Today',  //Optional
    closeLabel: 'Close',  //Optional
    setLabel: 'Set',  //Optional
    setButtonType : 'button-askmonk',  //Optional
    todayButtonType : 'button-askmonk',  //Optional
    closeButtonType : 'button-askmonk',  //Optional
    inputDate: new Date(),  //Optional
    mondayFirst: true,  //Optional
    // disabledDates: disabledDates, //Optional
    // weekDaysList: weekDaysList, //Optional
    // monthList: monthList, //Optional
    templateType: 'popup', //Optional
    showTodayButton: 'false', //Optional
    modalHeaderColor: 'bar-positive', //Optional
    modalFooterColor: 'bar-positive', //Optional
    from: new Date(2012, 8, 2), //Optional
    to: new Date(2018, 8, 25),  //Optional
    callback: function (val) {  //Mandatory
      datePickerCallback(val);
    },
    dateFormat: 'dd-MM-yyyy', //Optional
    closeOnSelect: false //Optional
  };

  function datePickerCallback(val){
    console.log(val);
    $scope.showDate = true;
    if(val){
      $scope.datepickerObject.inputDate = val;
    }else{
      $scope.datepickerObject.inputDate = new Date();
    }
  }
  $scope.saveEditProfile = function(){
    $state.go('app.profile');
  }
  $scope.cancelEditProfile = function(){
    $state.go('app.profile');
  }
}]);

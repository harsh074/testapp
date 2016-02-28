askmonkApp.filter('ageFilter', function() {
  function calculateAge(birthday) { // birthday is a date
  	// console.log(birthday.getTime());
  	if(birthday){
  		birthday = new Date(birthday);
    	var ageDifMs = Date.now() - birthday.getTime();
    	var ageDate = new Date(ageDifMs); // miliseconds from epoch
    	return Math.abs(ageDate.getUTCFullYear() - 1970);
  	}
  }

  return function(birthdate) { 
    return calculateAge(birthdate);
  };
});

askmonkApp.filter('getEducation',function(){
  return function(input){
    console.log(input);
    if(input == "10" || input == "12"){
      return input+"th";
    }else{
      return input;
    }
  }
});

askmonkApp.filter('capitalize', function() {
  return function(input) {
    return (!!input) ? input.charAt(0).toUpperCase() + input.substr(1).toLowerCase() : '';
  }
});
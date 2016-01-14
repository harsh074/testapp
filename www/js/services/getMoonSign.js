askmonkApp.factory('getMoonSign', function(){
	
	return function getMoonSign(data){
		var zod_signs = ["capricorn" , "aquarius", "pisces", "aries", "taurus", "gemini", "cancer", "leo", "virgo", "libra", "scorpio", "sagittarius"];
    var dob = new Date(data.dob?data.dob:data.partnerDOB);
    var dobDate = dob.getDate();
    var dobMonth = dob.getMonth();

    switch(dobMonth){
      case 0: {//January
        if(dobDate < 20)
          data.moonSign = zod_signs[0];
        else
          data.moonSign = zod_signs[1];
        }break;
      case 1: {//February
        if(dobDate < 19)
          data.moonSign = zod_signs[1];
        else
          data.moonSign = zod_signs[2];
        }break;
      case 2: {//March
        if(dobDate < 21)
          data.moonSign = zod_signs[2];
        else
          data.moonSign = zod_signs[3];
        }break;
      case 3: {//April
        if(dobDate < 20)
          data.moonSign = zod_signs[3];
        else
          data.moonSign = zod_signs[4];
        }break;
      case 4: {//May
        if(dobDate < 21)
          data.moonSign = zod_signs[4];
        else
          data.moonSign = zod_signs[5];
        }break;
      case 5: {//June
        if(dobDate < 21)
          data.moonSign = zod_signs[5];
        else
          data.moonSign = zod_signs[6];
        }break;
      case 6: {//July
        if(dobDate < 23)
          data.moonSign = zod_signs[6];
        else
          data.moonSign = zod_signs[7];
        }break;
      case 7: {//August
        if(dobDate < 23)
          data.moonSign = zod_signs[7];
        else
          data.moonSign = zod_signs[8];
        }break;
      case 8: {//September
        if(dobDate < 23)
          data.moonSign = zod_signs[8];
        else
          data.moonSign = zod_signs[9];
        }break;
      case 9: {//October
        if(dobDate < 23)
          data.moonSign = zod_signs[9];
        else
          data.moonSign = zod_signs[10];
        }break;
      case 10: {//November
        if(dobDate < 22)
          data.moonSign = zod_signs[10];
        else
          data.moonSign = zod_signs[11];
        }break;
      case 11: {//December
        if(dobDate < 22)
          data.moonSign = zod_signs[11];
        else
          data.moonSign = zod_signs[0];
        }break;
    }
    return data;
	};
});
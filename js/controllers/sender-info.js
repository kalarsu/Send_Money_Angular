(function(){
    
    // var sender = angular.module('senderApp',[]);
    // sender.controller('senderController', function($scope, $http){

    angular.module('MyBank').controller('senderController', function($scope,$http){

        var targetCountry = localStorage.getItem("sendToCountry");
        $scope.isbirthErr = true;
        $scope.isMonth = false;
        $scope.isDay = false;
        $scope.isYear = false;
        $scope.isEmail = false;
        $scope.isPhoneErr = true;
        $scope.phoneErrMsg = "Please enter your phone number."
        $scope.emailErrMsg = "Please enter your email";
        $scope.phoneExist = "";
        $scope.emailExist = "";
        $scope.birthErrMsg = "";
        $scope.showEdit = true;
        $scope.monthColor = "correctText";
        $scope.dayColor = "correctText";
        $scope.yearColor = "correctText";
        $scope.sender_email = "";
        $scope.disableSubmitBtn = true;
        //$scope.pattern = /^[a-z]+[a-z0-9._]+@[a-z]+\.[a-z.]{2,5}$/;

        //temporary session data for sender and bank info
        var senderDetail = {"phone":"415-999-9999","email":"","name":"John Smith","address1":"2000 Broadway Street, ","address2":"Redwood City, CA, 94063"};
        sessionStorage.setItem('userDeatailsStream', JSON.stringify(senderDetail));
        var bankDetail = {"balance":"100.12","accountNumber":"XXXXX6576","bankName":"Demo Checking Account","routingNumber":"","nameOnAccount":"John Smith"};
        sessionStorage.setItem('senderBankAccount', JSON.stringify(bankDetail));

        //fetch data from session sender 
        var getSenderDetailSess = sessionStorage.getItem("userDeatailsStream");
        var senderObj = $.parseJSON(getSenderDetailSess);

        $scope.sender_address = senderObj.address1 + senderObj.address2;

        if(senderObj.phone!=''){
            $scope.sender_phone = senderObj.phone;
            sessionStorage.setItem('phoneNum', senderObj.phone);
        }else if(sessionStorage.getItem('phoneNum')){
            $scope.sender_phone=sessionStorage.getItem('phoneNum');
        }
        if(senderObj.email!=''){
            $scope.sender_email = senderObj.email;
            sessionStorage.setItem('email', senderObj.email);
        }else if(sessionStorage.getItem('email')){
            $scope.sender_email = sessionStorage.getItem('email');
        }

        if($scope.sender_address !="") $scope.addressExist = 'floating-placeholder-float';
        
        if($scope.sender_phone != undefined && $scope.sender_phone !=""){
            $scope.phoneExist = 'floating-placeholder-float';
            var val = $scope.sender_phone;
            val = val.replace(/(\d{3})(\d{3})(\d{4})/, "$1-$2-$3");
            if(val.length==14) val = val.substr(2);
            $scope.sender_phone = val;
            $scope.isPhoneErr = false;
        }else{
            $('#sender-phone').focus();
            $('#sender-phone-row').addClass('row-border-focus');
            //$('#sender-email-row').css('border',"none");
        }
        if($scope.sender_email != undefined && $scope.sender_email !=""){
            $scope.emailExist = 'floating-placeholder-float';
            $scope.isEmail = true;
        }else if( $scope.phoneExist !=""){
            $('#sender-email').focus();
            $('#sender-email-row').addClass('row-border-focus');
        }

        //fetch data from session bank info
        var getBankInfoSess = sessionStorage.getItem("senderBankAccount");
        var bankObj = $.parseJSON(getBankInfoSess);
        //get transaction total from session----------------------
        //$scope.sender_balance = bankObj.balance;
        $scope.sender_balance = sessionStorage.getItem('sendTotal');
        //--------------------------------------------------------
        $scope.sender_accNum = bankObj.accountNumber;
        $scope.sender_bankName = bankObj.bankName;
        $scope.sender_name = bankObj.nameOnAccount;

        $scope.valdateMonth = function(val){
            $scope.sender_birth_month = $scope.validateNum(val);
            //console.log(val);
            if(val>12 || val == undefined) {
                $scope.sender_birth_month ="";
                $scope.monthColor = "errText";
                $scope.isMonth = false;
                $scope.isbirthErr = true;
                $scope.disableSubmitBtn = true;
            }else{
                if(val.length==2) $('#dayInput').focus();
                $scope.monthColor = "correctText";
                $scope.isMonth = true;
                validateBirthday();
            }
            
        }
        $scope.valdateDay = function(val){
            $scope.sender_birth_day = $scope.validateNum(val);
            if(val>31 || val == undefined) {
                $scope.sender_birth_day = "";
                $scope.dayColor = "errText";
                $scope.isDay = false;
                $scope.isbirthErr = true;
                $scope.disableSubmitBtn = true;
            }else{
                if(val.length==2) $('#yearInput').focus();
                $scope.dayColor = "correctText";
                $scope.isDay = true;
                validateBirthday();
            }
        }
        $scope.valdateYear = function(val){
            var thisYear = (new Date).getFullYear();
            $scope.sender_birth_year = $scope.validateNum(val);

            if( val==undefined || (val.length==4 && (val<1915 || val>=thisYear)) ) {
                $scope.sender_birth_year = "";
                $scope.yearColor = "errText";
                $scope.isYear = false;
                $scope.isbirthErr = true;
                $scope.disableSubmitBtn = true;
            }else if(val.length==4){
                $scope.yearColor = "correctText";
                $scope.isYear = true;
                validateBirthday();
            }else{
                $scope.disableSubmitBtn = true;
            }
            // else{
            //     $scope.isYear = false;
            //     $scope.isbirthErr = true;
            //     $scope.birthErrMsg = "Please enter valid birthday.";
            // }

        }

        $scope.validateNum = function(val) {
            if(val!="" && val!=undefined){
                //if(event.keyCode>=48 && event.keyCode<=57){ //this does not work in iphone simulator
                return val.replace(/[^0-9\.]/g,'');
            }
        }

        //function validateAge(birthday, minage, separator) {
        var validateBirthday = function(){
            if($scope.isMonth && $scope.isDay && $scope.isYear ){
                var minage = 18;
                var dateFullYear = $scope.sender_birth_year;
                var dateMonth = $scope.sender_birth_month;
                var dateDay = $scope.sender_birth_day;
                var mydate = new Date();

                mydate.setFullYear(dateFullYear, dateMonth-1, dateDay);

                var currdate = new Date();
                var setDate = new Date();         
                setDate.setFullYear(mydate.getFullYear() + minage, dateMonth-1, dateDay);

                if((currdate - setDate) >0) {
                    $scope.isbirthErr = false;
                    sessionStorage.setItem('birthday', dateMonth+"/"+dateDay+"/"+dateFullYear);
                    validateForm(true);
                }else{
                    $scope.isbirthErr = true;
                    $scope.birthErrMsg = "You need to be at least 18 years to use this service.";
                    $scope.disableSubmitBtn = true;
                }


                //$scope.isbirthErr = ((currdate - setDate) > 0) ? false : true; 
                //if($scope.isbirthErr) $scope.birthErrMsg = "You need to be at least 18 years to use this service.";
            }else{
                $scope.birthErrMsg = "";
                $scope.isbirthErr = true;
            }
        }

        $scope.senderPhoneKeyup = function(phoneNum){
            //if(phoneNum!=undefined) console.log(phoneNum);
            //$scope.phoneExist= 'floating-placeholder-float';
            if(phoneNum!=undefined){
                var val = phoneNum.replace(/[^0-9\.]/g,'');
                val = val.replace(/(\d{3})(\d{3})(\d{4})/, "$1-$2-$3");
                $scope.sender_phone = val;

                if(val.length==12){
                    $scope.isPhoneErr = false;
                    sessionStorage.setItem('phoneNum', val);
                    validateForm(true);
                }else{
                    $scope.isPhoneErr = true;
                    $scope.phoneErrMsg = "Please enter a valid phone number";
                    $scope.disableSubmitBtn = true;
                }
            }
        }

        $scope.senderEmailKeyup = function(val){
            //validate email when start keying up
            //console.log('emailkeyup');
            //$scope.emailExist = 'floating-placeholder-float';
            var testEmail = /^[A-Z0-9._%+-]+@([A-Z0-9-]+\.)+[A-Z]{2,4}$/i;
            if (testEmail.test(val)) {
                $scope.isEmail = true;
                sessionStorage.setItem('email', val);
                validateForm(true);
            }else{
                $scope.isEmail = false;
                $scope.disableSubmitBtn = true;
                if(val==''||val==undefined)
                    $scope.emailErrMsg ="Please enter your email.";
                else
                    $scope.emailErrMsg ="Please enter a valid Email.";
            }
        }

        var validateForm = function($isValid){
            console.log("$isValid=" + $isValid + " !$scope.isbirthErr=" + !$scope.isbirthErr + " $scope.isEmail=" + $scope.isEmail + " !$scope.isPhoneErr=" + !$scope.isPhoneErr)
            if($isValid && !$scope.isbirthErr && $scope.isEmail && !$scope.isPhoneErr){
                $scope.disableSubmitBtn = false;
                return true;
            }else{
                //console.log('err= ' + $isValid + $scope.isbirthErr + $scope.isEmail + $scope.isPhoneErr);
                $scope.disableSubmitBtn = true;
                return false;
            }
        }

        $scope.senderSubmit = function($isValid, $e){
            //$e.preventDefault();
            if (validateForm($isValid)) $('#sender-form').attr('action', "#/receiver-info").submit();
        }

        if(sessionStorage.getItem('birthday')){
            var birDate = sessionStorage.getItem('birthday').split('/');
            $scope.sender_birth_month = birDate[0];
            $scope.sender_birth_day = birDate[1];
            $scope.sender_birth_year = birDate[2];



            $('.birthday-col .floating-placeholder').addClass("floating-placeholder-float");
            $scope.isMonth = true;
            $scope.isDay = true;
            $scope.isYear = true;
            validateBirthday();
        } 
        //when pageload validate form
        validateForm(true);

    });
})();


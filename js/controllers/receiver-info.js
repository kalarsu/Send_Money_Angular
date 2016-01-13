(function(){
    var usState = {
        'AL':'Alabama',
        'AK':'Alaska',
        'AZ':'Arizona',
        'AR':'Arkansas',
        'CA':'California',
        'CO':'Colorado',
        'CT':'Connecticut',
        'DE':'Delaware',
        'DC':'District of Columbia',
        'FL':'Florida',
        'GA':'Georgia',
        'HI':'Hawaii',
        'ID':'Idaho',
        'IL':'Illinois',
        'IN':'Indiana',
        'IA':'Iowa',
        'KS':'Kansas',
        'KY':'Kentucky',
        'LA':'Louisiana',
        'ME':'Maine',
        'MD':'Maryland',
        'MA':'Massachusetts',
        'MI':'Michigan',
        'MN':'Minnesota',
        'MS':'Mississippi',
        'MO':'Missouri',
        'MT':'Montana',
        'NE':'Nebraska',
        'NV':'Nevada',
        'NH':'New Hampshire',
        'NJ':'New Jersey',
        'NM':'New Mexico',
        'NY':'New York',
        'NC':'North Carolina',
        'ND':'North Dakota',
        'OH':'Ohio',
        'OK':'Oklahoma',
        'OR':'Oregon',
        'PA':'Pennsylvania',
        'RI':'Rhode Island',
        'SC':'South Carolina',
        'SD':'South Dakota',
        'TN':'Tennessee',
        'TX':'Texas',
        'UT':'Utah',
        'VT':'Vermont',
        'VA':'Virginia',
        'WA':'Washington',
        'WV':'West Virginia',
        'WI':'Wisconsin',
        'WY':'Wyoming'
    };


    angular.module('MyBank').controller('receiverController', function($scope,$http){

        var targetCountry = sessionStorage.getItem("sendToCountryCode");
        $scope.usStates = usState;
        $scope.deliverMethod = sessionStorage.getItem("deliverMethod");
        $scope.selectedState = "Please select a state";
        $scope.isReceFname = false;
        $scope.isReceLname = false;
        $scope.isRecePaternal = false;
        $scope.isReceCity = false;
        $scope.isReceUState = false;
        $scope.isReceState = false;
        $scope.isRecePhone = false;
        $scope.isReceTxnPurpos = false;
        $scope.isReceBank = false;
        $scope.isReceBankRout = false;
        $scope.isReceBankAcc = false;
        $scope.isTransPurSelected = "";
        $scope.transPurpose = "Transaction purpose";
        $scope.pattern = /^[a-zA-Z]*$/;
        $scope.disableSubmitBtn = true;
        
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

        $scope.updateState = function($_state){
            $scope.selectedState = $_state;
            $scope.receiverUSState = $_state;
            sessionStorage.setItem('receiverUSState', $_state);
            $('#UState-row .btn').addClass('selected');
        }

        $scope.receiverSubmit = function($isValid,$e){
            $e.preventDefault();
            if($isValid){
                $scope.disableSubmitBtn = false;
                //$('#receiver-form').attr('action', "https://www.westernunion.com/us/en/send-money/sendMoneyLogin.html").submit();
                window.location.href = "https://www.westernunion.com/us/en/send-money/sendMoneyLogin.html";
            }else{
                $scope.disableSubmitBtn = true;
                return false;
            }
        }

        $scope.setTransPur = function(_val){
            $scope.transPurpose = _val;
            $scope.isTransPurSelected = "selected";
            $scope.receiverPurpose = _val;
            sessionStorage.setItem('receiverTransPur', _val);
        }

        switch(targetCountry){
            case "US":
                $scope.isReceFname = true;
                $scope.isReceLname = true;
                $scope.isReceUState = true;
                if($scope.deliverMethod=="D2B"){
                    $scope.isReceBank = true;
                    $scope.isReceBankRout = true;
                    $scope.isReceBankAcc = true;
                }
                break;
            case "IN":
                $scope.trans_purposes = {'opt1':'Sending for family maintenance' , 'opt2':'Sending to NRE account'};
                $scope.isReceFname = true;
                $scope.isReceLname = true;
                $scope.isReceTxnPurpos = true;
                if($scope.deliverMethod=="D2B"){
                    $scope.isReceBank = true;
                    $scope.isReceBankRout = true;
                    $scope.isReceBankAcc = true;
                }
                break;
            case "MX":
                $scope.isReceFname = true;
                $scope.isRecePaternal = true;
                $scope.isReceCity = true;
                $scope.isReceState = true;
                break;
            case "CN":
                $scope.trans_purposes = {'opt1':'General purpose maintanence'};
                $scope.setTransPur($scope.trans_purposes.opt1);
                $scope.isReceFname = true;
                $scope.isReceLname = true;
                if($scope.deliverMethod=="D2B"){
                    $scope.isRecePhone = true;
                    $scope.isReceTxnPurpos = true;
                    $scope.isReceBank = true;
                    $scope.isReceBankAcc = true;
                }
                break;
            case "PH":
                $scope.isReceFname = true;
                $scope.isReceLname = true;
                $scope.isReceState = true;
                if($scope.deliverMethod=="D2B"){
                    $scope.isReceBank = true;
                    $scope.isReceBankAcc = true;
                }
                break;
        }

        $(".inputEle").focusout(function(){
            var eleName = $(this).attr('id'); 
            var eleVal = $(this).val();
            if(eleName!=undefined){
                switch(eleName){
                    case 'receiver-fname':
                        sessionStorage.setItem('receiverFname', eleVal);
                        break;
                    case 'receiver-lname':
                        sessionStorage.setItem('receiverLname', eleVal);
                        break;
                    case 'receiver-paternal':
                        sessionStorage.setItem('receiverPaternal', eleVal);
                        break;
                    case 'receiver-city':
                        sessionStorage.setItem('receiverCity', eleVal);
                        break;
                    case 'receiver-state':
                        sessionStorage.setItem('receiverState', eleVal);
                        break;
                    case 'receiver-phone':
                        sessionStorage.setItem('receiverPhone', eleVal);
                        break;
                    case 'receiver-transpur':
                        sessionStorage.setItem('receiverTransPur', eleVal);
                        break;
                    case 'receiver-bankname':
                        sessionStorage.setItem('receiverBankname', eleVal);
                        break;
                    case 'receiver-bank-rout':
                        sessionStorage.setItem('receiverBankRout', eleVal);
                        break;
                    case 'receiver-bank-account':
                        sessionStorage.setItem('receiverBankAccount', eleVal);
                        break;
                }
            } 
        });

        var initialSessionInput = function(){
            if(sessionStorage.getItem('receiverFname')) {
                $scope.receiverFname = sessionStorage.getItem('receiverFname');
                $('#fname-row .floating-placeholder').addClass("floating-placeholder-float");
            }
            if(sessionStorage.getItem('receiverLname')){
                $scope.receiverLname = sessionStorage.getItem('receiverLname');
                $('#lname-row .floating-placeholder').addClass("floating-placeholder-float");
            }
            if(sessionStorage.getItem('receiverPaternal')){
                $scope.receiverPaternal = sessionStorage.getItem('receiverPaternal');
                $('#paternal-row .floating-placeholder').addClass("floating-placeholder-float");
            }
            if(sessionStorage.getItem('receiverCity')){
                $scope.receiverCity = sessionStorage.getItem('receiverCity');
                $('#city-row .floating-placeholder').addClass("floating-placeholder-float");
            }
            if(sessionStorage.getItem('receiverUSState')){
                $scope.selectedState = sessionStorage.getItem('receiverUSState');
                $scope.receiverUSState = sessionStorage.getItem('receiverUSState');
                $('#UState-row .btn').addClass('selected');
            }
            if(sessionStorage.getItem('receiverState')){
                $scope.receiverState = sessionStorage.getItem('receiverState');
                $('#state-row .floating-placeholder').addClass("floating-placeholder-float");
            }
            if(sessionStorage.getItem('receiverPhone')){
                $scope.receiverPhone = sessionStorage.getItem('receiverPhone');
                $('#phone-row .floating-placeholder').addClass("floating-placeholder-float");
            }
            if(sessionStorage.getItem('receiverTransPur')){
                $scope.transPurpose = sessionStorage.getItem('receiverTransPur');
                $scope.receiverPurpose = sessionStorage.getItem('receiverTransPur');
                $scope.isTransPurSelected = "selected";
            }
            if(sessionStorage.getItem('receiverBankname')){
                $scope.receiverBankname = sessionStorage.getItem('receiverBankname');
                $('#bankname-row .floating-placeholder').addClass("floating-placeholder-float");
            }
            if(sessionStorage.getItem('receiverBankRout')){
                $scope.receiverBankRouting = sessionStorage.getItem('receiverBankRout');
                $('#routing-row .floating-placeholder').addClass("floating-placeholder-float");
            }
            if(sessionStorage.getItem('receiverBankAccount')){
                $scope.receiverBankAccount = sessionStorage.getItem('receiverBankAccount');
                $('#bank-account-row .floating-placeholder').addClass("floating-placeholder-float");
            }
        };

        //get inputed value from session when page load
        initialSessionInput();

    });
    
})();


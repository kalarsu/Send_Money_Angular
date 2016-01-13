(function(){
    var countries = {
        "United States": "US",
        "India": "IN",
        "Philippines": "PH",
        "Mexico": "MX",
        "China":"CN",
        "Others":"None"
    };
    var bankOptions = {
        "Bank of America": "051000017",
        "Chase": "102001017",
        "Wells Fargo": "102000076",
        "U.S. Bank": "102000021",
        "Citibank": "021000021",
        "PNC Bank": "071921891",
        "USAA": "314074269",
        "TD Bank": "211274450",
        "CapitalOne": "031176110",
        "Navy Federal Credit Union": "256074974",
        "Others":"None"
    };

    analyticsObject = {
        sc_country: 'US',
        sc_language: 'English',
        sc_platform: 'sharlet',
        sc_release: '1.0',
        sc_data_center: 'dataCenter'
    };
    

    angular.module('MyBank').controller('countryController', function($scope,$http,$timeout,$filter){
        $scope.showProgressBar = false;
        $scope.sendToCountryFlag = "";
        $scope.sendAmountFlag = "";
        $scope.deliveryMethodFlag = "";
        $scope.sendFromBankFlag = "";
        $scope.otherCountryFlag = false;
        $scope.countries = countries;
        $scope.bankOptions = bankOptions;
        //$scope.display = true;
        $scope.selectedCountry ="Select Country";
        $scope.targetCurrency = "";
        $scope.setupFxRate = 1;
        //$scope.setupCurrency = "USD";
        //$scope.sendAmount = 0;
        $scope.sendFee = 0;
        $scope.sendAmountErr = true;
        $scope.showCurrency = false;
        $scope.isCurrency = false;
        $scope.showDeliverMethod = false;
        $scope.showTolPanel = false;
        $scope.receiverOption = "";
        $scope.deliverMethod = "";
        $scope.deliverMethodErr = true;
        $scope.sendFromBank = "Select your bank"
        $scope.sendFromBankErr = true;
        $scope.sendFromOtherBank = false;
        $scope.isCountrySelected = "";
        $scope.isMethodSelected = "";
        $scope.isBankSelected = "";
        $scope.sendAmountErrMsg = "";
        $scope.submitBtnDisabled = true;
        //------disclamier-----------
        $scope.disclamier4_1 = false;
        $scope.disclamier4_2 = false;
        $scope.disclamier5 = false;
        //$scope.sendFromBankErrMsg = "";
        $scope.fxSets = [];
        //------focus----------------
        $scope.sendToCountryFlag = 'row-border-focus';


        var sendFee = 0;
        var minLimit = 1;
        var maxLimit = 5000;

        //when homepage loaded ,country set to onfocus
        $('#sendto-country-col').addClass('row-border-bottom-focus');

        //set timtup to scoll header image
        var scollUpHeader = function() {
            //$('.header-img').addClass('hide-element');
            $("html, body").animate({ scrollTop: $('#hero-bg').height() }, "slow");
        }
        
        $scope.updateCountry = function($_country,$_isocode,$_refresh,$_reload) {
            $scope.isCurrency = true;
            $scope.sendToCountryFlag = "";
            $scope.targetCurrency = "";//reset currency
            $scope.selectedCountry = $_country;
            $scope.selectedIsoCode = $_isocode;
            $scope.flagicon = "flag-icon "+$_isocode;
            if($_country == "Others"){
                $scope.otherCountryFlag = true;
                $scope.sendAmountFlag = "";
                $scope.sendToCountryFlag = "err";
                $scope.showDeliverMethod = false;
                $scope.resetDeliveryMethod();
            }else{
                isShowDeliverMethod();
                $scope.otherCountryFlag = false;
                //$scope.sendToCountryFlag = "";
                //-----focus-----------------------
                $scope.sendAmountFlag = "focus";
                $('.send-to').removeClass('row-border-top-focus');
                $scope.sendToCountryFlag = ''//row-border-bottom-focus
                //---------------------------------
                $scope.getFxData($_isocode);
                if(!$_reload) $scope.resetDeliveryMethod();
                $scope.isCountrySelected = "selected";

                sessionStorage.setItem('sendToCountry', $_country);
                sessionStorage.setItem('sendToCountryCode', $_isocode);
                //validate form if enable submit button;
                validateForm();
            }
            
            if(!$_refresh) $scope.resetLocalStorage('country');

            $scope.showProgressBar = true; 

            if(!$_refresh) {
                scollUpHeader();
            }
            //reset transaction purpose when change country or refresh homepage , due to india & China have different option value
            sessionStorage.setItem('receiverTransPur','');
            
            $timeout(function(){
                $('#send-amount').focus();
            }, 1000);
            
        }

        $scope.getFxData = function($_isocode){
            var fxJson = "exRate" + $_isocode + ".json";
            $http.get('json/'+fxJson).
            success(function(data, status, headers, config) {
                if(data['currencies']['currency'][0]){
                    $scope.fxSets = data['currencies']['currency'];
                    $scope.setupFxRate = data['currencies']['currency'][0]['exchangeRate'];
                    //if session has currency use the session to load the currency until switch different country then will reset currency
                    if($scope.targetCurrency=='') $scope.targetCurrency = data['currencies']['currency'][0]['currencyIsoCode'];
                    //$scope.setupCurrency = data['currencies']['currency'][0]['currencyIsoCode'];
                    //for backend ------------------------------
                    sessionStorage.setItem('exchangeRate',$scope.setupFxRate);
                    //sessionStorage.setItem('recCurrencyCode', $scope.setupCurrency);
                    sessionStorage.setItem('recCurrencyCode', $scope.targetCurrency);
                    //-------------------------------------------
                    if($scope.fxSets.length>1) 
                        $scope.showCurrency = true;
                    else
                        $scope.showCurrency = false;
                }
                if(data['transactionLimits']['transactionLimit'][0]){
                    $scope.deliveries = data['transactionLimits']['transactionLimit'];
                    minLimit = parseFloat(data['transactionLimits']['transactionLimit'][0]['minLimit']);
                    maxLimit = parseFloat(data['transactionLimits']['transactionLimit'][0]['maxLimit']);
                    $scope.validateAmount();
                    //console.log('deliveries'+$scope.deliveries);
                }  
                
            }).
            error(function(data, status, headers, config) {
              console.log('ajax reading FX Rate error');
            });
        }


        $scope.updateCurrency = function($_isocode, $_rate){
            console.log('updateCurrency');
            $scope.setupFxRate = $_rate;
            //$scope.setupCurrency  = $_isocode;
            $scope.targetCurrency = $_isocode;
            $scope.resetDeliveryMethod();
            $scope.validateAmount();
            sessionStorage.setItem('recCurrencyCode', $_isocode);
        }

        $scope.amountKeyup = function($amountType){
            if($scope.sendToCountryFlag!='err'){
                if($amountType == 'send')
                    $scope.validateAmount();
                else
                    $scope.validateReceiverAmount();

                $scope.sendAmountFlag = "";
                $scope.deliveryMethodFlag = "row-border-focus";
                
                //when amount err got fix and delivery method already choosen
                var deliveryMethod = sessionStorage.getItem('deliverMethod');
                var speed = sessionStorage.getItem('days');
                var fee = sessionStorage.getItem('fee');
                if(!$scope.sendAmountErr && deliveryMethod!='' && speed!='' && fee!='') $scope.updateTolAmount(deliveryMethod, fee, speed, maxLimit, false);

            }else{
                $scope.sendAmountErr = true;
                $scope.showTolPanel = false;
                $scope.resetDeliveryMethod();
            }
        }
        $scope.updateTolAmount = function($_option, $_fee, $_speed, $_maxLimit,_validAmountFlag){
            //validate send amount limit when choose delivery method in India. 
            maxLimit = $_maxLimit;
            //console.log('$_option='+$_option);
            if($scope.sendAmount!='' && $scope.sendAmount!=undefined){
                var sendAmount = $scope.sendAmount.replace(",","");
                if(_validAmountFlag) $scope.validateAmountLimit(sendAmount);
                
                switch($_option){
                    case 'PERSONAL':
                        $scope.receiverOption = "Pickup cash at Western Union location.";
                        break;
                    case 'D2B':
                        $scope.receiverOption = "Send to receiver's bank account";
                        break;
                }

                if($scope.sendAmountErr ){
                    //$scope.showDeliverMethod = true;
                    //sessionStorage.setItem('deliverMethod', '');
                    sessionStorage.setItem('sendAmount', '');
                    sessionStorage.setItem('sendTotal', '');
                }else{
                    $scope.deliveryMethodFlag = "";
                    $scope.sendFromBankFlag = "row-border-focus";
                    $scope.isMethodSelected = "selected";
                    sendFee = parseFloat($_fee);
                    $scope.tolAmount = parseFloat($scope.subAmount) + parseFloat($_fee);
                    $scope.deliverMethod = $_option;
                    
                    $scope.sendFee = $_fee;
                    //for backend----------------------------------
                    //$scope.deliveries.forEach(function(delivery) {if($_option == delivery.type){sessionStorage.setItem('days', delivery.speed); }});
                    sessionStorage.setItem('days', $_speed);
                    sessionStorage.setItem('fee', $_fee);
                    sessionStorage.setItem('sendTotal', $scope.tolAmount);   
                    //---------------------------------------------
                    $scope.showTolPanel = true;
                    //validate form if enable submit button.
                    validateForm();
                    //$("html, body").animate({ scrollTop: 140 }, "slow");
                    
                }
                sessionStorage.setItem('deliverMethod', $_option);

                $("html, body").animate({ scrollTop: 400 }, "slow");
            }
        }

        $scope.updateBankName = function($_name,$_code){
            $scope.sendFromBank = $_name;
            // if($_name=='Others'){
            //     $scope.sendFromOtherBank = true;
            //     $scope.sendFromBankFlag = "err";
            //     $scope.sendFromBankErr = true;
            // }else{
                $scope.sendFromOtherBank = false;
                $scope.sendFromBankFlag = "";
                $scope.isBankSelected = "selected";
                $scope.sendFromBankCode = $_code;
                $scope.sendFromBankErr = false;
            //}

            //for backend----------------------------
            sessionStorage.setItem('bankName', $_name);
            sessionStorage.setItem('bankCode', $_code);
            //validate form if enable submit button
            validateForm();
           
            //after select your bank, scroll up to see the submit button
            $("html, body").animate({ scrollTop: $(document).height() }, "slow");
        }


        $scope.homeDiv = function($event){
            var element = '';
            if($event.target.attributes.data) element = $event.target.attributes.data.value;
            if(element != 'tooltips') {
                if($scope.disclamier4_1) $scope.disclamier4_1 = false;
                if($scope.disclamier4_2) $scope.disclamier4_2 = false;
                if($scope.disclamier5) $scope.disclamier5 = false;
            }
            // $('.header-img').addClass('hide-element');
            // $('#hero-bg').hide();
        }

        $scope.validateReceiverAmount = function(){

            if($scope.receiverAmount!="" && $scope.receiverAmount!=undefined){
                //console.log("validateReceiveramount");
                $scope.sendAmountErr = false;
                $scope.receiverAmount = $scope.receiverAmount.replace(",","");
                $scope.receiverAmount = $scope.receiverAmount.replace(/[^0-9\.]/g,'');
                var receiverAmount = parseFloat($scope.receiverAmount);
                $scope.receiverAmount = $scope.receiverAmount.replace(/(\d)(\d{3})($|,|\.)/g, '$1,$2$3');

                var fxRate = parseFloat($scope.setupFxRate);
                $scope.sendAmount = (receiverAmount / fxRate).toFixed(2);
                //console.log('sendamount='+$scope.sendAmount);
                $scope.validateAmountLimit($scope.sendAmount);
            }else{
                //console.log('no valide='+$scope.receiverAmount);
                $scope.sendAmount = 0;
                $scope.sendAmountErrMsg = "";
                $scope.sendAmountErr = true;
                $scope.showTolPanel = false;
                $scope.resetDeliveryMethod();
            }
        }
        $scope.validateAmount = function(){
            //console.log('validateAmount');
            if($scope.sendAmount!="" && $scope.sendAmount!=undefined){
                $scope.sendAmountErr = false;
                $scope.sendAmount = $scope.sendAmount.replace(/[^0-9\.]/g,'');
                var sendAmount = parseFloat($scope.sendAmount);
                //$scope.sendAmount = parseFloat($scope.sendAmount);
                $scope.sendAmount = $scope.sendAmount.replace(/(\d)(\d{3})($|,|\.)/g, '$1,$2$3');//adding ,

                var fxRate = parseFloat($scope.setupFxRate);
                $scope.receiverAmount = (sendAmount * fxRate).toFixed(2);
                $scope.receiverAmount = $scope.receiverAmount.replace(/(\d)(\d{3})($|,|\.)/g, '$1,$2$3');//adding ,
                $scope.validateAmountLimit(sendAmount);
            }else{
                $scope.receiverAmount = 0;
                $scope.sendAmountErrMsg = "";
                $scope.sendAmountErr = true;
                $scope.showTolPanel = false;
                $scope.showDeliverMethod = false;
                $scope.submitBtnDisabled = true;
                $scope.resetDeliveryMethod();
            }
        }
        $scope.validateAmountLimit = function(_amount){
            //console.log('validateAmountLimit='+ _amount);
            var amount = parseFloat(_amount);
            if(amount>maxLimit){
                $scope.sendAmountErrMsg = "Please enter a smaller amount less than $"+maxLimit+".";
                $scope.sendAmountErr = true;
                $scope.showTolPanel = false;

                $scope.showDeliverMethod = false;
                $scope.submitBtnDisabled = true;
                //$scope.resetDeliveryMethod();
            }else if(amount<1){
                $scope.sendAmountErrMsg = "Please enter a larger amount.";
                $scope.sendAmountErr = true;
                $scope.showTolPanel = false;

                $scope.showDeliverMethod = false;
                $scope.submitBtnDisabled = true;
                //$scope.resetDeliveryMethod();
            }else{
                $scope.sendAmountErrMsg = "";
                $scope.sendAmountErr = false;
                $scope.subAmount = amount;
                $scope.tolAmount = amount + parseFloat(sendFee);
                sessionStorage.setItem('sendAmount', amount);
                //console.log('test='+amount);
                sessionStorage.setItem('sendTotal', $scope.tolAmount);   
                isShowDeliverMethod();
            }
            //isShowDeliverMethod();
        }
        var isShowDeliverMethod = function(){
            if (!$scope.sendAmountErr && $scope.isCurrency) {
                $scope.showDeliverMethod = true;
                //only when  showDeliverMethod=true && only one delivery method , then just show delivery method without letting user choose
                var isoCode = $scope.selectedIsoCode;
                var deliveryMethod = $scope.receiverOption; //$scope.receiverOption = "How should we send the money?";
                if($scope.deliveries && deliveryMethod==''){
                    if(isoCode=='US' || isoCode=='CN' || isoCode=='MX'){
                        getDeliveryMethod('PERSONAL');
                    }else{
                        getDeliveryMethod('D2B');
                    }   
                }
                
                if($scope.deliveries && $scope.targetCurrency=='USD') getDeliveryMethod('PERSONAL');
            }else{
                $scope.showDeliverMethod = false;
                $scope.showTolPanel = false;
                $scope.submitBtnDisabled = true;
            }
            //console.log('$scope.showDeliverMethod='+$scope.showDeliverMethod);
        }

        var getDeliveryMethod = function(_method){
            var delivery = [];
            //var deliverCount = Object.keys($scope.deliveries).length;
            // for(i=0; i<deliverCount; i++){
            //     if($scope.deliveries[i].type == _method) {
            //         delivery = $scope.deliveries[i];
            //         $scope.updateTolAmount(delivery.type, delivery.fee, delivery.speed, delivery.maxLimit, false);
            //     }
            // }
            if($scope.deliveries){
                delivery = ($filter('filter')($scope.deliveries, {type: _method}));
                $scope.updateTolAmount(delivery[0].type, delivery[0].fee, delivery[0].speed, delivery[0].maxLimit, false);
            }
            
            //console.log('items='+items[0].type, items[0].fee, items[0].speed, items[0].maxLimit);
        }

        $scope.homeSubmit = function($isValid,$e){
            //$e.preventDefault();
            if(validateForm()) $('#home-form').attr('action', "#/login").submit();
        }

        var validateForm = function(){
            if($scope.sendAmount=='') {
                $scope.sendAmountFlag = "err";
                $scope.submitBtnDisabled = true;
                return false;
            }else if($scope.selectedCountry == "Select Country"){
                $scope.sendToCountryFlag = "focus";//for css styling in red.
                $scope.submitBtnDisabled = true;
                return false;
            }else if($scope.deliverMethod == ""){
                $scope.deliveryMethodFlag = "row-border-focus";
                $scope.submitBtnDisabled = true;
                return false;
            }else if($scope.sendFromBank == "Select your bank"){ //|| $scope.sendFromBank == "Others"
                $scope.sendFromBankFlag = "row-border-focus";
                $scope.submitBtnDisabled = true;
                return false;
            }else{
                $scope.submitBtnDisabled = false;
                return true;
            }
        }

        $scope.resetDeliveryMethod = function(){
            //reset delivery method
            sessionStorage.setItem('deliverMethod', '');
            $scope.receiverOption = "";
            $scope.deliverMethod = "";
            $scope.showTolPanel = false;
            //reset sendAmount---------------------
            //$scope.resetLocalStorage();

            //console.log('resetDeliverymethod');
            //console.log('$scope.showTolPanel='+$scope.showTolPanel);
        }

        $scope.resetLocalStorage = function(_opt){
            if (_opt=='all'){
                sessionStorage.setItem('exchangeRate', '');
                sessionStorage.setItem('recCurrencyCode', '');
                sessionStorage.setItem('sendToCountry', '');
            }
            sessionStorage.setItem('deliverMethod', '');
            sessionStorage.setItem('fee', '');
            sessionStorage.setItem('sendAmount', '');
            sessionStorage.setItem('sendTotal', '');
            sessionStorage.setItem('bankCode', '');
            sessionStorage.setItem('days', '');
        }

        $scope.disClick = function($_no){
            switch ($_no){
                case 41:
                    $scope.disclamier4_1 = !$scope.disclamier4_1;
                    break;
                case 42:
                    $scope.disclamier4_2 = !$scope.disclamier4_2;
                    break;
                case 5:
                    $scope.disclamier5 = !$scope.disclamier5;
                    break;
            }
        }
        //get parameters from url
        $scope.getUrlPara = function(name){
            var results = new RegExp('[\?&]' + name + '=([^&#]*)').exec(window.location.href);
            if (results==null){
               return false;
            }
            else{
               return results[1] || 0;
            }
        }

        //when refresh page or back button, load localstorage data to page
        //if(sessionStorage.getItem('exchangeRate') != '') $scope.setupFxRate = sessionStorage.getItem('exchangeRate');
        var getCountry = $scope.getUrlPara("country");
        var getIsocode = $scope.getUrlPara("isocode");
        var getMsg = $scope.getUrlPara("message");
        var getFundout = $scope.getUrlPara("fundsout");

        if(getMsg) {
            $scope.homeMessage = decodeURI(getMsg);
        }else{
            $scope.homeMessage="Send money in 3 easy steps";
        }
        if( getCountry && getIsocode){
            $scope.updateCountry(getCountry, getIsocode, true, false);
        }else if( sessionStorage.getItem('sendToCountry') !='' && sessionStorage.getItem('sendToCountry') !=null && sessionStorage.getItem('sendToCountryCode') !='' && sessionStorage.getItem('sendToCountryCode') !=null){
            $scope.selectedCountry = sessionStorage.getItem('sendToCountry');
            $scope.selectedCountryCode = sessionStorage.getItem('sendToCountryCode');
            $scope.updateCountry($scope.selectedCountry, $scope.selectedCountryCode, true, true); 
        } 

        if(sessionStorage.getItem('recCurrencyCode') != '') $scope.targetCurrency = sessionStorage.getItem('recCurrencyCode');
        if(sessionStorage.getItem('sendAmount') !='') {
            $scope.sendAmount = sessionStorage.getItem('sendAmount');
            $scope.receiverAmount =  (parseFloat($scope.sendAmount) * parseFloat($scope.setupFxRate)).toFixed(2);
            $scope.amountKeyup('send');
        }

        if(sessionStorage.getItem('deliverMethod')!='' && sessionStorage.getItem('deliverMethod')!=null && sessionStorage.getItem('fee')!='' && sessionStorage.getItem('fee')!=null){
            $scope.updateTolAmount(sessionStorage.getItem('deliverMethod'), sessionStorage.getItem('fee'), sessionStorage.getItem('days'));
        }
        
        if(sessionStorage.getItem('bankName')!='' && sessionStorage.getItem('bankName')!=null && sessionStorage.getItem('bankCode')!='' && sessionStorage.getItem('bankCode')!=null){
            $scope.updateBankName(sessionStorage.getItem('bankName'), sessionStorage.getItem('bankCode'));
        }
        //validation form if enable submit button
        validateForm();

    });

})();


    

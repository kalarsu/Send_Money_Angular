$(document).ready(function(){
	
	function updateText(event){
		var input=$(this);
		var targetName = input.attr("name");
		if((targetName != "send-amount") ){
			setTimeout(function(){
				var val=input.val();
				if(val!="")
					input.parent().addClass("floating-placeholder-float");
				else
					input.parent().removeClass("floating-placeholder-float");
			},1)
		}
	}
	$(".floating-placeholder input").keydown(updateText);
	$(".floating-placeholder input").change(updateText);

	//Disclamier toggle-----------------------
	$(".disclaimer-content").hide();
	var disclaimerFlag = false;

	$(".toggle-btn").click(function(){
		disclaimerFlag = !disclaimerFlag;
        $(".disclaimer-content").slideToggle();

        if(disclaimerFlag){
        	$(".disclaimer-row .icons-lib.icon-more").removeClass("icon-more").addClass("icon-minus");
        	$("html, body").animate({ scrollTop: 740 }, "slow");
        }else{
        	$(".disclaimer-row .icons-lib.icon-minus").removeClass("icon-minus").addClass("icon-more");
        }

    });

    //for sender-info.html and receiver-info.html page onfocus blue border  
    $(".tabfocus").focus(function(e){
    	$(".tapfocus").removeClass("row-border-focus");
        $(this).parents('.tapfocus').addClass("row-border-focus");
        
    });



	//homepage scrolling
	// var scroll = 10;
	// $(window).scroll(function (event) {
 //    	scroll = $(window).scrollTop();
 //    	//console.log(scroll);
	// });
	// setInterval(function() {
	//     if (scroll==0) {
	//         $('.header-img').removeClass('hide-element');
 //            //$scope.showProgressBar = false;
	//     }
	// }, 250);



});
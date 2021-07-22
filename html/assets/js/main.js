var totalSteps = 11;	//default 11 steps
var current_fs = 0;
var hardcodejson ={"indId":"IN212121","title":"Mr","fullName":"NEOH Test","chineseFullName":"梁測試","chinesePreferredName":null,"preferredName":null,"memType":null,"memId":null,"expiryDate":"2099-04-01T00:00:00","hkid":"B76***","passport":"P123456789","surname":"Ho Nam","givenName":"Chan","chineseSurname":"梁","chineseGivenName":"測試","dateOfBirth":"1946-09-11","sex":"F","businessAddressId":null,"businessAddress1":null,"businessAddress2":null,"businessAddress3":null,"businessAddress4":null,"residentialAddressId":null,"residentialAddress1":null,"residentialAddress2":null,"residentialAddress3":null,"residentialAddress4":null,"residentialCountryCode":null,"preferredAddress":"","preferredPhone":"9876543","preferredEmail":"test123@test.hksi.org","mobileAreaCode":null,"mobileCountryCode":null,"businessPhone":"12345678","businessAreaCode":null,"businessEmailAddress":"chanhonam@cwb.hunghing.com","mobPhoneNum":"55554444","companyName":null,"chineseCompanyName":null,"position":null};

$(document).ready(function(){
	//hksi code
	getmeminfo();
	//flips code
	init();
	$("nav.main-nav ul li a").on("click", function(e){
		e.preventDefault();
		var elm = $(this);
		if(elm.closest("li").hasClass("done")){
			window.location.href = elm.attr("href");
		}
	})
});

function updateformvalue(meminfo){
	console.log('test meminfo '+JSON.stringify(meminfo));
	$("select[name=Salutation]").val(meminfo.title);
	$("input[name=Surname]").val(meminfo.surname);
	$("input[name=GivenName]").val(meminfo.givenName);
	$("input[name=SurnameChi]").val(meminfo.chineseSurname);
	$("input[name=GivenNameChi]").val(meminfo.chineseGivenName);
	$("input[name=PreferedName]").val(meminfo.preferredName);
	$("select[name=Sex]").val(meminfo.sex);
	$("input[name=Dob]").val(meminfo.dateOfBirth);
	$("input[name=HKID]").val(meminfo.hkid);
	$("input[name=travel_doc]").val(meminfo.passport);
	$("input[name=Email]").val(meminfo.preferredEmail);
	$("input[name=OfficeEmail]").val(meminfo.businessEmailAddress);
	$("input[name=Phone]").val(meminfo.preferredPhone);
	$("input[name=OfficeTel]").val(meminfo.businessPhone);
	$("input[name=SecretaryPhone]").val(meminfo.businessPhone);
	$("input[name=Address1]").val(meminfo.residentialAddress1);
	$("input[name=Address2]").val(meminfo.residentialAddress2);
	$("input[name=Address3]").val(meminfo.residentialAddress3);
	$("input[name=Address4]").val(meminfo.residentialAddress4);
	console.log(meminfo.surname);
}

function getmeminfo(){
	// init api params 
	var indId = getParameter("indId");
	var token = getParameter("token");
	console.log(indId,token);
	var meminfoapi = 'https://uat7.hksi.org/mis-open-api/api/mem_info?indId='+indId+'&token='+token;
    $.ajax
    ({
        dataType: "json",
        url: meminfoapi,
        success: function(data)
        {
            console.log(data);
			updateformvalue(data);
        }
    });
	//return hardcodejson;
}

function init(){
	if($(".progress").data("total") != undefined){
		totalSteps = $(".progress").data("total");	
	}

	var current = $("ul.steps li.active");
	/* if not start from step1 */
	var step = getParameter("fs");
	if(step != "" && !isNaN(step)){
		var elm = $("ul.steps li[data-step='"+step+"']");
		if(elm.length){
			current.removeClass("active")
			elm.addClass("active").prevAll("li").addClass("done");

			$(".form-step.current").removeClass("current");
			$(".form-step").eq(step).addClass("current");

			current = elm;
		}
	}
	/* if not start from step1 */
	if((current.data("step") + 1) == totalSteps){
		$("nav.main-nav .progress").css("height", "100%");
		$("nav.mobile-nav .progress").css("width", "100%");
	} else{
		$("nav.main-nav .progress").css("height", (((current.data("step") + 1)/totalSteps)*100)+"%");
		$("nav.mobile-nav .progress").css("width", (((current.data("step") + 1)/totalSteps)*100)+"%");
	}
	

	var current_fs = $(".form-step.current");
	renderNavButtons(current_fs);

	renderEmployment();

}


//--------------------get querystring----------------
function getParameter(name) {
    name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
        results = regex.exec(location.search);
    return results == null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}
//--------------------get querystring----------------
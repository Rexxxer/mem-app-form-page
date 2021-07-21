var validator;
var en = true;

$(document).ready(function(){
	validator = $("form").validate({
		errorElement: "span",
		errorPlacement: function(error, element){
			$(element).closest(".form-step").find(".error-msg[for='"+$(element).attr("name")+"']").html(error);

			/*var indicator = $(element).next(".indicator");
			if(indicator.length){
				indicator.removeClass("valid");
				indicator.addClass("invalid");
			}*/
		},
		showErrors: function(errorMap, errorList) {
			$.each(errorList, function (i, v){
				var indicator = $(v.element).next(".indicator");
				if(indicator.length){
					indicator.removeClass("valid");
					indicator.addClass("invalid");
				}
			})
		    this.defaultShowErrors();
	    },
		onfocusout: function(element) {
			if($(element).valid()){
				renderSuccessIndicator($(element));
			}

			if($(element).hasClass("required_any")){
				$.each($("input.required_any").not($(element)), function(i, v){
					if($(v).valid()){
						renderSuccessIndicator($(v));							
					}
				})
			}
			
		},
		success: function(label, element){
			/*var indicator = $(element).next(".indicator");
			if(indicator.length){
				indicator.removeClass("invalid").addClass("valid");
			}*/
		},
		ignore: ":hidden:not(input[type=file])",
		focusInvalid: true
	});

	// -------------------- Custom Validation Rules --------------------------------
	$.validator.addMethod("requiredTrue", function (value, element){
		return value == "true";
	}, en ? 'Select "Yes" to continue.': '如要繼續, 請選擇"是"');

	$.each($("input.required_true"), function(i, v){
		$(v).rules("add", "requiredTrue");	
	});
	

	$.validator.addMethod("atLeastOneCheckbox", function (value, element) {
        var group = $(element).closest(".form-group-checkbox");
        return ($("input[type=checkbox]:checked", group).length > 0);
    }, en ? 'Please select at least one option.' : '請選擇最少一個選項');

	$(".atleastOneCheckbox input[type=checkbox]").first().rules("add", "atLeastOneCheckbox");

	$.validator.addMethod("requiredAny", function (value, element) {			// for HKID/Travel doc. number
		var valid = false;
		$.each($("input.required_any"), function(i, v){
			if($(v).val() != ""){
				valid = true;
				return false;
			}
		});
        return valid;
    }, en ? 'Please enter either one value.' : '請填寫其中一個選項');

	$.each($("input.required_any"), function(i, v){
		$(v).rules("add", "requiredAny");	
	});


	// -------------------- Custom Validation Rules --------------------------------
});

function validatePart(fs){
	var valid = true;
	$(':input', fs).each(function(i, v){
		var edit = $(v).closest(".qual-item-edit");
		if($(v).is("[type=file]") && edit.length && edit.is(':hidden')){
			valid = true && valid;
		} else {
			var elmValid = validator.element(v);
			if(elmValid){
				renderSuccessIndicator($(v));
			}
        	valid = elmValid && valid;	
		}
    });
    return valid;
}

function showMemberType(fs){
	var q1 = $("form input[name=q1]:checked").val() == "true";
	var q2 = $("form input[name=q2]:checked").val() == "true";
	var q3 = $("form input[name=q3]:checked").val() == "true";

	$(fs).find(".mem-type").hide();

	if(q1 && q2){
		$(fs).find("#M_apply").show();
	} else if(!q1 && q3){
		$(fs).find("#U_apply").show();
	} else {
		$(fs).find("#A_apply").show();
	}
	
}

function renderSuccessIndicator(elm){
	var indicator = $(elm).next(".indicator");
	indicator.removeClass("invalid");
	if($(elm).val() != ""){
		if(indicator.length){
			indicator.addClass("valid");
		}
	}
}

function renderEmployment(){
	//for checking: only 1 employment record allowed
	var container = $("#credentials .employment");
	if($(".qual-item", container).length){
		container.find(".btn-container").hide();
	} else{
		container.find(".btn-container").show();
	}
}
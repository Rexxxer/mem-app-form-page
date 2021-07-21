var current_fs, next_fs, previous_fs; //
var left, opacity, scale; //properties which we will animate
var animating; //flag to prevent quick multi-click glitches


$(document).ready(function(){
	applyDateTimePicker($("form"));
	initFormControls();

	$("form .form-group-radio input").on("change", function(e){
		var elm = $(this);
		elm.closest(".form-group-radio").find("label.checked").removeClass("checked");
		elm.closest("label").addClass("checked");
	});

	$("form .form-group.additional").on("click", function(e){
		var elm = $(this);
		elm.hide();
		elm.next(".additional-fields").fadeIn().find("input:first").focus();
	});

	$(document).on("change", "form .form-group-checkbox input", function(e){
		var elm = $(this);
		if(elm.is(':checked')){
			if(elm.is('[type=radio]')){
				elm.closest(".row").find(".checkbox label.checked").removeClass("checked");
			}
			elm.closest(".checkbox").find("label").addClass("checked");
		} else {
			elm.closest(".checkbox").find("label").removeClass("checked");
		}
	})
	.on("click", "form .form-upload .upload-label", function(e){
		e.preventDefault();
		$(this).next("input[type='file']").click();
	})
	.on("change", "form input[type='file']", function(){
		var elm = $(this);
		if(elm[0].files.length){
			var label = elm.prev(".upload-label");
			label.find(".filename").text(elm[0].files[0].name);
			label.find("span:first-child").hide();
			elm.next(".btn-cancel").fadeIn();
		}
	})
	.on("click", "form .form-upload .btn-cancel", function(e){
		e.preventDefault();
		var elm = $(this);

		var label = elm.prevAll(".upload-label");
		label.find(".filename").text("");
		label.find("span:first-child").fadeIn();

		elm.prev("input[type='file']").val("");
		elm.hide();
	});

	//step form
	$(".btn-next, .btn-submit, .btn-payment").click(function(e){
		e.preventDefault();
		var elm = $(this);

		current_fs = $(".form-step.current");
		next_fs = current_fs.next(".form-step");

		if(validatePart(current_fs)){
			nextStep(true);

			//for mobile
			if(elm.closest(".form-step")){
				$('html, body').animate({
		          scrollTop: 0
		        });	
			}
		}
	});

	$(".btn-prev").click(function(e){
		e.preventDefault();
		
		current_fs = $(".form-step.current");
		previous_fs = current_fs.prev();

		prevStep(true);
	});


	//edit qualifications etc.
	$(document).on("click", ".qual-item .btn-edit", function(e){
		e.preventDefault();
		var item = $(this).closest(".qual-item");
		var container = item.closest(".details");

		//hide all other editing items
		if(container.find(".qual-item-edit:not(:hidden)").length){
			container.find(".qual-item-edit:not(:hidden)").remove();
			container.find(".qual-item").show();
		}

		item.hide();
		var elm = container.find(".qual-item-edit").first();
		var details = elm.clone();
		item.after(details);
		item.next(".qual-item-edit").fadeIn().css("display", "flex");
		item.next(".qual-item-edit").find("input[type=hidden][id$=id]").val(item.data("id"));
		applyDateTimePicker(details);
		container.find(".btn-add").show();
	})
	.on("click", ".qual-item-edit .btn-save", function(e){
		e.preventDefault();
		var elm = $(this);
		var temp = elm.closest(".qual-item-edit");

		if(validatePart(temp)){
			elm.closest(".actions").find(".btn-save, .btn-remove").hide().end()
			.find(".loading").show();


			//for demo
			
			var id = temp.find("input[type=hidden][id$=id]").val();
			var item = temp.prevAll(".qual-item[data-id='"+id+"']");
			
			setTimeout(function(){
				temp.closest(".details").find(".btn-add").show();
				temp.remove();
				item.fadeIn().css("display", "flex");
				elm.closest(".actions").find(".btn-save, .btn-remove").show().end()
					.find(".loading").hide();
			}, 1000);

			// if needed
			//renderEmployment();
		}
	})
	.on("click", ".qual-item-edit .btn-remove", function(e){
		e.preventDefault();
		var elm = $(this);
		elm.closest(".actions").find(".btn-save, .btn-remove").hide().end()
			.find(".loading").show();

		//for demo
		var temp = elm.closest(".qual-item-edit");
		var id = temp.find("input[type=hidden][id$=id]").val();
		var item = temp.prevAll(".qual-item");

		setTimeout(function(){
			temp.closest(".details").find(".btn-add").show();
			temp.remove();
			item.fadeIn().css("display", "flex");
			elm.closest(".actions").find(".btn-save, .btn-remove").show().end()
				.find(".loading").hide();
		}, 1000);

		// if needed
		//renderEmployment();
		
	})
	.on("click", ".part .details .btn-add", function(e){
		e.preventDefault();
		var elm = $(this);
		var container = elm.closest(".details");
		//hide all other editing items
		if(container.find(".qual-item-edit:not(:hidden)").length){
			container.find(".qual-item-edit:not(:hidden)").remove();
			container.find(".qual-item").show();
		}

		var details = container.find(".qual-item-edit").first().clone();
		elm.closest(".btn-container").before(details.fadeIn().css("display", "flex"));
		elm.hide();
		applyDateTimePicker(details);
	});

	//review page
	$(".btn-go").on("click", function(e){
		e.preventDefault();
		var elm = $(this);
		var step = $(".form-step").eq(elm.data("step"));
		if(step.length){
			current_fs = $(".form-step.current");
			previous_fs = step;
			prevStep(false);
			$(".nav-btn-group .btn").hide();
			$(".nav-btn-group .btn-review").css("display", "block");
		}
		
	})

	$(".nav-btn-group .btn-review").on("click", function(e){
		e.preventDefault();
		var elm = $(this);
		var step = $(".form-step").eq(elm.data("step"));
		if(step.length){
			current_fs = $(".form-step.current");
			next_fs = step;

			if(validatePart(current_fs)){
				nextStep(false);

				//for mobile
				if(elm.closest(".form-step")){
					$('html, body').animate({
			          scrollTop: 0
			        });	
				}
			}
			
		}
	})

	//btn-next onclick only scroll top when form is valid
	$(".form-step .nav-btn-group .btn-prev").on("click", function(e){
		e.preventDefault();

		$('html, body').animate({
          scrollTop: 0
        });

	})
});

function applyDateTimePicker(container){
	$.each($(container).find(".input-datepicker"), function(index, value){
		var isMonth = $(value).hasClass("input-monthpicker");
		$(value).datepicker({
			format: isMonth ? "mm-yyyy" : "dd-mm-yyyy",
			endDate: $(value).hasClass("dob") ? "0d" : "",
			minViewMode: isMonth ? "months" : "days"
		}).on('show', function(){
			$('.datepicker .prev').text("<");
			$('.datepicker .next').text(">");	
		});
	});
}

function initFormControls(){
	$.each($("input[type=radio]:checked, input[type=checkbox]:checked"), function(index, value){
		$(value).closest("label").addClass("checked");
	});
}

function nextStep(updateProgress){
	if(animating) return false;
		animating = true;

		if(updateProgress){
			//activate next step on progressbar using the index of next_fs
			var index = $(".form-step").index(next_fs);
			if(index+1 == totalSteps){
				$("nav.main-nav .progress").css("height", "100%");
				$("nav.mobile-nav .progress").css("width", "100%");
			} else{
				$("nav.main-nav .progress").height(((index+1) / totalSteps *100) + "%");
				$("nav.mobile-nav .progress").width(((index+1) / totalSteps *100) + "%");
			}
			
			var activeElm = $("ul.steps li.active");
			if(activeElm.next().data("step") == index){
				activeElm.next().addClass("active");
				activeElm.removeClass("active").addClass("done");
			}
		}
		renderNavButtons(next_fs);

		renderFs(next_fs);

		
		
		//show the next fieldset
		next_fs.show(); 
		//hide the current fieldset with style
		current_fs.animate({opacity: 0}, {
			step: function(now, mx) {
				//as the opacity of current_fs reduces to 0 - stored in "now"
				//1. scale current_fs down to 80%
				scale = 1 - (1 - now) * 0.2;
				//2. bring next_fs from the right(50%)
				left = (now * 50)+"%";
				//3. increase opacity of next_fs to 1 as it moves in
				opacity = 1 - now;
				current_fs.css({
	        'transform': 'scale('+scale+')',
	        'position': 'absolute'
	      });
				next_fs.css({'left': left, 'opacity': opacity});
			}, 
			duration: 800, 
			complete: function(){
				current_fs.hide();
				animating = false;
				current_fs.removeClass("current");
				next_fs.addClass("current");
				applyDateTimePicker(next_fs);
			}, 
			//this comes from the custom easing plugin
			easing: 'easeInOutCubic'
		});
}

function prevStep(updateProgress){
	if(animating) return false;
		animating = true;
		
		if(updateProgress){
			//de-activate current step on progressbar
			var index = $(".form-step").index(previous_fs);
			$("nav.main-nav .progress").height(((index+1) / totalSteps *100) + "%");
			$("nav.mobile-nav .progress").width(((index+1) / totalSteps *100) + "%");
			var activeElm = $("ul.steps li.active");
			if(parseInt(activeElm.data("step")) > index){
				activeElm.prev().removeClass("done").addClass("active");
				activeElm.removeClass("active done");
			}
		}
		renderNavButtons(previous_fs);
		
		renderFs(previous_fs);
		//show the previous fieldset
		previous_fs.show(); 
		//hide the current fieldset with style
		current_fs.animate({opacity: 0}, {
			step: function(now, mx) {
				//as the opacity of current_fs reduces to 0 - stored in "now"
				//1. scale previous_fs from 80% to 100%
				scale = 0.8 + (1 - now) * 0.2;
				//2. take current_fs to the right(50%) - from 0%
				left = ((1-now) * 50)+"%";
				//3. increase opacity of previous_fs to 1 as it moves in
				opacity = 1 - now;
				current_fs.css({'left': left});
				previous_fs.css({'transform': 'scale('+scale+')', 'opacity': opacity});
			}, 
			duration: 800, 
			complete: function(){
				current_fs.hide();
				animating = false;
				current_fs.removeClass("current");
				previous_fs.addClass("current");
				applyDateTimePicker(previous_fs);
			}, 
			//this comes from the custom easing plugin
			easing: 'easeInOutCubic'
		});
}

function renderNavButtons(fs){
	$(".nav-btn-group .btn").hide();
	if(fs.prev().length){
		$(".nav-btn-group .btn-prev").show();
	} else{
		$(".nav-btn-group .btn-prev").hide();
	}

	if(fs.data("btn") != undefined && $(".nav-btn-group ."+ fs.data("btn")).length){
		$(".nav-btn-group ."+ fs.data("btn")).css("display", "block");
		$(".form-step .nav-btn-group ."+ fs.data("btn")).css("display", "inline-block");
	} else{
		if(fs.next(".form-step").length){
			$(".nav-btn-group .btn-next").show();
		} else{
			// thank you page
			$(".nav-btn-group .btn-next").hide();
			$(".nav-btn-group .btn-prev").hide();
		}
	}
}


function renderFs(fs){
	if(fs.is($(".form-step").eq(1))){
		fs.find(".q2, .q3").hide();
		if($("form input[name=q1]:checked").val() == "true"){
			fs.find(".q2").show();
			$("input[name=q3]:checked").prop("checked", false).closest("label").removeClass("checked");
		} else {
			fs.find(".q3").show();
			$("input[name=q2]:checked").prop("checked", false).closest("label").removeClass("checked");
		}
	}

	if(fs.hasClass("form-step-qualify")){
		showMemberType(fs);
	}
}
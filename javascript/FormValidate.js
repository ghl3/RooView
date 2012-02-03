

function ValidateForm() {
    
    // Validate
    $('form[name=SampleForm]').validate({
	debug: false,
	rules: {
	    Name: {
		required: true
	    },
	    File: {
		required: true
	    },
	    Color: {
		required: true
	    }
	},
	messages: {
	    Name: {
		required: "Enter the Name of the sample."
	    },
	    File: {
		required: "Enter the file for this sample."
	    },
	    Color: {
		required: "Color required."

	    }
	},
	submitHandler: function(form) {
	}
    });

}

$(document).ready(function(){
    ValidateForm();
});


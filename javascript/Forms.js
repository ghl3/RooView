

function SubmitJSForm() {
    
    document.getElementById("debug").innerHTML += "AJAX REQUEST<br>";

    var FormString = $("#Form_js").serialize()

    $.post( "MakePlots.php", FormString, function(data) 
	    { 
		document.getElementById("debug").innerHTML += "AJAX REQUEST<br>";
		document.getElementById("debug").innerHTML += data + "<br";
		//$('#results').html(data);
		//// Now Build the Table
		//CreateAllTables( ActiveChannels );
	    } 
	  );
}


$(document).ready(function() {
    
    $("button#Button_Form_js").click(function(){
	SubmitJSForm();
    });                  

});
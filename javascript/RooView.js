
// Holder

$(document).ready(function() {
    document.getElementById("debug").innerHTML += "Starting draw.js code <br>";
});


var Variables = new Array();
var Cuts      = new Array();
var Channels  = new Array();

function BuildVarCutForm() {
    
    document.getElementById("debug").innerHTML += "Entering BuildVarCutForm()<br>";
    
    // Buld the arrays, just 
    // for the example now

/*
    Variables = [];
    Cuts = [];
    Channels = [];
    
    Variables.push( "Mjj" );
    Variables.push( "JetN" );
    Variables.push( "MET" );

    Cuts.push( "AllEvents" );
    Cuts.push( "AllCuts" );

    Channels.push( "Dilepton_EE" );
    Channels.push( "Dilepton_EM" );
    Channels.push( "Dilepton_MM" );
*/


    FillCheckboxFromList( "VariableCheckbox", "Variable", Variables );
    FillCheckboxFromList( "CutCheckbox",      "Cut",      Cuts );
    FillCheckboxFromList( "ChannelCheckbox",  "Channel",  Channels );

}


var ActiveVariables = new Array();
var ActiveCuts      = new Array();
var ActiveChannels  = new Array();

function GetActiveParameters() {

    ActiveVariables = GetSelectedValues( "VariableCheckbox" );  
    ActiveCuts      = GetSelectedValues( "CutCheckbox" );  
    ActiveChannels  = GetSelectedValues( "ChannelCheckbox" );  
  
}


// Declare the Plot Class

function PlotRequest( Variable, Cut, Channel, SampleList, Lumi) {
    
    this.Variable   = Variable;
    this.Cut        = Cut;
    this.Channel    = Channel;
    this.SampleList = SampleList; // Array of samples
    this.Lumi = Lumi;
    //this.Channel = "Dilepton_EE";

}

function GetCurrentChannel() {
    return "Dilepton_EE";
    var select = document.getElementById("ChannelSelect");
    var chan   = select.options[select.selectedIndex].value;
    return chan;
}


function GetCurrentLumi() {
    var LumiInput = document.getElementById("Lumi");
    var Lumi = parseFloat( LumiInput.value );
    return Lumi;
}

//var Channel = "Dilepton_EE";
function MakePlots() {

    document.getElementById("debug").innerHTML += "MakePlots()<br>";

    // Use a jquery post to have a php
    // script call a python module
    // to make plot using ROOT
    
        
    // Make the list of plots to make
    // PlotRequests = { Plots: 
    //                   { 
    //                     { Cut: CutA, Var: VarA, Samples: 
    //                         { {Name: Name1, File: File1, Color: Color1 }, {...} }
    //                     },
    //                     { Cut: CutB, Var: VarB, Samples: 
    //                         { {Name: Name1, File: File1, Color: Color1 }, {...} }
    //                     }
    //                   } 
    //                }

    var PlotRequests = new Array();

    for(var i_chan = 0; i_chan < ActiveChannels.length; ++i_chan) {
	for(var i_var = 0; i_var < ActiveVariables.length; ++i_var) {
	    for(var i_cut = 0; i_cut < ActiveCuts.length; ++i_cut) {
		
		var Variable = ActiveVariables[ i_var ];
		var Cut      = ActiveCuts[ i_cut ];
		var ThisChan = ActiveChannels[ i_chan ];//GetCurrentChannel();
		var Lumi     = GetCurrentLumi();
		var Plot     = new PlotRequest( Variable, Cut, ThisChan, SampleArray, Lumi);
		PlotRequests.push( Plot );
	    }
	}
    }

    document.getElementById("debug").innerHTML += "About to Serialize JSON<br>";

    // Now serialize the class:
    var PlotRequestsJSON = JSON.stringify(PlotRequests);
    
    document.getElementById("debug").innerHTML += "Making Request<br>";

    // Submit it via jquery / AJAX
    $.post( "MakePlots.php", {data: PlotRequestsJSON}, function(data) 
	    { 
		
		// MUST ADD SOME WAY HERE TO CHECK
		// IF PLOTS WERE SUCCESSFULLY MADE!!!!!!!
		
		document.getElementById("debug").innerHTML += "AJAX REQUEST<br>";
		$('#results').html(data);
		// Now Build the Table
		CreateAllTables( ActiveChannels );
	    } 
	  );

    document.getElementById("debug").innerHTML += "Request Made<br>";

}


function CreateAllTables( List ) {

    var PlotTablesDiv = document.getElementById('PlotTables');

    $("#PlotTables").hide("fast");
    // Clear the Table div:
    while ( PlotTablesDiv.childNodes.length > 0 ) {
	PlotTablesDiv.removeChild( PlotTablesDiv.firstChild );
    } 

    for(var i = 0; i < List.length; ++i) {

	PlotTablesDiv.innerHTML += List[i] + "<br>";
	BuildTable( List[i]);
	PlotTablesDiv.innerHTML += "<hr>";
    }

    $("#PlotTables").show("fast");


}


function BuildTable( ChannelName ) {

    document.getElementById("debug").innerHTML += "Entering BuildTable()<br>";

    var NumRows    = ActiveCuts.length + 1;
    var NumColumns = ActiveVariables.length + 1;

    var PlotTablesDiv = document.getElementById('PlotTables');
    var table = document.createElement('table');

    // Clear the table:
    //    while ( table.childNodes.length > 0 ) {
    //    table.removeChild( table.firstChild );
    // } 
    
    document.getElementById("debug").innerHTML += "Got Table<br>";

    for( var i_row = 0; i_row < NumRows; ++i_row) {
	
	document.getElementById("debug").innerHTML += "Row Loop<br>";

	var row = table.insertRow(i_row);

	for( var i_col = 0; i_col < NumColumns; ++i_col) {

	    var cell = row.insertCell(i_col);
	    cell.align = "center";

	    var CutIndex = i_row - 1;
	    var VariableIndex = i_col- 1;

	    // Create the column label
	    if( i_row == 0 ) {
		if( i_col == 0 ) continue;
		cell.innerHTML = ActiveVariables[ VariableIndex ];
		continue;
	    }

	    // Create the row label
	    if( i_col == 0 ) {
		cell.innerHTML = ActiveCuts[ CutIndex ];
		continue;
	    }

	    // Add the Image
	    var image = document.createElement("img");

	    // Get the image name:
	    var name = "Plots/" + ActiveVariables[ VariableIndex ] + "_" + ChannelName + "_" +  ActiveCuts[ CutIndex ] + ".jpg";
	    document.getElementById("debug").innerHTML += "Getting image: " + name + "<br>";
	    image.src = name + '?' + new Date().getTime();
	    image.style.border = "1px solid black";
	    image.width = "300"; /*TableWidth / NumColumns; */
	    cell.appendChild( image );

	} // columns
    } // rows

    PlotTablesDiv.appendChild( table );

}



var PlotType;
function SelectPlotType() {
    
    // Get the Plot Type
    PlotType = document.getElementById("PlotTypeSelect").value; 
    $('div#PlotTypeForm').hide();   
    
    // Fill and show the summary lable
    document.getElementById("PlotTypeLabel").innerHTML = PlotType;
    $('div#PlotTypeSummary').show();   
    
    // Show the next step in the form

    $('div#SampleMenu').show();   
    $('div#VarCutForm').show();   
}

function ChangePlotType() {
   
    // Get the Plot Type
    $('div#PlotTypeForm').show();   
    $('div#PlotTypeSummary').hide();   
    $('div#SampleMenu').hide();   
    $('div#VarCutForm').hide();   

}

function SelectChannels() {

    ToggleSubtagsOfType("ChannelCheckbox", "checkbox" );
    $('div#VariableDiv').toggle();   
    $('div#CutDiv').toggle();   

}


function ClearSamples() {

    // Clear the Form
    var SampleForms = document.getElementById("MCSampleForms");
    while ( SampleForms.childNodes.length > 0 ) {
	SampleForms.removeChild( SampleForms.firstChild );
    } 

    // Clear the Sample Variables:
    SampleArray = [];

}

function NewMCSample() {

    // Clear all forms:

    var Form = document.createElement("form");
    Form.name = "MCSampleForm";
    Form.style.textAlign = "left;"
    Form.style.margin= "auto;"

    // Add the input name
    var label = document.createElement('label')
    label.appendChild(document.createTextNode("MC "));
    label.appendChild(document.createTextNode("Name: "));
    Form.appendChild( label );
    var InputName = document.createElement('input');
    InputName.type = "text";
    InputName.name = "Name";
    Form.appendChild( InputName );
    
    // Add the input file
    var label = document.createElement('label')
    label.appendChild(document.createTextNode("File: "));
    Form.appendChild( label );
    var InputFile = document.createElement('input');
    InputFile.type = "text";
    InputFile.name = "File";
    Form.appendChild( InputFile );
    
    // Add the input color
    var label = document.createElement('label')
    label.appendChild(document.createTextNode("Color: "));
    Form.appendChild( label );
    var InputColor = MakeColorSelect(); 
    Form.appendChild( InputColor );

    // Add a button to delete this form:
    var deletebutton = document.createElement('img');
    deletebutton.name      = "DeleteFormButton";
    deletebutton.className = "DeleteFormButton";
    deletebutton.src =  'images/RedX.jpg';
    deletebutton.style.width  =  '13px';
    deletebutton.style.marginLeft  = '2px';
    deletebutton.style.marginRight = '2px';

    Form.appendChild( deletebutton );

    return Form;

}


function BuildFormFromCookie( sampleListJSON, Lumi ) {

    // Builds and pre-fills the Sample
    // form based on the values cached 
    // in a cookie
    
    for( var i = 0; i < sampleListJSON.length; i++) {
	var SampleInList = sampleListJSON[i];
	document.getElementById("debug").innerHTML += SampleInList.Name + " " + SampleInList.Color + "<br>";
	
	if( SampleInList.Name == "Data" ) {
	    // Set the properties of the Data Form
	    var DataForm = document.getElementById("DataSampleForm");
	    DataForm.elements["Name"].value = SampleInList.Name;
	    DataForm.elements["File"].value = SampleInList.File;
	    DataForm.elements["Lumi"].value = Lumi;
	}
	else {

	    // Make a new MC Sample Form
	    var SampleForms = document.getElementById("MCSampleForms");
	    var MCForm = NewMCSample();
	    MCForm.elements["Name"].value  = SampleInList.Name;
	    MCForm.elements["File"].value  = SampleInList.File;
	    MCForm.elements["Color"].value = SampleInList.Color;
	    SampleForms.appendChild( MCForm );
	}
	
    }


}

// Declare the Sample Class:

function Sample(Name, File, Color) {
    this.Name  = Name;
    this.File  = File;
    this.Color = Color;
}                


var ParameterList;
var SampleArray = new Array();


function SubmitSamples() {

    // Take all samples in the sample form(s)
    // and use it to build the SampleArray

    // Clear the Sample Array
    SampleArray = [];

    // Get the Data form:
    var DataForm = document.getElementById("DataSampleForm");
    var Name  = DataForm.elements["Name"].value;
    var File  = DataForm.elements["File"].value;
    var Color = 1; //DataForm.elements["Color"].value;
    var ThisSample = new Sample( Name, File, Color );
    SampleArray.push( ThisSample );


    // CAN STREAMLINE THIS: form[name="MCSampleForm"]
    var FormList = document.getElementsByTagName("form");

    for( var i = 0; i < FormList.length; ++i) {

	// Get the info, create a "Sample" class
	// and push it into the "SampleArray"

	var Form = FormList[i];
	if( Form.name != "MCSampleForm" ) continue;

	var Name  = Form.elements["Name"].value;
	var File  = Form.elements["File"].value;
	var Color = Form.elements["Color"].value;
	var ThisSample = new Sample( Name, File, Color );
	SampleArray.push( ThisSample );
    }
    
    // Create a list of files
    // to be passed to the "GetParameters"
    // POST handler
    var FileList = new Array();

    for( var i = 0; i < SampleArray.length; ++i) {
	var String = SampleArray[i].Name + " " + SampleArray[i].File + " " + SampleArray[i].Color;
	document.getElementById("debug").innerHTML += String + "<br>";	
	FileList.push( SampleArray[i].File );
    }

    // Submit it via jquery / AJAX
    $.post( "GetParameters.php", {"FileList" : JSON.stringify(FileList) }, function(data) 
	    { 
		document.getElementById("debug").innerHTML += "AJAX REQUEST<br>";
		ParameterList = data;
		$('#results').html(data);
		var Parameters = JSON.parse(data);
		// Now Build the Selection
		Variables = string(Parameters.Variables).split(",");
		Cuts      = Parameters.Cuts.split(",");
		Channels  = Parameters.Channels.split(",");
		document.getElementById("debug").innerHTML += "Setting Parameters:<br>";
		document.getElementById("debug").innerHTML += "Variables: " + Variables  +  "<br>";
		document.getElementById("debug").innerHTML += "Channels: " + Channels + "<br>";
		document.getElementById("debug").innerHTML += "Cuts: " + Cuts + "<br>";

	    } 
	  );
    
}


function FixSampleList() {
    
    // Hide
    $('form[name=DataSampleForm]').hide();
    $('form[name=MCSampleForm]').hide();

    // Loop over Sample List and add the fixed list:

    for( var i = 0; i < SampleArray.length; ++i) {
	var String = SampleArray[i].Name + " " + SampleArray[i].File + " " + SampleArray[i].Color;
	var mytext=document.createTextNode(String)
	mytext.Name = "SampleListText";
	document.getElementById("SampleListSummary").appendChild(mytext);// += String + "<br>";	
	document.getElementById("SampleListSummary").innerHTML += "<br>";// appendChild(mytext);// += String + "<br>";	

    }

}

function DeleteSampleListSummary() {

    var SummaryList = document.getElementById('SampleListSummary');
    SummaryList.innerHTML = "";
    //SummaryList.empty();
}


$(document).ready(function() {

    // Setup the buttons
    // and default behavior

    $('div#SampleMenu').hide();
    $('div#VarCutForm').hide();

    $('div#ChannelDiv').hide();   
    $('div#VariableDiv').hide();   
    $('div#CutDiv').hide();   


    $('div#PlotTypeSummary').hide();
    $("#debug").hide();
    $("#results").hide();
    $("#UpdateSamples").hide();
    $("#MakePlots").hide();

    $("button#SelectPlotType").click(function(){
	SelectPlotType();
    });                  

/*
    $("button#SelectChannels").click(function(){
	SelectChannels();

    });                  
*/

    $("button#ChangePlotType").click(function(){
	ChangePlotType();
    });                  

    $("button#MakePlots").click(function(){
	GetActiveParameters();
	MakePlots();
    });                  


    $('.DeleteFormButton').live('click', function() {
	document.getElementById("debug").innerHTML += "Deleting Button";
	$(this).parent().remove();   
    });                  

    //NewDataSample();
    $("button#NewSample").click(function(){
	var SampleForms = document.getElementById("MCSampleForms");
	var NewForm = NewMCSample();
	SampleForms.appendChild( NewForm );
    });                  

    $("button#SubmitSamples").click(function(){
	ValidateForm();
	SubmitSamples();
	BuildVarCutForm();
	cacheCookieSamples();
	cacheCookieLumi();
	FixSampleList();
	$("#NewSample").hide("fast");
	$("#ClearSamples").hide("fast");
	$("#SubmitSamples").hide("fast");
	$("#UpdateSamples").show("fast");
	$("#MakePlots").show("fast");

	$('div#ChannelDiv').show();   
	$('div#VariableDiv').show();   
	$('div#CutDiv').show();   


    });                  

    $("button#UpdateSamples").click(function(){
	//SubmitSamples();
	$('form[name=DataSampleForm]').show("fast");
	$('form[name=MCSampleForm]').show("fast");
	$("#NewSample").show("fast");
	$("#ClearSamples").show("fast");
	$("#SubmitSamples").show("fast");
	$("#UpdateSamples").hide("fast");
	$("#MakePlots").hide("fast");
	DeleteSampleListSummary();

	$('div#ChannelDiv').hide();   
	$('div#VariableDiv').hide();   
	$('div#CutDiv').hide();   

    });                  


    $("button#ClearSamples").click(function(){
	ClearSamples();
	//NewDataSample();
    });                  

    $("button#ToggleDebug").click(function(){
	$("#results").toggle("fast");
	$("#debug").toggle("fast");
    });                  


});


$(document).ready(function() {

    document.getElementById("debug").innerHTML += "Document ready<br>";
    checkCookies();

    // Start
    BuildTable();
    GetActiveParameters();

});




// Holder

$(document).ready(function() {
    console.log( "Starting draw.js code");
});


// Global Variables

var ParameterList = {};
var SampleArray = new Array();

var Variables = new Array();
var Cuts      = new Array();
var Channels  = new Array();

var ActiveVariables = new Array();
var ActiveCuts      = new Array();
var ActiveChannels  = new Array();

var DataFiles = new Array();


/*
function BuildSampleList() {

    // Create a JSON string of samples
    // based on the files available 
    // in the directory "Data"

    // First, send a request to the server
    // to get the list of files

    var FileList;
    
    $.post( "php/ListFiles.php", {}, function(data){FileList = data;} ); 

    return FileList;

}
*/

function BuildVarCutForm() {
    
    // Using the global list variables:
    // 'Variables', 'Cuts', and 'Channels'
    // Build the checkbox 

    console.log( "BuildVarCutForm() : Begin");
    
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

    console.log( "BuildVarCutForm() : End ");

}

function GetActiveParameters() {
    
    // Get the check variables in the 
    // Cut, Channel, Var checkbox

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

//var Channel = "Dilepton_EE";
function MakePlots() {

    console.log("MakePlots()");
    //console.log( "MakePlots()<br>";

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

    //console.log( "Active Channels: " . ActiveChannels . "<br>";
    //console.log( "Active Varaibles: " . ActiveVariables . "<br>";
    //console.log( "Active Cuts: " . ActiveCuts . "<br>";
    
    GetActiveParameters();

    var PlotRequests = new Array();

    for(var i_chan = 0; i_chan < ActiveChannels.length; ++i_chan) {
	for(var i_var = 0; i_var < ActiveVariables.length; ++i_var) {
	    for(var i_cut = 0; i_cut < ActiveCuts.length; ++i_cut) {
	
	
		var Variable = ActiveVariables[ i_var ];
		var Cut      = ActiveCuts[ i_cut ];
		var ThisChan = ActiveChannels[ i_chan ]; //GetCurrentChannel();
		var Lumi     = GetCurrentLumi();

		console.log( "Adding Plot: " + Variable + " " + Cut + " " + ThisChan );

		var Plot     = new PlotRequest( Variable, Cut, ThisChan, SampleArray, Lumi);
		PlotRequests.push( Plot );
	    }
	}
    }

    console.log( "About to Serialize JSON");

    // Now serialize the class:
    var PlotRequestsJSON = JSON.stringify(PlotRequests);
    
    console.log( "Making Request");

    // Submit it via jquery / AJAX
    $.post( "php/MakePlots.php", {data : PlotRequestsJSON}, function(data) 
	    { 
		
		// MUST ADD SOME WAY HERE TO CHECK
		// IF PLOTS WERE SUCCESSFULLY MADE!!!!!!!
		
		console.log( "AJAX REQUEST");
		$('#results').html(data);
		// Now Build the Table
		CreateAllTables( ActiveChannels );
	    } 
	  );

    console.log( "Request Made");

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

    console.log( "Entering BuildTable()");

    var NumRows    = ActiveCuts.length + 1;
    var NumColumns = ActiveVariables.length + 1;

    var PlotTablesDiv = document.getElementById('PlotTables');
    var table = document.createElement('table');

    // Clear the table:
    //    while ( table.childNodes.length > 0 ) {
    //    table.removeChild( table.firstChild );
    // } 
    
    console.log( "Got Table");

    for( var i_row = 0; i_row < NumRows; ++i_row) {
	
	console.log( "Row Loop");

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
	    console.log( "Getting image: " + name );
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


function MakeDataSample() {

    var Form = document.createElement("form");
    Form.name = "DataSampleForm";
    //Form.setAttribute("id", "DataSampleForm");
    Form.id = "DataSampleForm";
    Form.className = "dataSampleForm";
    Form.style.textAlign = "left;"
    Form.style.margin= "auto;"

    // Add the input name
    var nameLabel = document.createElement('label')
    nameLabel.className = "dataLabel";
    nameLabel.appendChild(document.createTextNode("Data "));
    nameLabel.appendChild(document.createTextNode("Name: "));
    Form.appendChild( nameLabel );
    var InputName = document.createElement('input');
    InputName.className = "dataInput";
    InputName.type = "text";
    InputName.name = "Name";
    Form.appendChild( InputName );
    
    // Add the input file
    var fileLabel = document.createElement('label')
    fileLabel.className = "dataLabel";
    fileLabel.appendChild(document.createTextNode("File: "));
    Form.appendChild( fileLabel );
    //var InputFile = document.createElement('input');
    var InputFile = MakeFileSelect();//document.createElement('input');
    //InputFile.type = "text";
    //InputFile.name = "File";
    InputFile.className = "mcInput";
    Form.appendChild( InputFile );

    // Add the lumi
    var lumiLabel = document.createElement('label')
    lumiLabel.className = "dataLabel";
    lumiLabel.appendChild(document.createTextNode("Lumi: "));
    Form.appendChild( lumiLabel );
    var InputLumi = document.createElement('input');
    InputLumi.className = "mcInput";
    InputLumi.type = "text";
    InputLumi.name = "Lumi";
    //InputLumi.setAttribute("id", "Lumi");
    InputLumi.id = "Lumi";
    InputLumi.style.width = "40px";
    Form.appendChild( InputLumi );
    
    console.log("Made Data Sample Form");

    return Form;



}

function NewMCSample() {

    // Clear all forms:

    var Form = document.createElement("form");
    Form.name = "MCSampleForm";
    Form.style.textAlign = "left;"
    Form.style.margin= "auto;"

    // Add the input name
    var label = document.createElement('label')
    label.className = "mcLabel";
    label.appendChild(document.createTextNode("MC "));
    label.appendChild(document.createTextNode("Name: "));
    Form.appendChild( label );
    var InputName = document.createElement('input');
    InputName.className = "mcInput";
    InputName.type = "text";
    InputName.name = "Name";
    Form.appendChild( InputName );
    
    // Add the input file
    var label = document.createElement('label')
    label.className = "mcLabel";
    label.appendChild(document.createTextNode("File: "));
    Form.appendChild( label );
    //var InputFile = document.createElement('input');
    var InputFile = MakeFileSelect();//document.createElement('input');
    //InputFile.type = "text";
    //InputFile.name = "File";
    InputFile.className = "mcInput";
    Form.appendChild( InputFile );
    
    // Add the input color
    var label = document.createElement('label')
    label.className = "mcLabel";
    label.appendChild(document.createTextNode("Color: "));
    Form.appendChild( label );
    var InputColor = MakeColorSelect(); 
    InputColor.className = "mcInput";
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
	console.log( SampleInList.Name + " " + SampleInList.Color );
	
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


function SubmitSamples() {

    // Take all samples in the sample form(s)
    // and use it to build the SampleArray
    // In addition, object holding the 
    // Channels and Variables
  
    // First, Validate the form
    ValidateForm();

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

    console.log( "About to get properties.  SampleArray size: " + SampleArray.length );

    for( var i = 0; i < SampleArray.length; ++i) {
	var String = SampleArray[i].Name + " " + SampleArray[i].File + " " + SampleArray[i].Color;
	console.log( String );	
	FileList.push( SampleArray[i].File );
    }


    console.log( "About to get properties.  FileList size: " + FileList.length );

    var AjaxRequestDone = false;
    
    // Now, get the parameters from these files
    // And store them
    $.post( "php/GetParameters.php", {"FileList" : JSON.stringify(FileList) }, function(data) 
	    { 
		console.log( "AJAX REQUEST");
		//ParameterList = data;
		$('#results').html(data);
		console.log( "data: " + data );

		var Parameters = JSON.parse(data);

		// Now Build the Selection
		//Variables = string(Parameters.Variables).split(",");
		Variables = Parameters.Variables; //.split(",");
		Cuts      = Parameters.Cuts; //.split(",");
		Channels  = Parameters.Channels; //.split(",");

		// ParameterList["Channels"]  = Channels;
		// ParameterList["Variables"] = Variables;
		// ParameterList["Cuts"]      = Variables;

		console.log( "Setting Parameters:");
		console.log( "Variables: " + Variables );
		console.log( "Channels: " + Channels );
		console.log( "Cuts: " + Cuts );

		AjaxRequestDone=true;


		// All of this must be placed in the call back
		// since this request is asyncronous, ie won't
		// necessarily be processed when the javascript
		// passes this point

		BuildVarCutForm();
		cacheCookieSamples();
		cacheCookieLumi();
		FixSampleList();
		$("#NewSample").hide("fast");
		$("#ClearSamples").hide("fast");
		$("#AddFile").hide("fast");
		$("#SubmitSamples").hide("fast");
		$("#UpdateSamples").show("fast");
		$("#MakePlots").show("fast");
		
		$('div#ChannelDiv').show();   
		$('div#VariableDiv').show();   
		$('div#CutDiv').show();   

	    } 
	  );

    // Done
    
}


function FixSampleList() {
    
    // Hide the Sample selectors and
    // replace them with static text
    // summarizing them

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

    // Ask server, async
    DataFiles = GetDataFiles();

    //while( DataFiles == undefined

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


    // Add the data form
    var DataForm = document.getElementById("DataSampleForms");
    DataForm.appendChild( MakeDataSample() );


    $("button#SelectPlotType").click(function(){
	SelectPlotType();
    });                  

    $("button#ChangePlotType").click(function(){
	ChangePlotType();
    });                  

    $("button#MakePlots").click(function(){

	MakePlots();
    });                  


    $('.DeleteFormButton').live('click', function() {
	console.log( "Deleting Button");
	$(this).parent().remove();   
    });                  

    // New MC Sample();
    $("button#NewSample").click(function(){
	var SampleForms = document.getElementById("MCSampleForms");
	var NewForm = NewMCSample();
	SampleForms.appendChild( NewForm );
    });                  

    $("button#AddFile").click(function(){
	// Do Nothing
    });                  

    $("button#SubmitSamples").click(function(){
	// ValidateForm();
	SubmitSamples();
	// BuildVarCutForm();
/*
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
*/

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

    /*
    $("button#ToggleDebug").click(function(){
	$("#results").toggle("fast");
	$("#debug").toggle("fast");
    });                  
*/

});


$(document).ready(function() {

    console.log( "Document ready");
    checkCookies();

    // Start
    BuildTable();
    GetActiveParameters();


});



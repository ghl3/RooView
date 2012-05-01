
// Clear
function Clear( Element ) {
    while ( Element.childNodes.length > 0 ) {
	Element.removeChild( Element.firstChild );
    } 
}



function GetCurrentChannel() {
    //return "Dilepton_EE";
    var select = document.getElementById("ChannelSelect");
    var chan   = select.options[select.selectedIndex].value;
    return chan;
}


function GetCurrentLumi() {
    var LumiInput = document.getElementById("Lumi");
    var Lumi = parseFloat( LumiInput.value );
    return Lumi;
}


// Take a checkbox, find all things that are checked,
// Hide all inputs that aren't checked, and keep their lables

function ToggleCheckbox( Checkbox ) {


    // Assumes the checkbox in in the form:

    // Loop over children
    var Children = Checkbox.childNodes;

    for( var i_child = 0; i_child < Children.length; ++i_child ) {

	var child = Children[i_child];

	if( child.type != "checkbox" ) continue;

	$(child).hide();
	if( ! child.checked ) {
	    $(Children[i_child+1]).hide();
	}
    }
    
}


// Creat Checkbox from List:
function FillCheckboxFromList( CheckboxName, ItemName,  List ) {


    console.log( "Fill CheckboxFromList : " + ItemName + " Size: " + List.length);

    // Now Build the Variable Checkbox
    var VarCheckbox = document.getElementById( CheckboxName );

    // Clear VarCheckbox:
    while ( VarCheckbox.childNodes.length > 0 ) {
	VarCheckbox.removeChild( VarCheckbox.firstChild );
    } 
    
    // Add the new inputs
    for( var i = 0; i < List.length; ++i) {
	var VarCheckbox_input = document.createElement('input');
	VarCheckbox_input.type = "checkbox";
	VarCheckbox_input.name = ItemName;
	VarCheckbox_input.value = List[i];
	VarCheckbox.appendChild( VarCheckbox_input );

	var label = document.createElement('label')
	//	label.htmlFor = Variables[i];
	label.appendChild(document.createTextNode(List[i]));
	VarCheckbox.appendChild( label );

	VarCheckbox.innerHTML += "<br>";



    }

}


// Get a list of currently checked boxes from a checkbox:
function GetSelectedValues( CheckboxName ) {

    var List = new Array();

    // Get the Cuts:
    var Checkbox = document.getElementById( CheckboxName )
    for( var i = 0; i < Checkbox.length; i++) {
	var Entry = Checkbox[i];
	if( Entry.checked ) {
 	    console.log( "Element Loop: " + Entry.value);
	    List.push( Entry.value );
	}
    }

    return List;

}


function ToggleSubtagsOfType( ParentIdName, SubsetType ) {

    // Get the parent div:
    var Parent = document.getElementById( ParentIdName );

    // Loop over children
    var Children = Parent.childNodes;

    for( var i_child = 0; i_child < Children.length; ++i_child ) {
	var child = Children[i_child];
	if( child.type == SubsetType ) {
	    $(child).toggle();
	}
    }

}


function AddInput( Form, Name, Title, Type ) {

    // Add the input name
    var label = document.createElement('label')
    label.appendChild(document.createTextNode(Title));

    var InputName = document.createElement('input');
    InputName.type = Type;
    InputName.name = Name;

    Form.appendChild( label );
    Form.appendChild( InputName );

}


function ColorMap() {

    var ColorMap;
    ColorMap["Black"] = 1;

}


function MakeSelectFromList( Name, OptionList ) {

    // Make a select object with
    // the given Name, where the
    // list of options are the elements
    // of the list


    // Make the Select
    var InputSelector = document.createElement('select');
    InputSelector.type = "text";
    InputSelector.name = Name;
    InputSelector.style.width = "70px";


    for( var i = 0; i < OptionList.length; i++ ) {

	option = OptionList[i];

	var objOption = document.createElement("option");
	objOption.text  = option;
	objOption.value = option;
	InputSelector.add(objOption); 
	
    }

}



function MakeColorSelect() {

    var InputColor = document.createElement('select');
    InputColor.type = "text";
    InputColor.name = "Color";
    InputColor.style.width = "70px";
    var objOption = document.createElement("option");
    objOption.text  = "Black";
    objOption.value = 1;
    InputColor.add(objOption); 
    var objOption = document.createElement("option");
    objOption.text  = "Red";
    objOption.value = 46;
    InputColor.add(objOption); 
    var objOption = document.createElement("option");
    objOption.text  = "Blue";
    objOption.value = 38;
    InputColor.add(objOption);
    var objOption = document.createElement("option");
    objOption.text  = "Green";
    objOption.value = 30;
    InputColor.add(objOption);
    var objOption = document.createElement("option");
    objOption.text  = "Yellow";
    objOption.value = 41;
    InputColor.add(objOption);

    return InputColor;

}

function GetDataFiles() {

    // Get the list of files on the server
    // using a http request:
    
    console.log("Getting Data Files");

    var FileList;
    $.post( "ListDataFiles", {}, function(data){ 
	console.log("Getting Data Files:");
	console.log( data );
	FileList = data; 
    } ); 
    
    // Do it this way to make it syncronous
    $.ajax({
	type: 'POST',
	url: "ListDataFiles",
	data: {},
	success: function(data){ 
	    console.log("Getting Data Files:");
	    console.log( data );
	    FileList = JSON.parse( data );
	},
	async: false
    });

    //$(document).ajaxStop(function() {} );
    //$(this).unbind('ajaxStop');

    console.log("Got Data Files:");
    console.log(FileList);
    console.log(FileList[0]);

    return FileList;

}

function MakeFileSelect() {

    // Make the node
    var InputFile = document.createElement('select');
    InputFile.type = "text";
    InputFile.name = "File";
    InputFile.width = '111px';
    //InputFile.className = "mcInput";

    // Add the options
    console.log("Data Files:")
    console.log(DataFiles)

    for( var i = 0; i < DataFiles.length; i++ ) {
	var objOption = document.createElement("option");
	objOption.text  = DataFiles[i];
	objOption.value = "Data/" + DataFiles[i];
	InputFile.add(objOption); 
    }

    return InputFile;

}


// Cookie Tools:
function getCookie(c_name)
{
    var i,x,y,ARRcookies=document.cookie.split(";");
    for (i=0;i<ARRcookies.length;i++)
    {
	x=ARRcookies[i].substr(0,ARRcookies[i].indexOf("="));
	y=ARRcookies[i].substr(ARRcookies[i].indexOf("=")+1);
	x=x.replace(/^\s+|\s+$/g,"");
	if (x==c_name)
	{
	    return unescape(y);
	}
    }
}

function setCookie(c_name,value,exdays)
{
    var exdate=new Date();
    exdate.setDate(exdate.getDate() + exdays);
    var c_value=escape(value) + ((exdays==null) ? "" : "; expires="+exdate.toUTCString());
    document.cookie=c_name + "=" + c_value;
}

function cacheCookieSamples() {
    var SampleString = JSON.stringify( SampleArray );
    setCookie( "sampleList", SampleString );
    console.log( "Sent Cookie:");
    console.log( SampleString );
}

function cacheCookieLumi() {
    var Lumi = GetCurrentLumi();
    setCookie( "Lumi", Lumi );
}


function checkCookies() {

    console.log("Checking Cookies");

    var sampleListString = getCookie("sampleList");
    var sampleListJSON   = jQuery.parseJSON( sampleListString );

    if (sampleListJSON==null) return;    

    var LumiString = getCookie("Lumi");
    
    var Lumi = 1;
    if (LumiString!=null) Lumi = parseFloat( LumiString );

    BuildFormFromCookie( sampleListJSON, Lumi );


}



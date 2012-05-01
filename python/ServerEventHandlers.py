

#import static
from urlparse import parse_qs
import ast
import os
import json

from PlotTools.MakeMCDataPlot import *
from PlotTools.GetParameters import *
#import PlotTools.MakePlots

def DefaultPost(request_body):

    # What to do with a generic POST request
    # For now, essentially do nothing

    print "Default Post"
    response_body = ''
    print "ResponseBody: " + response_body
    return response_body


def ListDataFiles():
    """ List the files in the data directory """
    print "Listing Data Files"
    htmlReturn = ""
    files = os.listdir("Data")
    print "Found files: ", files
    return json.dumps( files )


def MakePlotsPost(request_body):
    """ Creates a set of plots and puts them in the Plots directory

    """
    print "Make Plots Post"

    try:
        # What to do when the post
        # is for MakePlots:

        dict = parse_qs(request_body)
        
        htmlReturn = "Properly Making Plots: <br> "
        print ""
        for (k,v) in dict.iteritems():
            item = "Form Item - %s : %s" % (k,v) 
            print item
            htmlReturn += item
            print ""
            
        if not "data" in dict:
            return "Error: Did not find 'data'"

        try: 
            PlotListJSON = dict["data"][0]
            print "Got data: " + PlotListJSON.__class__.__name__
            PlotListDict = ast.literal_eval( PlotListJSON )  
        except:
            print "Failed to Unpack 'data' dictionary"
            return "Error Making Plots"
        

            # Loop through the dictionary and make the plots
        
        for PlotOrder in PlotListDict:
            Variable = PlotOrder["Variable"]
            Cut      = PlotOrder["Cut"]
            Channel  = PlotOrder["Channel"]
            Lumi     = PlotOrder["Lumi"]
            Samples  = PlotOrder["SampleList"]
            
                # Separate the sample List
            
            MCSamples = []
            DataSample = Samples[0]
            for Sample in Samples:
                if Sample["Name"] == "Data":
                    DataSample = Sample
                else:
                    MCSamples.append( Sample )
                    #DataSample = Samples["Data"]
                    #MCSamples  = Samples
                    #del MCSamples["Data"]
                    
            MakeMCDataPlot( Variable, Channel, Cut, DataSample, MCSamples, Lumi, "Plots", "" )
    
    except:
        print "Failed to properly make plots"
        return "ERROR MAKING PLOTS"

    #data = dict["data"]

    return htmlReturn


def GetParametersPost(request_body):

    print "Get Parameters Post"

    # Print the input parameters
    try:
        dict = parse_qs(request_body)
        htmlReturn = "Getting info from Files:<br>"
        print ""
        for (k,v) in dict.iteritems():
            item = "Form Item - %s : %s" % (k,v) 
            print item
            htmlReturn += item
            print ""
    except:
        print "Failed to parse Dictionary"


    # Unpack the filelist JSON and turn into object
    try: 
        if not "FileList" in dict:
            return "Error: Did not find 'FileList'"
        FileListJSON = dict["FileList"][0]
        print "Got FileList: " + FileListJSON.__class__.__name__
        FileList = ast.literal_eval( FileListJSON )  
    except:
        print "Failed to Unpack 'FileList' dictionary"
        return "Error Getting Parameters"
    
    
    # Loop through the dictionary and make the plots
    CommonChannelSet  = set()
    CommonVariableSet = set()
    CommonCutSet = set()

    try:
        for file in FileList:

            # For this file, collect the names
            # of all the parameters
            print "Checking Parameters of file: ", file
            
            if not os.path.exists( file ):
                print "File: " + file + "  doesn't exist!!"
                print "Absolute Path: " + os.path.abspath( file )
                print "Current wrkdir: " + os.getcwd()

            for channel in GetChannels( file ):
                CommonChannelSet.add( channel )

            for variable in GetVariables( file ):
                CommonVariableSet.add( variable)

            for cut in GetCuts( file ):
                CommonCutSet.add( cut )

    except (exception):
        print "Failed to get garameters from files", exception


    # Turn the sets of parameters into a JSON object
    try:
        ParamDict = {}
        ParamDict["Channels"]  = list( CommonChannelSet )
        ParamDict["Variables"] = list( CommonVariableSet )
        ParamDict["Cuts"]      = list( CommonCutSet )
        
        import json
        ParamJSON = json.dumps( ParamDict )
        print ParamJSON
    except: 
        print "Failed to convert param dict to JSON object"

    # Success (hopefully)

    print "GetParametersPost() : Success"
    return ParamJSON

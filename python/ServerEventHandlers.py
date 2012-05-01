
import os
import json

from MakeMCDataPlot import MakePlotsPost, MakeMCDataPlot
from GetParameters import *


#from PlotTools.MakeMCDataPlot import MakePlotsPost, MakeMCDataPlot
#from PlotTools.GetParameters import *
#import PlotTools.MakePlots

def DefaultPost(request_body):

    # What to do with a generic POST request
    # For now, essentially do nothing

    print "Default Post"
    response_body = ''
    print "ResponseBody: " + response_body
    return response_body


def MakePostResponse( response_body, start_response ):
    print "MakePostResponse() : Begin"

    print "ResponseBody: " + response_body
    status = '200 OK'
    headers = [('Content-type', 'text/html')]
    try:
        start_response(status, headers)
    except:
        print "Error: Failed to start_response"
    print "MakePostResponse() : Success"
    return [response_body]



def ServePostRequest( environ, start_response ):
    """ Here is where we parse the POST request

    Determine the type of request, and send it to
    the proper function, and make the return

    Recall:
    environ['PATH_INFO'] is the thing requested,
    ie 'php/GetItems.php', etc
    """

    print "Dealing with: POST"

    # Print the entire request

    try:
        RequestType = environ['PATH_INFO']
    except:
        print "Error: ServePostRequest function found no PATH_INFO in request"
        return MakePostResponse("0", start_response)

    # Check that the content of the request exists
    try:
        request_body_size = int(environ['CONTENT_LENGTH'])
        request_body = environ['wsgi.input'].read(request_body_size)
    except (TypeError, ValueError):
        print "Error with CONTENT_LENGTH"
        return MakePostResponse("0", start_response)

    RequestType = environ['PATH_INFO']

    print "Checking POST Type: %s" % RequestType

    # Make Plots
    if( "MakePlots" in RequestType) :
        print "POST Type: Make Plots"
        try:
            response_body = MakePlotsPost(request_body)
            return MakePostResponse( response_body, start_response )
        except:
            print "Failed to Make Plots"
                        
    # Get Parameters
    elif( "GetParameters" in RequestType) :
        print "POST Type: Get Parameters"
        try:
            response_body = GetParametersPost(request_body)
            return MakePostResponse( response_body, start_response )
        except:
            print "Failed to GetParameters"

    # List Files
    elif( "ListDataFiles" in RequestType) :
        print "POST Type: List Files"
        try:
            response_body = ListDataFiles() #ListDataFiles(request_body)
            return MakePostResponse( response_body, start_response )
        except:
            print "Failed to ListDataFiles"

    # If we get here, we found a PATH_INFO but don't have a
    # custom handler for it.  So, we just use the default
    # This is probably an error...
    else:
        print "POST Type: Default"
        response_body = DefaultPost(request_body)
        return MakePostResponse( response_body, start_response )

    
    raise Exception( "POST HANDLER" )



def ListDataFiles():
    """ List the files in the data directory """
    print "Listing Data Files"
    htmlReturn = ""
    files = os.listdir("Data")
    print "Found files: ", files
    return json.dumps( files )



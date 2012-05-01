#!/usr/bin/env python

import os, sys
import threading
import webbrowser
from wsgiref.simple_server import make_server
from urlparse import parse_qs

sys.path.append(os.getcwd())

import python.static 
from python.ServerEventHandlers import DefaultPost, MakePlotsPost, GetParametersPost, ListDataFiles


FILE = 'index.html'
PORT = 8080


def intro_screen():
    """ Create the screen that is run on startup

    """

    
    print "Welcome to RooView"
    print "> Server Now Running"
    
    url = "http://localhost:" + str(PORT)
    
    print "> To run, open the url: " + url

    OpenNewWindow = False
    if( OpenNewWindow ):
        
        try:
            webbrowser.open( url )
        except (TypeError, ValueError):
            print "Exception caught when opening URL %s %s" % (TypeError, ValueError) 

    return
    
def open_browser():
    """ Start a browser after waiting for half a second.

    """
    
    def _open_browser():
        webbrowser.open('http://localhost:%s/%s' % (PORT, FILE))

    thread = threading.Timer(0.5, _open_browser)
    thread.start()

def start_server():
    """ Start the server.

    """

    # Creat an instance of a WSGI Server
    httpd = make_server("", PORT, RunServer)

    # Run that Server
    httpd.serve_forever()



def RunServer(environ, start_response):
    """ Determine who to send the http request to

    """
    
    # If it's a POST, send it to either the
    # default POST function or our custom
    # POST parser
    if environ.get('REQUEST_METHOD') == 'POST':
        if "PATH_INFO" in environ:            
            return ServePostRequest( environ, start_response )
        else:
            response_body = DefaultPost(request_body, start_response)
            return MakePostResponse( response_body, start_response )

    # Else, we assume it's a static file and we
    # send it to cling
    else:
        print "Using Static Cling"
        WrkDir = os.getcwd()
        cling = python.static.Cling( WrkDir )
        return cling.__call__(environ, start_response)


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


if __name__ == "__main__":
    intro_screen()
    #open_browser()
    start_server()

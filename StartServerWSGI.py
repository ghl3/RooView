#!/usr/local/python

import os, sys
import threading
import webbrowser
from wsgiref.simple_server import make_server
from urlparse import parse_qs

sys.path.append(os.getcwd())

import server.static 
from server.ServerEventHandlers import *



FILE = 'index.html'
PORT = 8080


def intro_screen():
    
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


def RunServer(environ, start_response):

    if environ['REQUEST_METHOD'] == 'POST':

        print "Dealing with: POST"

        print ""
        for (k,v) in environ.iteritems():
            print "%s : %s" % (k,v)
        print ""

        try:
            request_body_size = int(environ['CONTENT_LENGTH'])
            request_body = environ['wsgi.input'].read(request_body_size)
            
        except (TypeError, ValueError):
            print "Error with CONTENT_LENGTH"
            request_body = "0"

        try:

            print "Checking POST Type:"

            # Check which handler is asked for:
            if 'PATH_INFO' in environ:
                
                RequestType = environ['PATH_INFO']

                # Make Plots
                if( "MakePlots" in RequestType) :
                    print "POST Type: Make Plots"
                    try:
                        response_body = MakePlotsPost(request_body)
                    except:
                        print "Failed to Make Plots"
                        
                # Get Parameters
                elif( "GetParameters" in RequestType) :
                    print "POST Type: Get Parameters"
                    try:
                        response_body = GetParametersPost(request_body)
                    except:
                        print "Failed to GetParameters"

                # Default
                else:
                    print "POST Type: Default"
                    response_body = DefaultPost(request_body)

            # Default
            else:
                print "POST Type: Default"
                response_body = DefaultPost(request_body)

            # Finish:
            print "ResponseBody: " + response_body


        except:
            print "except: response_body"
            response_body = "Major error"
            
        status = '200 OK'
        headers = [('Content-type', 'text/html')]
        start_response(status, headers)
        return [response_body]

    else:
        print "Using Static Cling"
        
        # Get Current Directory:
        WrkDir = os.getcwd()
        cling = server.static.Cling( WrkDir)
        #cling = static.Cling( '/Users/GHL/Websites/WSGIRooView')
        return cling.__call__(environ, start_response)
        #response_body = open(FILE).read()
        #status = '200 OK'
        #headers = [('Content-type', 'text/html'), ('Content-Length', str(len(response_body)))]
        #start_response(status, headers)
        #return [response_body]
    
def open_browser():
    """Start a browser after waiting for half a second."""
    
    def _open_browser():
        webbrowser.open('http://localhost:%s/%s' % (PORT, FILE))
        thread = threading.Timer(0.5, _open_browser)
        thread.start()

def start_server():
    """Start the server."""
    httpd = make_server("", PORT, RunServer)
    httpd.serve_forever()
    

if __name__ == "__main__":
    intro_screen()
    open_browser()
    start_server()

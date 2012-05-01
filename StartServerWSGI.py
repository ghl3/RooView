#!/usr/bin/env python

import os, sys
import threading
import webbrowser
from wsgiref.simple_server import make_server
from urlparse import parse_qs

sys.path.append(os.getcwd())

import python.static 
from python.ServerEventHandlers import *

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


if __name__ == "__main__":
    intro_screen()
    #open_browser()
    start_server()

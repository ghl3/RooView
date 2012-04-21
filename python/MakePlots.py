#!/usr/bin/python

import ast
import sys, os
#sys.path.append("/usr/local/root_versions/root-5.30.00/lib")
sys.path.append("../../Physics/ttbar/HistPlotTools/python")
import ROOT
from MakeMCDataPlot import *
#from ROOT import TFile, TTree
#from ROOT import TH1
#from ROOT import THStack
#from ROOT import TCanvas       




def main():

    #os.system("env")

    # The JSON string is the argv
    for arg in sys.argv:
        print arg

    # Take the JSON input and turn it
    # into a python dictionary
    JSON_String = sys.argv[1]
    PlotListDict = ast.literal_eval( JSON_String )  

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

    #MakeMCDataPlot("JetN", "Dilepton_EE", "AllCuts", ["ZJets.root", "WJets.root"], "Data.root", 180, "")
    #MakeMCDataPlot("JetN", "Dilepton_EE", "MET", ["ZJets.root", "WJets.root"], "Data.root", 180, "")

    print "All Plots Successfully made"


if __name__ == "__main__":
    main()
        

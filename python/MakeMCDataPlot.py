
#import ROOT
#from ROOT import gROOT, gDirectory, gPad, gSystem, gRandom
from ROOT import TFile, TTree, gROOT
from ROOT import TH1
from ROOT import THStack, TLegend
from ROOT import TCanvas


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

    return htmlReturn



# Make a single plot from MC and data files
def MakeMCDataPlot(VarName, ChannelName, CutName, DataEvents, MCEvents,  Lumi, OutputDir, Options):
    
    # Get the files:
    DataFileName = DataEvents["File"].replace("\\","")
    try:
        DataFile = TFile( DataFileName );
    except:
        print "Error: Failed to open file %s" % DataFileName
        raise IOError

    MCFiles = []
    for Event in MCEvents:
        MCFileName = Event["File"].replace("\\","")
        try:
            MCFile = TFile( MCFileName );
        except:
            print "Error: Failed to open file %s" % MCFileName
            raise IOError
        MCFiles.append( MCFile )

    # Get the histograms:
    HistName = ChannelName + "/" + VarName + "/" + VarName + "_" + ChannelName + "_" + CutName


    print "Getting plot: " + HistName + " from file: " + DataFileName
    try:
        DataHist = DataFile.Get( HistName )
    except:
        print "Failed to get hist %s from file %s" % (HistName, DataFileName)
        raise Exception("MakeMCDataPlot - Failed to get Hist")
    DataHist.SetTitle( DataEvents["Name"] )

    MCHists = []
    for file in MCFiles:
        print "Getting plot: " + HistName + " from file: " + file.GetName()
        try:
            Hist = file.Get( HistName )
        except:
            print "Failed to get hist %s from file %s" % (HistName, file.GetName())
        MCHists.append( Hist )

    Stack = THStack("Stack", "Stack")
    Legend = TLegend(.75, .65, .9, .85)
    Legend.SetFillColor(0)
    Legend.SetBorderSize(0)

    Legend.AddEntry( DataHist, DataEvents["Name"] )

    for i in range(len(MCHists)):
        hist  = MCHists[i]
        Event = MCEvents[i]
        hist.Scale( Lumi )
        hist.SetFillColor( int(Event["Color"]) )
        hist.SetTitle( Event["Name"] )
        Stack.Add(hist)
        Legend.AddEntry( hist, Event["Name"], "F" )

    # Make the canvas
    gROOT.SetBatch(True)
    Canvas = TCanvas("Canvas","")
    Canvas.SetBatch(True)
    Stack.Draw("histgoff")    
    DataHist.Draw("samegoff")
    Legend.Draw("goff")
    #DataHist.Draw()

    NameString = OutputDir + "/" + VarName + "_" + ChannelName + "_" + CutName
    
    Canvas.Print( NameString + ".eps" )
    Canvas.Print( NameString + ".jpg" )

    print "Plot Successfully Made"

    return

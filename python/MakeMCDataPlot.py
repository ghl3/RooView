
#import ROOT
#from ROOT import gROOT, gDirectory, gPad, gSystem, gRandom
from ROOT import TFile, TTree, gROOT
from ROOT import TH1
from ROOT import THStack, TLegend
from ROOT import TCanvas


# Make a single plot from MC and data files
def MakeMCDataPlot(VarName, ChannelName, CutName, DataEvents, MCEvents,  Lumi, OutputDir, Options):
    
    # Get the files:
    DataFileName = DataEvents["File"].replace("\\","")
    DataFile = TFile( DataFileName );

    MCFiles = []
    for Event in MCEvents:
        MCFileName = Event["File"].replace("\\","")
        MCFile = TFile( MCFileName );
        MCFiles.append( MCFile )

    # Get the histograms:
    HistName = ChannelName + "/" + VarName + "/" + VarName + "_" + ChannelName + "_" + CutName


    print "Getting plot: " + HistName + " from file: " + DataFileName
    DataHist = DataFile.Get( HistName )
    DataHist.SetTitle( DataEvents["Name"] )

    MCHists = []
    for file in MCFiles:
        print "Getting plot: " + HistName + " from file: " + file.GetName()
        Hist = file.Get( HistName )
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

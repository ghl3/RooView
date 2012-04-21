#!/usr/bin/env python 


from GetParameters import *

def main():

    print GetChannels("../Data/ttbar.root"), "\n"
    print GetVariables("../Data/ttbar.root"), "\n"
    print GetChannels("../Data/ttbar.root"), "\n"


    #print "Getting Subdirectories: "


    #File = TFile( "../Data/ttbar.root" )
    #ObjList =  GetListOfSubobjects( File, 2, ["TH1"], ["Kinematics"] )

    #for item in ObjList:
    #    print item #"Overall Name: %s   dir: %s" % (item[0], item[1])

if __name__ == "__main__":
    main()


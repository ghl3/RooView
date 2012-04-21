
from ROOT import TFile, TTree, gROOT
from ROOT import TH1
from ROOT import THStack, TLegend
from ROOT import TCanvas
from ROOT import TClass


def ContainsSubstring( String, SubStringList):

    # Return true if any substring in SubStringList
    # appears anywhere in String
    # else false

    for substring in SubStringList:
        if substring in String:
            return True

    return False


def GetDictOfObjects( Directory, Acceptable ):

    # Get a dictionary of name,objet pairs
    # from a particular directory "Directory
    # with class name in "Acceptable"

    dirlist = Directory.GetListOfKeys()
    iter = dirlist.MakeIterator()
    key = iter.Next()
    ObjectMap = {}
    td = None

    while key:
        obj = key.ReadObj()
        objClassName = obj.__class__.__name__
        #print key, objClassName
        if( ContainsSubstring( objClassName, Acceptable) ):
            td = key.ReadObj()
            dirName = td.GetName()
            ObjectMap[dirName] = td
        key = iter.Next()

    return ObjectMap


def GetDictOfSubDirectories( Directory ):
    # Wrapper to return all subdirectories
    # of a given directory
    return GetDictOfObjects( Directory, ["TDirectory"] )



def GetListOfSubobjects( Directory, Level, Acceptable, SkipList ):

    # Get all objects of an "Acceptable" type in subdirectory
    # level "Level" starting with directory "Directory," skipping
    # all directories whose name are in SkipList


    # if Level == 0, return all Acceptable Objects
    if( Level == 0 ):
        ObjDict = GetDictOfObjects( Directory, Acceptable )
        List = []
        for (name, dir) in ObjDict.iteritems():
            List.append( (name,dir) )
        return List


    # Else, pass the request forward to the list of subdirectories
    # (ie use recursion)
    else:
        SubDirDict = GetDictOfSubDirectories( Directory )
        List = []
        for (name,dir) in SubDirDict.iteritems():
            if name in SkipList:
                continue
            SubList = GetListOfSubobjects(dir, Level-1, Acceptable, SkipList)
            for item in SubList:
                List.append(item)


        return List


def GetChannels( FileName ):

    # Get a list with the name 
    # of all subdirectories to a file
    # other than some that are
    # removed by hand

    print "Getting Channels"

    try:
        File = TFile( FileName )
        if not File:
            print "Failed to get file: " + FileName
    except:
        print "Can't open TFile: " + FileName + " Doesn't Exist"

    try:
        DirectoryList = GetDictOfSubDirectories( File ).keys()
    except:
        print "GetChannels(): Failed to get Directory List"
        

    if "Lumi" in DirectoryList: DirectoryList.remove("Lumi")
    if "Kinematics" in DirectoryList: DirectoryList.remove("Kinematics")
    if "CutFlow" in DirectoryList: DirectoryList.remove("CutFlow")

    print DirectoryList

    print "GetChannels(): Done"
    return DirectoryList


def GetVariables( FileName ):

    print "Getting Variables"

    File = TFile( FileName )
    if not File:
        print "Failed to get file: " + FileName

    DirectoryList = GetListOfSubobjects( File, 1, ["TDirectory"], ["Kinematics"] )
    
    VarNames = set()
    for (name, dir) in DirectoryList:
        VarNames.add( name )

    print list(VarNames)
    return list(VarNames)


def GetCuts( FileName ):

    print "Getting Cuts"

    File = TFile( FileName )
    if not File:
        print "Failed to get file: " + FileName

    ObjList =  GetListOfSubobjects( File, 2, ["TH1"], ["Kinematics"] )

    ChanNames = set()
    for (name, dir) in ObjList:
        
        splitNames = name.split("_")
        chanName = splitNames[-1]
        ChanNames.add( chanName )


    print list( ChanNames )
    return list( ChanNames )

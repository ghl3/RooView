

<?php 
   
echo "Decoding JSON<br>";
   
//Decode the serialized JSON
$res = json_decode(stripslashes($_POST['data']), true);

#echo "MakePlot.py" . " " . json_encode($res);
#echo "<br>";

$PATH = "/sw/bin:/sw/sbin:/usr/local/root/bin:/Users/GHL/Library/TeXShop/bin:/usr/local/bin:/usr/local/sbin:/usr/bin:/bin:/usr/sbin:/sbin:/usr/local/bin:/usr/texbin:/usr/X11/bin:/usr/X11R6/bin";



/*
$cmd  = "export PATH=\$ROOTSYS/bin:" . $PATH . ":\$PATH && ";
$cmd .= "export LD_LIBRARY_PATH=\$ROOTSYS/lib:\$LD_LIBRARY_PATH && ";
//$cmd .= "export LD_LIBRARY_PATH=\$ROOTSYS/lib && ";

//$cmd .= "export DYLD_LIBRARY_PATH=\$ROOTSYS/lib && ";

$cmd .= "echo \$PATH && echo ";
$cmd .= "echo \$LD_LIBRARY_PATH && ";
*/
//$cmd = "";

$cmd  = "source /Users/GHL/.bashrc && ";
$cmd .= "export PATH=\$ROOTSYS/bin:" . $PATH . ":\$PATH && ";
$cmd .= "export DYLD_LIBRARY_PATH=\$ROOTSYS/lib && ";
$cmd .= "source /usr/local/root_versions/root-5.30.00/bin/thisroot.sh && ";
//$cmd .= "env && ";
$cmd .= "python MakePlots.py '" . json_encode($res) ."' 2>&1 | tee log.tex";
echo $cmd . "<br>";

/*
$handle = popen($cmd, 'r');
$read = fread($handle, 2096);
echo $read;
pclose($handle);
*/

exec( $cmd, $output, $returnVal );
#$returnVal = system( $cmd, $output );
echo "<br> Python Output: <br>";
foreach( $output as $line ) {
  echo $line . "<br>";
}
echo "<br> Python Return Val: <br>";
echo $returnVal . "<br>";




#$last_line = system($cmd, $retval);
#echo "Last: " . $last_line . "<br>";
#echo "Return: " . $retval . "<br>";

/*
#$cmd = "python MakePlots.py";
$handle = popen($cmd, 'w');
$python_output = fwrite($handle, json_encode($res));
pclose($handle);

    # Now you can make pretty printer about it.
echo $python_output;
*/

#$output = shell_exec(
#echo $output;



/*
  foreach( $res as $item ) {

  // Make the string of samples
  $SampleList = $item["SampleList"];
  $SampleListString = "[";

  $First = true;

  foreach( $SampleList as $sample ) {
    
  if( $First == false ) $SampleListString .= ",";
    
  $String = "[" 
  . $sample["Name"]  . ","
  . $sample["File"]  . ","
  . $sample["Color"] . "]";
    
  $SampleListString .= $String;
    
  if( $First == true ) { $First = false;}
    
  }

  $SampleListString .= "]";

  echo "<br>";

  echo "MakePlot.py " . " " 
  . $item["Variable"] . " " 
  . $item["Cut"] . " " 
  . $SampleListString;

  //  echo json_encode($item);
  //echo $item["Variable"];
  echo "<br>";
  }
*/

/*
  echo $_POST;

  $encoded = json_decode($string, JSON_FORCE_OBJECT);
  $productsArr = $this->json->decode(stripcslashes($PlotRequestsJSON));

  echo $productsArr;
*/
echo "<br>";
echo "End of PHP<br>";

?>

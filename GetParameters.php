


<?php 
   
$res = json_decode(stripslashes($_POST['data']), true);

#echo "MakePlot.py" . " " . json_encode($res);
#echo "<br>";

$PATH = "/sw/bin:/sw/sbin:/usr/local/root/bin:/Users/GHL/Library/TeXShop/bin:/usr/local/bin:/usr/local/sbin:/usr/bin:/bin:/usr/sbin:/sbin:/usr/local/bin:/usr/texbin:/usr/X11/bin:/usr/X11R6/bin";

//$cmd = "";

$cmd  = "source /Users/GHL/.bashrc && ";
$cmd .= "export PATH=\$ROOTSYS/bin:" . $PATH . ":\$PATH && ";
$cmd .= "export DYLD_LIBRARY_PATH=\$ROOTSYS/lib && ";
$cmd .= "source /usr/local/root_versions/root-5.30.00/bin/thisroot.sh && ";
//$cmd .= "env && ";
$cmd .= "python MakePlots.py '" . json_encode($res) ."' 2>&1 | tee log.tex";
echo $cmd . "<br>";


exec( $cmd, $output, $returnVal );
#$returnVal = system( $cmd, $output );
echo "<br> Python Output: <br>";
foreach( $output as $line ) {
  echo $line . "<br>";
}
echo "<br> Python Return Val: <br>";
echo $returnVal . "<br>";

echo "<br>";
echo "End of PHP<br>";

?>


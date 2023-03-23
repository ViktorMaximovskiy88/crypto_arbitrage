<?php
class Turing{
private $m = 'n';
public $o = 'p';
}
$turing1 = (array) new Turing();
echo array_key_exists('m', $turing1) ? 'true' : 'false';
echo '-';
echo array_key_exists('o', $turing1) ? 'true' : 'false';
?>
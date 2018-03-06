<?php
   class MyDB extends SQLite3 {
      function __construct() {
         $this->open('db/test.db');
      }
   };

   function encrypt($input) {
        $shift = random_int(1, 25);
        $max = ord('Z');
        $min = ord('A');
        $result = '';
        foreach(str_split($input) as $c) {
            $a = ord($c);
            if ($a < $min or $a > $max) {
                $c = $c;
            } elseif ($a + $shift <= $max) {
                $c = chr($a + $shift);
            } else {
                $c = chr($a +$min - $max + $shift - 1);
            }
            $result = $result.$c;
        }
        return $result;
    }

   function getRecord() {
        $status = 'ok';
        $db = new MyDB();
        if(!$db) {
            $status = 'error';
        } else {
            $collection = 'film';
            $id = random_int(1, 100);
            $sql = "SELECT * from $collection where id = $id;";
            if (!isset($result)) $result = new stdClass();
            $ret = $db->query($sql);
            $row = $ret->fetchArray(SQLITE3_ASSOC);  
            $quote = strtoupper($row['quote']);
            $result->id = $row['id'];
            $result->quote = $quote;
            $result->quiz = encrypt($quote);
            $result->source = $row['source'];
            $result->year = $row['year'];
        }
        $result->status = $status;
        $db->close();
        return $result;
   }


   // main
   echo json_encode(getRecord());
?>

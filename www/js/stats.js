// the content of the Statistiks (with folding links)
var html = "<!DOCTYPE html><html><head><meta charset='utf-8'><title></title></head><body>";

var introduction = "<br><p style='font-size:25px;'>Hier können sie Ihre Erfolge/Misserfolge einsehen:</p><br><br>";

var wonLevel = "<p style='font-size:23px;'>gewonnene Level:</p><br>";
var losedLevel = "<p style='font-size:23px;'>verlorene Level:</p><br>";
var gametime = "<p style='font-size:23px;'>gesamte Spielzeit:</p><br>";
var bestLevel = "<p style='font-size:23px;'>bestes Level:</p><br>";
var openLevel = "<p style='font-size:23px;'>freigespielte Level:</p><br>";

var credits = "<div style='position: fixed; left: 10px; bottom: 0px; width: 100%'><p style='font-size:10px;'>Diese App wurde in Folge eines Schulprojekts 2016/17 von Niklas Spanring und Lisa Lackner programmiert und gestaltet.</p></div><br>";
var ende = "</body></html>";

var name = "<span id='levelDetailName' style='font-size:20px;'></span><p />"
            
            //<span id="levelDetailTime" style='font-size:20px;'></span><p />
            //<span id="levelDetailDesc" style='font-size:20px;'></span><p />
            //<span id="levelDetailStats" style='font-size:20px;'></span>
// Statistiks is put togehter
var text = html + introduction + name + wonLevel + losedLevel + gametime + bestLevel + openLevel + credits + ende;

// Statistiks ist transmitted
$('#stats').html(text);

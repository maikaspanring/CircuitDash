// the content of the helptext (with folding links)
var html = "<!DOCTYPE html><html><head><meta charset='utf-8'><title></title></head><body>";
//var allgemein = "<br><br><p style='font-size:20px;'>Bitte öffnen Sie für die Erklärungen die jeweiligen Unterpunkte durch antippen. Zum Schließen, diesen Vorgang wiederholen.</p><br>"
var logikgatter_text = "<p style='font-size:20px;'>There are 3 Logic Blocks:</p>";
var and_button = "<p><span class='lsvg helpgatter' svgsrc='svg/elements/and.svg'></span></p></a>";
var xor_button = "<p><span class='lsvg helpgatter' svgsrc='svg/elements/xor.svg'></span></p></a>";
var or_button = "<p><span class='lsvg helpgatter' svgsrc='svg/elements/or.svg'></span></p></a>";
var allgemein_button = "<p><span class='lsvg helpgatter' svgsrc='svg/elements/allgemein.svg'></span></p></a>";

// Texts for the help for the user
var and_text = "<p id='and' style='display: none; font-size:20px;'>All inputs must switched on!</p>";
var xor_text = "<p id='xor' style='display: none; font-size:20px;'>Only one input is allowed to be on!</p>";
var or_text = "<p id='or' style='display: none; font-size:20px;'>At least one input has to be on!</p>";
var allgemein_text = "<p id='allgemein' style='display: none; font-size:20px;'><b>The Goal</b>: The Power (blue) must float from the bottom to the top. But only in the green fields, before time is over.<br>Every Logic Block must be placed to win the game!<br><br>If you hit a red field or moved a Logic Block back to the stack the Time is running faster!<br>";


var not ="<p><span class='lsvg helpgatter' svgsrc='svg/elements/not.svg'></span></p></a> 	<p id='not' style='display: none' style='font-size:25px;'>Bei der NOT-Verknüpfung wird die Ausgabe des Stroms einfach umgekehrt. Fleißt Strom in dieses Element wird dieser nicht durchgelassen, kommt jedoch keiner an dieses Element heran, wird Strom weitergegeben.</p>";
var ende = "</body></html>";
var link = "<a href=";
var jsAnd = "javascript:toggle('and')>";
var jsOr = "javascript:toggle('or')>";
var jsXor = "javascript:toggle('xor')>";
var jsNot = "javascript:toggle('not')>";
var jsAllgemein = "javascript:toggle('allgemein')>";
var button = '<span class="lsvg Btn back" do="settings" from="gameDiv" svgsrc="svg/backMini.svg"></span>';

// helptext is put togehter
var text = html + link + jsAllgemein + allgemein_button + allgemein_text + logikgatter_text + link + jsAnd + and_button + and_text + link + jsOr + or_button + or_text +
link + jsXor + xor_button + xor_text + ende + button;

// helptext ist transmitted
$('#helptext').html(text);

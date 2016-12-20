// the content of the helptext (with folding links)
var html = "<!DOCTYPE html><html><head><meta charset='utf-8'><title></title></head><body>";
var and = "<p style='font-size:20px;'><strong>AND</strong></p></a><p id='and' style='display: none' style='font-size:20px;'>Bei der AND-Verknüpfung muss bei allen eingehenden Kabel Strom fließen, ansonsten wird der Durchfluss blockiert.</p>";
var or ="<p style='font-size:20px;'><strong>OR</strong></p></a><p id='or' style='display: none' style='font-size:20px;'>Bei der OR-Verknüpfung benötigt man nur 1 Kabel durch welches Strom fließt, um den Strom druchzulassen.</p>";
var xor ="<p style='font-size:20px;'><strong>XOR</strong></p></a><p id='xor' style='display: none' style='font-size:20px;'>Bei der XOR-Verknüpfung darf nur 1 Kabel mit Strom gespeist sein. Werden durch beide Kabel Strom auf dieses Element geleitet, wird dieser blockiert.</p>";
var not ="<p style='font-size:20px;'><strong>NOT</strong></p></a><p id='not' style='display: none' style='font-size:20px;'>Bei der NOT-Verknüpfung wird die Ausgabe des Stroms einfach umgekehrt. Fleißt Strom in dieses Element wird dieser nicht durchgelassen, kommt jedoch keiner an dieses Element heran, wird Strom weitergegeben.</p>";
var ende = "</body></html>";
var link = "<a href=";
var jsAnd = "javascript:toggle('and')>";
var jsOr = "javascript:toggle('or')>";
var jsXor = "javascript:toggle('xor')>";
var jsNot = "javascript:toggle('not')>";
var button = "<span class='lsvg Btn' do='mainmenu' svgsrc='svg/backBtn.svg'></span>"

// helptext is put togehter
var text = html + link + jsAnd + and + link + jsOr + or + link + jsXor + xor + link + jsNot + not + ende + button; 

// helptext ist transmitted
$('#helptext').html(text);




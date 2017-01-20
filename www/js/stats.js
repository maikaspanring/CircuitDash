function statsText() {

// the content of the Statistiks (with folding links)
var html = "<!DOCTYPE html><html><head><meta charset='utf-8'><title></title></head><body>";

var introduction = "<br><p style='font-size:25px;'>Hier können sie Ihre Erfolge/Misserfolge einsehen:</p><br><br>";
if (localStorage['winN'] == undefined) {
	localStorage['winN'] = 0;
}
if (localStorage['lostN'] == undefined) {
	localStorage['lostN'] = 0;
}
if (localStorage['allTimeN'] == undefined) {
	localStorage['allTimeN'] = 0;
	min10 = 0;
	min1 = 0;
	sec10 = 0;
	sec1 = 0;
} else {
	min10 = Math.floor(localStorage['allTimeN'] / 60 / 10);
    min1 = Math.floor(localStorage['allTimeN']/ 60 % 10);
    sec10 = Math.floor((localStorage['allTimeN'] - ((min10 * 10 + min1) * 60)) / 10);
    sec1 = Math.floor((localStorage['allTimeN'] - ((min10 * 10 + min1) * 60)) % 10);
}
if(localStorage['nextLevel'] == undefined) nextLevel = 0;
var bestLevelPrc = 0;
var bestLevelId = 0;
for (var i = 1; i <= localStorage['nextLevel']; i++) {
	if(localStorage[i+'bestTimePrc'] > bestLevelPrc){
		bestLevelPrc = localStorage[i+'bestTimePrc'];
		bestLevelId = i;
	}
}

var wonLevel = "<p style='font-size:23px;'>gewonnene Level: "+ localStorage['winN']+"</p><br>";
var losedLevel = "<p style='font-size:23px;'>verlorene Level: "+ localStorage['lostN']+"</p><br>";
var gametime = "<p style='font-size:23px;'>gesamte Spielzeit: "+ min10 + "" + min1 + ":" + sec10 + "" + sec1 +"</p><br>";
var bestLevel = "<p style='font-size:23px;'>bestes Spiel: Level "+bestLevelId+" ("+(Math.round(bestLevelPrc * 100) / 100)+"%)</p><br>";
var openLevel = "<p style='font-size:23px;'>freigespielte Level: "+(parseInt(localStorage['nextLevel']) + 1)+"</p><br>";

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
}

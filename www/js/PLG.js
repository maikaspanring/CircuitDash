//procedural Level Generation
class PLG {

  constructor(id) {
    this.levelid = id;
    this.makeLevel();
  }

  makeLevel(){
    this.makeStartpoints();
    this.makeElements();
    this.makeEndpoints();
    this.testConections();
    this.generateLevelJson(this.levelid);
  }

  makeStartpoints(){
    this.startpoints = [];
    this.startpointsAnz = Math.floor((Math.random() * 4) + 2);
    // to make sure ther is a enpoint with the need 1
    var on = 0;
    for (var i = 0; i < this.startpointsAnz; i++) {
      this.startpoints[i] = [];
      this.startpoints[i]['id'] = 'sp'+i
      // reduce the chance of the on state from 50/50 to 75/25
      if(Math.round(Math.random()) == 1){
        this.startpoints[i]['on'] =  Math.round(Math.random());
      } else {
        this.startpoints[i]['on'] =  0;
      }
      if(this.startpoints[i]['on'] == 1){
        on = 1;
      }
    }
    // repeat if ther is no endpoint with a need of 1
    if(on == 0){
      console.log('No Startpoint with the state "on" found [start new generation]');
      this.makeStartpoints();
    }
  }

  makeElements(){
    this.elements = [];
    this.elementsEbenenAnz = Math.floor((Math.random() * 2) + 2);
    // random 2 - 3 ebenen
    for (var i = this.elementsEbenenAnz; i >= 1; i--) {
      this.elements[i] = [];
      // random 2 - 3 elements for each ebene
      if(i == this.elementsEbenenAnz) this.elementsAnz = Math.floor((Math.random() * 3) + 1);
      else this.elementsAnz = Math.floor((Math.random() * 3) + 1);
      for (var e = 1; e <= this.elementsAnz; e++) {
        this.elements[i][e] = [];
        this.elements[i][e]['id'] = 'ebene'+i+'obj'+e;
        this.elements[i][e]['ebene'] = i;
        switch (Math.floor((Math.random() * 3) + 1)) {
          case 1:
            this.elements[i][e]['obj'] = 'or';
          break;
          case 2:
            this.elements[i][e]['obj'] = 'xor';
          break;
          case 3:
            this.elements[i][e]['obj'] = 'and';
          break;
        }
        // all elements beneth the last stage have a next elements
        if(i == 1){
          //bind endpoints
          this.elements[i][e]['next'] = [];
          this.elements[i][e]['next'][0] = 'p'+(e - 1);
        }
        else if(i == this.elementsEbenenAnz)
        {
          // bind startpoints
          if(this.startpoints[(e)] !== undefined){
            if(this.startpoints[(e)]['next'] == undefined) this.startpoints[(e)]['next'] = [];
            this.startpoints[(e)]['next'][this.startpoints[(e)]['next'].length] = this.elements[i][e]['id'];
          }
          if(this.startpoints[(e + 1)] !== undefined){
            if(this.startpoints[(e + 1)]['next'] == undefined) this.startpoints[(e + 1)]['next'] = [];
            this.startpoints[(e + 1)]['next'][this.startpoints[(e + 1)]['next'].length] = this.elements[i][e]['id'];
          }
          if(this.startpoints[(e - 1)] !== undefined){
            if(this.startpoints[(e - 1)]['next'] == undefined) this.startpoints[(e - 1)]['next'] = [];
            this.startpoints[(e - 1)]['next'][this.startpoints[(e - 1)]['next'].length] = this.elements[i][e]['id'];
          }
        }
        // ende for elements
      }
      // ende for ebene
    }
    for (var i = 1; i < this.elements.length; i++) {
      for (var e = 1; e < this.elements[i].length; e++) {

        if(i != this.elementsEbenenAnz && i != 1){
          this.elements[i][e]['next'] = [];
          var nextelements = Math.floor((Math.random() * 2) + 2);
          if(this.elements[(i - 1)][3] == undefined && nextelements == 3) nextelements = 2;
          switch (nextelements) {
            case 2:
              this.elements[i][e]['next'][0] = this.elements[(i - 1)][1]['id'];
              if(this.elements[(i - 1)][2] !== undefined)
              this.elements[i][e]['next'][1] = this.elements[(i - 1)][2]['id'];
            break;
            case 3:
              this.elements[i][e]['next'][0] = this.elements[(i - 1)][2]['id'];
              if(this.elements[(i - 1)][3] !== undefined)
              this.elements[i][e]['next'][1] = this.elements[(i - 1)][3]['id'];
            break;
          }
        }
        else if(i == this.elementsEbenenAnz){
          this.elements[i][e]['next'] = [];
          var nextelements = Math.floor((Math.random() * 2) + 2);
          if(this.elements[(i - 1)][3] == undefined && nextelements == 3) nextelements = 2;
          switch (nextelements) {
            case 2:
              this.elements[i][e]['next'][0] = this.elements[(i - 1)][1]['id'];
              if(this.elements[(i - 1)][2] !== undefined)
              this.elements[i][e]['next'][1] = this.elements[(i - 1)][2]['id'];
            break;
            case 3:
              this.elements[i][e]['next'][0] = this.elements[(i - 1)][2]['id'];
              if(this.elements[(i - 1)][3] !== undefined)
              this.elements[i][e]['next'][1] = this.elements[(i - 1)][3]['id'];
            break;
          }
          if(this.elements[(i - 1)].length < this.elements[i].length){
            if(this.elements[(i - 2)] !== undefined){
              if(this.elements[(i - 2)][e] !== undefined){ // this.elements[(i - 2)].length == this.elements[i].length &&
                if(this.elements[i][e]['next'][0] == undefined){
                  this.elements[i][e]['next'][0] = this.elements[(i - 2)][e]['id'];
                } else if(this.elements[i][e]['next'][1]  == undefined) {
                  this.elements[i][e]['next'][1] = this.elements[(i - 2)][e]['id'];
                }
              }
            }
          }
        }
        // ende for elements
      }
      // ende for ebene
    }

    for (var i = 0; i < this.startpoints.length; i++) {
      if(this.startpoints[i]['next'] == undefined){
        this.makeLevel();
        break;
      }
    }
  }

  makeEndpoints(){
    this.endpoints = [];
    for (var ep = 0; ep < (this.elements[1].length - 1); ep++) {
      this.endpoints[ep] = [];
      this.endpoints[ep]['id'] = 'p'+ep;
    }

  }

  testConections(){
    var hasConection = [];
    for (var i = 1; i < this.elements.length; i++) {
      hasConection[i] = [];
      for (var e = 1; e < this.elements[i].length; e++) {
        for (var n = 0; n < this.elements[i][e]['next'].length; n++) {
          if(i != 1){
            for (var ei = 1; ei < this.elements[(i - 1)].length; ei++) {
              if(this.elements[i][e]['next'][n] == this.elements[(i - 1)][ei]['id']){
                hasConection[(i - 1)][ei] = 1;
                console.log("Found Conection:",this.elements[i][e]['id'], this.elements[(i - 1)][ei]['id']);
              }
            }
          }
        }
      }
    }

    for (var i = 0; i < this.startpoints.length; i++) {
      for (var ni = 0; ni < this.startpoints[i]['next'].length; ni++) {
        for (var ei = 1; ei < this.elements[(this.elements.length - 1)].length; ei++) {
          if(this.elements[(this.elements.length - 1)][ei]['id'] == this.startpoints[i]['next'][ni]){
            hasConection[(this.elements.length - 1)][ei] = 1;
            console.log("Found Conection:",this.startpoints[i]['id'], this.elements[(this.elements.length - 1)][ei]['id']);
          }
        }
      }
    }

    for (var i = 1; i < this.elements.length; i++) {
      for (var e = 1; e < this.elements[i].length; e++) {
        if(hasConection[i] != undefined){
          if(hasConection[i][e] == undefined || hasConection[i][e] != 1){
            console.log('There is no connection:', i, e);
            this.makeLevel();
            break;
          }
        }
      }
    }
  }

  generateLevelJson(id){
    this.json_string = ''+
    '{'+
      '"ID":'+id+','+
      '"name":"PLG_'+id+'",'+
      '"time":3600,'+
      '"endpoints":[';
        for (var p = 0; p < this.endpoints.length; p++) {
          if(p != (this.endpoints.length - 1) ) var endjson = '},';
          else var endjson = '}';
          this.json_string+= '{' +
          '"id":"'+this.endpoints[p]['id']+'",'+
          '"need":0';
          this.json_string+= endjson;
        }
      this.json_string+= '],'+
      '"startpoints":[';
        for (var si = 0; si < this.startpoints.length; si++) {
          if(si != (this.startpoints.length - 1) ) var endjson = '},';
          else var endjson = '}';
          this.json_string+= '{' +
          '"id":"'+this.startpoints[si]['id']+'",'+
          '"on":'+this.startpoints[si]['on']+','+
          '"next":[';
            for (var nsi = 0; nsi < this.startpoints[si]['next'].length; nsi++) {
              if(nsi != (this.startpoints[si]['next'].length - 1)){
                this.json_string+= '{"id":"'+this.startpoints[si]['next'][nsi]+'"},';
              }else{
                this.json_string+= '{"id":"'+this.startpoints[si]['next'][nsi]+'"}';
              }
            }
          this.json_string+= ']';
          /*
          {
            "id":"sp1",
            "on":1,
            "next":[{"id":"block1"}]
          },
          */
          this.json_string+= endjson;
        }
      this.json_string+= '],'+
      '"elements":[';
        for (var i = 1; i <= (this.elements.length - 1); i++) {
          for (var e = 1; e <= (this.elements[i].length - 1); e++) {
            console.log(e, this.elements[i].length - 1, i , this.elements.length - 1);
            if(i != (this.elements.length - 1) || e != (this.elements[i].length - 1)) var endjson = '},';
            else var endjson = '}';
              this.json_string+= '{' +
                '"type":"drop",' +
                '"id":"'+this.elements[i][e]['id']+'",' +
                '"obj":"'+this.elements[i][e]['obj']+'",' +
                '"ebene":'+this.elements[i][e]['ebene']+',' +
                '"next":[';
                for (var ni = 0; ni < this.elements[i][e]['next'].length; ni++) {
                  if(ni != (this.elements[i][e]['next'].length - 1)){
                    this.json_string+= '{"id":"'+this.elements[i][e]['next'][ni]+'"},';
                  }else{
                    this.json_string+= '{"id":"'+this.elements[i][e]['next'][ni]+'"}';
                  }
                }
              this.json_string+= ']';
            this.json_string+= endjson;
          }
        }
    this.json_string+= ']'+
    '}';
    var new_obj = JSON.parse(this.json_string);
    this.json = new_obj;
  }

  res() {
    console.log(this.startpoints);
    console.log(this.elements);
    console.log(this.endpoints);
    console.log(JSON.stringify(this.json, null, 2));
    console.log(this.json);
    return this;
  }
}

(function($) {

  /**
   * The prototype for the ganttchart object
   * initializations, helper functions
   * and the function that does the acual drawing on the canvas
   */
  var GanttChart = function() {

    this.xmax = 48;
    this.liRand = 400;
    this.obRand = 20;
    this.h = 20;
    this.l = 20;
    
    this.initGrid = function(maschinen, services) {
      this.resLength = maschinen.length;
      this.vorschLength = services.length;
      this.resRand = this.obRand + this.resLength * this.h;
      this.vorschRand = this.resRand + this.vorschLength * this.h;
    };

    this.initTime = function(start) {
      Date.prototype.addHours = function(h){
        this.setHours(this.getHours() + h);
        return this;
      };
      var zeit = start;
      this.startString = zeit.getDate() + "." + (zeit.getMonth() + 1) + "." + (zeit.getYear() + 1900);
      this.tage=new Array(this.xmax);
      this.stunden=new Array(this.xmax);
      for (var i = 0; i < this.xmax; i++){
        this.tage[i] = zeit.getDate();
        this.stunden[i] = zeit.getHours();
        zeit.addHours(1);
      }
    };

    this.draw = function(ctx, maschinen, services, vorgaenge) {
      var xmax = this.xmax;
      var l = this.l;
      var h = this.h;
      var liRand = this.liRand;
      var obRand = this.obRand;
      var resLength = this.resLength;
      var vorschLength = this.vorschLength;
      var resRand = this.resRand;
      var vorschRand = this.vorschRand;
      var stunden = this.stunden;
      ctx.font = "200 9pt Lucida";
      ctx.strokeText(this.startString, 4, h - 4);
      for (var i = 0; i < stunden.length; i++)
        ctx.strokeText(stunden[i], liRand + i * l + 3, h - 4);   
      ctx.beginPath();  
      ctx.strokeStyle="#d0d0d0";
      for (var i=0;i < xmax; i++){
        ctx.moveTo(liRand + l * i, 0);
        ctx.lineTo(liRand + l * i, vorschRand);   	
      }
      ctx.stroke();
      ctx.beginPath();  
      ctx.strokeStyle="#000000";
      for (i = 1; i < resLength + vorschLength; i++){
        ctx.moveTo(0, obRand + h * i);
        ctx.lineTo(liRand + l * xmax, obRand + h * i);
      }
      ctx.stroke();
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(0, obRand);
      ctx.lineTo(liRand + l * xmax, obRand);
      ctx.moveTo(0, resRand);
      ctx.lineTo(liRand + l * xmax, resRand);
      ctx.moveTo(0, vorschRand);
      ctx.lineTo(liRand + l * xmax, vorschRand);
      ctx.moveTo(liRand, 0);
      ctx.lineTo(liRand, vorschRand);
      ctx.moveTo(liRand + l * xmax, 0);
      ctx.lineTo(liRand + l * xmax, vorschRand);
      ctx.stroke();
      ctx.lineWidth = 0.5;
      for (var i = 0; i < services.length; i++) {
        ctx.strokeText(services[i].name, 4, resRand + (i + 1) * h - 4);
        this.zeichneBalken(ctx, 0, i + maschinen.length, services[i].rate/10, "#ff0000");
      }
      for (var i = 0; i < maschinen.length; i++) {
        ctx.strokeText(maschinen[i], 4, obRand + (i + 1) * h - 4);
      }
      for (var i = 0; i < vorgaenge.length; i++) {
        if (vorgaenge[i].x < 0)
          continue;
        if (vorgaenge[i].x + vorgaenge[i].l > this.xmax)
          continue;
        this.zeichneBalken(ctx, vorgaenge[i].x, vorgaenge[i].y, vorgaenge[i].l ,"#0000ff");
      }
    };

    this.zeichneBalken = function(ctx, x, y, l,farbe){
      var lox = this.liRand+x * this.l;
      var loy = this.obRand+y * this.h + 1;
      var laenge = this.l * l;
      var breite = this.h - 2;
      ctx.fillStyle = farbe;
      ctx.fillRect (lox, loy, laenge, breite);
    };
  };


  /**
   * the document.ready function
   * pulls the data from the controller via ajax
   * intializes the ganttchart object
   * and draws it on the canvas
   */
  $(document).ready(function() {

    var updateAjaxTafel = function(data) {
      var start = new Date();
      start.setTime(data.start * 1000);
      var canvas = $('#tafel').get(0);  
      if (canvas.getContext){  
        var ctx = canvas.getContext('2d');
        var gC = new GanttChart();
        gC.initGrid(data.maschinen, data.services);
        gC.initTime(start);
        gC.draw(ctx, data.maschinen, data.services, data.vorgaenge);
      }
    };

    var tafelError = function(jqXHR, textStatus, errorThrown) {
      alert('Fehler');
    };

    var fosurl = Routing.generate('DimeGanttChartBundle_ajaxcall');
    $.ajax({
      type: 'GET',
      url: fosurl,
      success: updateAjaxTafel,
      error: tafelError,
      dataType: 'json'
    });
  });
}(jQuery));

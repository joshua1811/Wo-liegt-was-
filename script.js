
  // Variablen
  let round, status, X, Y, markedLat, markedLon, solX, solY, canvas, rect,
   ctx, img, text, text2, text3, btn,  fragen, latArr, lonArr, frage;
  
  // Belegungen
  round = -1;
  status = "start";
  X = 0;
  Y = 0;
  markedLat = 0;
  markedLon = 0;
  solX = 0;
  solY = 0;
  
  // HTML Elemente
  canvas = document.getElementById("myCanvas");
  ctx = canvas.getContext('2d'); 
  rect = canvas.getBoundingClientRect(); 
  // text = document.getElementById("A");
  // text2 = document.getElementById("B");
  text3 = document.getElementById("C");
  btn = document.getElementById("btn");
  frage = document.getElementById("frage");
  
  // Bild 
  img = new Image();
  img.src = "https://upload.wikimedia.org/wikipedia/commons/c/cb/Tissot_indicatrix_world_map_Lambert_cyl_equal-area_proj.svg";
  
  
  // Fragen
  fragen = ["Wo ist New York?","Wo ist LA?","Wo ist Sydney?"];
  latArr = [-74.0058, -118.4068,151.2094];
  lonArr = [40.7128,34.1139,-33.8650];
  
  
  // Main function for button
  function mainFun()  {
    if(status === "start") {
        round++;
        changeStatus("playing","einloggen");
          frage.innerHTML = fragen[round];
      }
      else if(status === "playing") {
        changeStatus("eingeloggt","Auflösung");
      }
      else if(status === "eingeloggt") {
        changeStatus("Lösung","Nächste Frage");
      showSol();
          showDistance();
      }
      else if(status === "Lösung") {
        if(round == fragen.length-1) {
            frage.innerHTML = "Ende";
          }
          else{
              round++;
          changeStatus("playing","einloggen");
            cleanMap();
            frage.innerHTML = fragen[round];
          }
      }
  }
  
  
  // Status Änderung 
  function changeStatus(newStatus, btnName) {
    status = newStatus;
      btn.innerHTML = btnName;
  }
  
  
  // Auflösung
  function showSol()  {
    solX = LatToX(latArr[round]);
      solY = LonToY(lonArr[round]);
      markedLat = XtoLat(X/3000);
      markedLon = YtoLon(Y/953);
      // text.innerHTML = markedLat;
      //text2.innerHTML = markedLon;
      drawCircle(solX*3000,solY*953,"green",5);
  }
  
  
  
  
  // load Map
  function loadMap()   {
              ctx.drawImage(img, 0, 0);
  }
  
    
  
  // clean Map
  function cleanMap()   {
              ctx.clearRect(0,0,3000,953)
              ctx.drawImage(img, 0, 0);
  }
  
  
  // click auf Map
  function display(event) {
        if(status === "playing") {
                cleanMap()
               X = event.clientX - rect.left + window.pageXOffset;
               Y = event.clientY - rect.top + window.pageYOffset;
                drawCircle(X,Y,"red",1.5)
              }
              else { return;}
  }
  
  
  // draw circle 
  function drawCircle(x,y,colour, size)  {
      ctx.fillStyle = colour;
      var canvas3 = document.getElementById("myCanvas");
      var rect3 = canvas3.getBoundingClientRect();
    ctx.beginPath();
      ctx.arc(x,y, size, 0, 2 * Math.PI, true);
      ctx.fill();
  }
  
  //show Distance
  function showDistance()  {
    distance = calcCrow(latArr[round], lonArr[round], markedLat, markedLon)
      text3.innerHTML = distance;
  }
  
  
  /////////////////// Mathematisches /////////////////////
    
  
  // degree to Rad
  function degreeToRad(degree)  {
    return(degree * Math.PI/180)
  }
  
  function RadToDegree(rad)   {
    return(rad*180/Math.PI)
  }
  
  
  
  // coordinates to 2d position
  function LatToX(lat) {
      let x = (lat + 180)/360
    return(x)
  }
  
  function LonToY(lon) {
    let y = 1 - (Math.sin(degreeToRad(lon))+1)/2
    return(y)
  }
  
  
  //2d position to coordinates
  function XtoLat(x) {
    return x*360 - 180;
  }
      
  function YtoLon(y) {
    return RadToDegree(Math.asin(2*(0.5-y)));
  }
  
  
  // Haversine Formula
  function calcCrow(lat1, lon1, lat2, lon2) {
        var R = 6371; // km
        var dLat = degreeToRad(lat2-lat1);
        var dLon = degreeToRad(lon2-lon1);
        var lat1 = degreeToRad(lat1);
        var lat2 = degreeToRad(lat2);
  
        var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
          Math.sin(dLon/2) * Math.sin(dLon/2) * Math.cos(lat1) * Math.cos(lat2); 
        var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-	a)); 
        var d = R * c;
        return d;
  }
  
  
  
  
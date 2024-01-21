// Variablen
let round,
  status,
  X,
  Y,
  markedLat,
  markedLon,
  solX,
  solY,
  distance,
  totaldistance,
  canvas,
  rect,
  ctx,
  img,
  text,
  text2,
  text3,
  text4,
  btn,
  fragen,
  latArr,
  lonArr,
  frage;

// Belegungen
round = -1;
status = "start";
X = 0;
Y = 0;
markedLat = 0;
markedLon = 0;
solX = 0;
solY = 0;
distance = 0;
totaldistance = 0;

// HTML Elemente
canvas = document.getElementById("myCanvas");
ctx = canvas.getContext("2d");
rect = canvas.getBoundingClientRect();
// text = document.getElementById("A");
// text2 = document.getElementById("B");
text3 = document.getElementById("C");
text4 = document.getElementById("gesamtDistanz");

btn = document.getElementById("btn");
frage = document.getElementById("frage");

runde = document.getElementById("runde");

// Bild
img = new Image();
img.src =
  "https://upload.wikimedia.org/wikipedia/commons/c/cb/Tissot_indicatrix_world_map_Lambert_cyl_equal-area_proj.svg";

// Fragen
fragen = [
  "Wo findet das 100 Meter Finale von Olympia 2024 statt?",
  "Wo liegt das Wrack der Titanic?",
  "Wo liegt der höchste Berg in der EU?",
  "Wo liegt die größte Stadt der Welt?",
  "Wo liegt die Hauptstadt von Russland?",

  "Wo wurde Barack Obama geboren?",
  "Wo ist Jesus gestorben?",
  "Wo liegt der größte Flughafen der Welt? (Passagierzahl 2023)",
  "Wo steht das höchste Gebäude der Welt?",
  "Wo hängt die Mona Lisa?",

  "Wo findet das Finale der Fußball EM 2024 statt?",
  "Wo sind die Niagara Fälle?",
  "Wo ist Stonehenge?",
  "Wo liegt der Marianengraben?",
  "Wo ist der Firmensitz von Google?",
];

lonArr = [
  48.9248698, 41.724634476958805, 45.83265123886741, 35.67863050857084,
  55.751669585867795,

  21.29972284827581, 31.764321446687223, 33.636167438369625, 25.19713311042957,
  48.86059695447548,

  52.51469775941744, 43.083762058029386, 51.193358676871114, 11.29110689549472,
  37.42190232828683,
];

latArr = [
  2.36036437, -49.946159019797236, 6.865174848360892, 139.76757434642488,
  37.61923064705677,

  -157.83367367671696, 35.212690828413486, -84.42938713273456,
  55.274297825961284, 2.3376225392375276,

  13.239516997137377, -79.07350627215975, -1.828239481918874,
  142.22180932842917, -122.08530310507543,
];

// Main function for button
function mainFun() {
  if (status === "start") {
    showNextRound();
    changeStatus("playing", "einloggen");
    frage.innerHTML = fragen[round];
  } else if (status === "playing") {
    changeStatus("eingeloggt", "Auflösung");
  } else if (status === "eingeloggt") {
    changeStatus("Lösung", "Nächste Frage");
    showSol();
    showDistance();
  } else if (status === "Lösung") {
    if (round == fragen.length - 1) {
      frage.innerHTML = "Ende";
    } else {
      showNextRound();
      changeStatus("playing", "einloggen");
      cleanMap();
      frage.innerHTML = fragen[round];
    }
  }
}

//Nächste Runde
function showNextRound() {
  round++;
  runde.innerHTML = "Runde: " + (round + 1);
}

// Status Änderung
function changeStatus(newStatus, btnName) {
  status = newStatus;
  btn.innerHTML = btnName;
}

// Auflösung
function showSol() {
  solX = LatToX(latArr[round]);
  solY = LonToY(lonArr[round]);
  markedLat = XtoLat(X / 3000);
  markedLon = YtoLon(Y / 953);
  // text.innerHTML = markedLat;
  //text2.innerHTML = markedLon;
  drawCircle(solX * 3000, solY * 953, "green", 3);
}

// load Map
function loadMap() {
  ctx.drawImage(img, 0, 0);
}

// clean Map
function cleanMap() {
  ctx.clearRect(0, 0, 3000, 953);
  ctx.drawImage(img, 0, 0);
}

// click auf Map
function display(event) {
  if (status === "playing") {
    cleanMap();
    X = event.clientX - rect.left + window.pageXOffset;
    Y = event.clientY - rect.top + window.pageYOffset;
    drawCircle(X, Y, "red", 1.5);
  } else {
    return;
  }
}

// draw circle
function drawCircle(x, y, colour, size) {
  ctx.fillStyle = colour;
  var canvas3 = document.getElementById("myCanvas");
  var rect3 = canvas3.getBoundingClientRect();
  ctx.beginPath();
  ctx.arc(x, y, size, 0, 2 * Math.PI, true);
  ctx.fill();
}

//show Distance
function showDistance() {
  distance = calcCrow(latArr[round], lonArr[round], markedLat, markedLon);
  totaldistance = totaldistance + distance;
  text3.innerHTML = "Distanz: " + Math.round(distance) + " km";
  text4.innerHTML = "Gesamte Distanz: " + Math.round(totaldistance) + " km";
}

/////////////////// Mathematisches /////////////////////

// degree to Rad
function degreeToRad(degree) {
  return (degree * Math.PI) / 180;
}

function RadToDegree(rad) {
  return (rad * 180) / Math.PI;
}

// coordinates to 2d position
function LatToX(lat) {
  let x = (lat + 180) / 360;
  return x;
}

function LonToY(lon) {
  let y = 1 - (Math.sin(degreeToRad(lon)) + 1) / 2;
  return y;
}

//2d position to coordinates
function XtoLat(x) {
  return x * 360 - 180;
}

function YtoLon(y) {
  return RadToDegree(Math.asin(2 * (0.5 - y)));
}

// Haversine Formula
function calcCrow(lat1, lon1, lat2, lon2) {
  var R = 6371; // km
  var dLat = degreeToRad(lat2 - lat1);
  var dLon = degreeToRad(lon2 - lon1);
  var lat1 = degreeToRad(lat1);
  var lat2 = degreeToRad(lat2);

  var a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2);
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  var d = R * c;
  return d;
}

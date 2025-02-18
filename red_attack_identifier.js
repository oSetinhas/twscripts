var ultimoUpdate = "00:18h de 18 de Fevereiro"; // Data do último update

// URLs to your raw text files on GitHub:
const urlLastCoords = "https://raw.githubusercontent.com/oSetinhas/twscripts/main/last_coord.txt";
const urlCurrentCoords = "https://raw.githubusercontent.com/oSetinhas/twscripts/main/current_coord.txt";

// Load both coordinate files in parallel:
Promise.all([
  fetch(urlLastCoords).then(response => response.text()),
  fetch(urlCurrentCoords).then(response => response.text())
])
.then(([lastCoordsText, currentCoordsText]) => {
  // Process the "last coordinates" file
  var lastCoords = lastCoordsText
    .split('\n')
    .map(line => line.trim())
    .filter(line => line.length > 0);
  
  // Process the "current coordinates" file
  var currentCoords = currentCoordsText
    .split('\n')
    .map(line => line.trim())
    .filter(line => line.length > 0);

  // Create unique arrays:
  var uniqueLastCoords = uniqueArray4(lastCoords);
  var uniqueCurrentCoords = uniqueArray4(currentCoords);

  // Process each row in the table (starting at row 2)
  var tableBody = document.querySelector("#incomings_table > tbody");
  for (var i = 2; i < tableBody.childElementCount; i++) {
    // Get the anchor element that contains the coordinate text
    var row = $("#incomings_table > tbody > tr:nth-child(" + i + ")");
    var aElem = row.find("td:nth-child(3) > a")[0];
    if (!aElem) continue;
    
    // Extract the coordinate (assumes format like "xxx|yyy)" in the text)
    var match = aElem.textContent.match(/\d+\|\d+\)/);
    if (!match) continue;
    var coord = match[0].replace(")", "");

    // Style the row based on the coordinate lists:
    if (uniqueLastCoords.includes(coord)) {
      aElem.style.backgroundColor = "#1bff00";
      row.find("td:nth-child(3)")[0].style.textDecoration = "line-through";
    } else if (uniqueCurrentCoords.includes(coord)) {
      row.find("td:nth-child(3)")[0].style.backgroundColor = "#ffa700";
    }
  }
})
.catch(error => console.error("Error loading coordinates files:", error));

// Helper function to create a unique array from an array
function uniqueArray4(arr) {
  return [...new Set(arr)];
}

const exp = '<div style="width: 100%; text-align: center;"><img src="https://i.imgur.com/F7hHvT2.png"></div>';
$(".overview_filters_manage").eq(0).before(exp);
$(".overview_filters_manage").eq(0).before(`<h1>Ultimo update: ${ultimoUpdate} </h1> <small>xdam98 (Discord: Xico#7941)</small><br>`);

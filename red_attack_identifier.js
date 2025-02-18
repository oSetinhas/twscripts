var ultimoUpdate = "00:18h de 18 de Fevereiro"; // Data do último update

// URLs to your raw text files on GitHub:
const urlLastCoords = "https://raw.githubusercontent.com/oSetinhas/twscripts/main/last_coord.txt";
const urlCurrentCoords = "https://raw.githubusercontent.com/oSetinhas/twscripts/main/current_coord.txt";

// Load the "last coordinates" file
$.get(urlLastCoords, function(lastCoordsText) {
  // Process the "last coordinates" file
  var lastCoords = lastCoordsText
    .split("\n")
    .map(function(line) { return $.trim(line); })
    .filter(function(line) { return line.length > 0; });
  var uniqueLastCoords = uniqueArray4(lastCoords);

  // Now load the "current coordinates" file
  $.get(urlCurrentCoords, function(currentCoordsText) {
    // Process the "current coordinates" file
    var currentCoords = currentCoordsText
      .split("\n")
      .map(function(line) { return $.trim(line); })
      .filter(function(line) { return line.length > 0; });
    var uniqueCurrentCoords = uniqueArray4(currentCoords);

    // Process each row in the table (starting at row 2)
    $("#incomings_table > tbody > tr").each(function(index) {
      // Skip the first row if needed (old code started at row 2)
      if (index < 1) return; 

      var row = $(this);
      var aElem = row.find("td:nth-child(3) > a").get(0);
      if (!aElem) return;
      
      // Extract the coordinate (assumes format like "xxx|yyy)" in the text)
      var match = aElem.textContent.match(/\d+\|\d+\)/);
      if (!match) return;
      var coord = match[0].replace(")", "");

      // Style the row based on the coordinate lists:
      if (uniqueLastCoords.indexOf(coord) !== -1) {
        aElem.style.backgroundColor = "#1bff00";
        row.find("td:nth-child(3)").css("text-decoration", "line-through");
      } else if (uniqueCurrentCoords.indexOf(coord) !== -1) {
        row.find("td:nth-child(3)").css("background-color", "#ffa700");
      }
    });
  }).fail(function() {
    console.error("Error loading current coordinates file.");
  });
}).fail(function() {
  console.error("Error loading last coordinates file.");
});

// Helper function to create a unique array from an array
function uniqueArray4(arr) {
  return $.grep(arr, function(el, index) {
    return index === $.inArray(el, arr);
  });
}

var exp = '<div style="width: 100%; text-align: center;"><img src="https://i.imgur.com/F7hHvT2.png"></div>';
$(".overview_filters_manage").eq(0).before(exp);
$(".overview_filters_manage").eq(0).before('<h1>Ultimo update: ' + ultimoUpdate + ' </h1> <small>xdam98 (Discord: Xico#7941)</small><br>');

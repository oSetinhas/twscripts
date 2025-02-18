var ultimoUpdate = "19:40h de 26 Setembro"; // Data do ultimo update
var aldeiasAtaqueUltimoCoordenado  = "";

var  aldeiasCoordenado = "406|576 452|556 478|567 475|593 477|570 459|562 494|600 458|572 405|577 408|580 436|543 435|543 452|556 465|596 478|567 475|593 477|570 465|568 465|569 459|562 494|600 460|557 492|608 497|603 497|604 498|603 458|572 457|574";
// Aldeias com fulls detetados para o coordenado atual
for (var aldeiasArray = uniqueArray4(aldeiasCoordenado.split(" ")), aldeiasAtaqueUltimoCoordenadoArray = uniqueArray4(aldeiasAtaqueUltimoCoordenado.split(" ")), i = 2; i < document.querySelector("#incomings_table > tbody").childElementCount; i++) {
    var coord = $("#incomings_table > tbody > tr:nth-child(" + i + ") > td:nth-child(3) > a")[0]
        .textContent.match(/\d+\|\d+\)/)[0]
        .replace(")", "");
    aldeiasArray.includes(coord)
        ? (($("#incomings_table > tbody > tr:nth-child(" + i + ") > td:nth-child(3) > a")[0].style.backgroundColor = "#1bff00"),
          ($("#incomings_table > tbody > tr:nth-child(" + i + ") > td:nth-child(3)")[0].style.textDecoration = "line-through"))
        : aldeiasAtaqueUltimoCoordenadoArray.includes(coord) && ($("#incomings_table > tbody > tr:nth-child(" + i + ") > td:nth-child(3)")[0].style.backgroundColor = "#ffa700");
}
function uniqueArray4(t) {
    return [...new Set(t)];
}
const exp = '<div style="width: 100%; text-align: center; "><img src="https://i.imgur.com/F7hHvT2.png"></div>';
$(".overview_filters_manage").eq(0).before(exp), $(".overview_filters_manage").eq(0).before(`<h1>Ultimo update: ${ultimoUpdate} </h1> <small>xdam98 (Discord: Xico#7941) </small> <br>`);

import { createTable, checkValidityOfGraph } from './alg';

export function runAlgorithm(graph) {

    let errorObj = checkValidityOfGraph(graph);
    let invalidArrows = errorObj.arrows;
    let invalidDurations = errorObj.nodes;

    if (invalidArrows.length > 0 || invalidDurations.length > 0) {
        invalidArrows.forEach(arrow => {
            graph.findKonvaArrowById(arrow).attrs.stroke = 'red';
            graph.findKonvaArrowById(arrow).attrs.fill = 'red';
        });

        invalidDurations.forEach(id => {
            graph.findKonvaTextById(id).attrs.fill = 'red';
        });

        document.getElementById('error-modal').classList.add('is-active');
        graph.arrowLayer.draw();
        graph.layer.draw();
        return;
    }


    let out = "";
    let htmlResultTable = document.getElementById('result-table');
    let table = createTable(graph);

    out += "<tr>";
    out += "<th>i</th>"

    for (let i = 0; i < table.ES.length; i++) {
        out += `<th>${i}</th>`;
    }
    out += "</tr>";

    Object.keys(table).forEach(function (key) {
        let temp = "";
        temp += "<tr>";
        temp += `<td>${key}<sub>i</sub></td>`;
        for (let i = 0; i < table[key].length; i++) {
            temp += `<td>${table[key][i]}</td>`;
        }
        temp += "</tr>";
        out += temp;
    });

    htmlResultTable.innerHTML = out;
    document.getElementById('result-tile').style.display = 'block';
}
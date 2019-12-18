import Konva from 'konva';
import Graph from './graph/graph';
import { createNode } from './node/node'
import { createGraphFromJSON, saveGraphAsJSON } from './graph/graph.json.handling';
import { runAlgorithm } from './algorithms/execute.alg';

import 'bulma/css/bulma.css'

var graph;

/**
 * DOCUMENT EVENT LISTENERS
 */

document.addEventListener("DOMContentLoaded", function () {
    main();
});

document.getElementById('uploadFile').onchange = function () {
    let files = document.getElementById('uploadFile').files;

    if (files.length <= 0) { return false; }

    let fr = new FileReader();

    fr.onload = function (e) {
        main();
        createGraphFromJSON(graph, e.target.result);
    }

    fr.readAsText(files.item(0));
};


/**
 * INITIALIZE GRAPH AND STAGE
 */

function main() {
    graph = new Graph();
    document.getElementById('result-tile').style.display = 'none';

    var width = document.getElementById('container').clientWidth;
    var height = document.getElementById('container').clientHeight;

    graph.countNodes = 0;

    graph.stage = new Konva.Stage({
        container: 'container',
        width: width,
        height: height
    });

    graph.stage.on('contentContextmenu', function(e) {
        e.evt.preventDefault();
    });

    graph.layer = new Konva.Layer();
    graph.arrowLayer = new Konva.Layer();

    graph.stage.add(graph.layer);
    graph.stage.add(graph.arrowLayer);
}


/**
 * WINDOW FUNCTIONS CALLED FROM HTML 
 */

window.addNode = function() { createNode(graph); }

window.clearStage = function () { main(); }

window.closeModal = function () { document.getElementById('error-modal').classList.remove('is-active'); }

window.runAlgorithm = function () { runAlgorithm(graph); }

window.saveGraph = function() {

    let obj = saveGraphAsJSON(graph);
    let data = "text/json;charset=utf-8,"
    + encodeURIComponent(JSON.stringify(obj));
    let a = document.createElement('a');
    a.href = 'data:' + data;
    a.download = 'my-graph.json';
    a.click();

}


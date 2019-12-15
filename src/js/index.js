import Konva from 'konva';
import Graph from './graph';
import { createNode } from './node/node'
import { createArrow, createRec, createText, createNodeGroup, createLabel } from './konva-objects/objects';
import { initalizeArrowHandlers } from './arrow/arrow';
import { initalizeNodeHandlers } from './node/node';
import { createTable} from './algorithms/alg'

import 'bulma/css/bulma.css'

var graph;

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


main();

window.addNode = function(){
    createNode(graph);
}

window.clearStage = function () {
    main();
}

window.runAlgorithm = function() {
    let out = "";
    let htmlResultTable = document.getElementById('result-table');
    let table = createTable(graph);

    out += "<tr>";
    out += "<th>i</th>"

    for (let i = 0; i < table.ES.length; i++) {
        out += `<th>${i}</th>`;
    }
    out += "</tr>";

    out += rowForTable("ES", table.ES);
    out += rowForTable("EC", table.EC);
    out += rowForTable("LS", table.LS);
    out += rowForTable("LC", table.LC);

    htmlResultTable.innerHTML = out;
    document.getElementById('result-tile').style.display = 'block';
}

function rowForTable(val, row){
    let out = "";
    out += "<tr>";
    out += `<td>${val}</td>`;
    for (let i = 0; i < row.length; i++) {
        out += `<td>${row[i]}</td>`;
    }
    out += "</tr>";
    return out;
}


window.saveGraph = function() {

    // save Arrows
    let arrows = [];
    graph.arrowLayer.find('Arrow').forEach(arr => {

        let weight = graph.weights.find(w => w.arrow == arr._id);
        let weightKonva = graph.findKonvaLabelById(weight.id);

        let weightTemp;
        if(weightKonva){
            weightTemp = {
                number: weight.number,
                id: weight.id,
                x: weightKonva.attrs.x,
                y: weightKonva.attrs.y
            }
        } else {
            weightTemp = undefined;
        } 

        arrows.push({
            points: arr.attrs.points,
            x: arr.attrs.x,
            y: arr.attrs.y,
            _id: arr._id,
            wei: weightTemp
        });
    });


    // save groups and their texts, no need to store the rectangle
    let groups = [];
    graph.layer.find('Group').forEach(gr => {

        let duration = graph.durations.find(d => d.node == gr._id);

        // prevent weird bug, finds empty nodegroup for weight label
        if(!duration){ return; }

        groups.push({
            x: gr.attrs.x,
            y: gr.attrs.y,
            _id: gr._id,
            txt: gr.getChildren(function (node) {
                return node.getClassName() === 'Text';
            })[0].attrs.text,
            dur: {
                number: duration.number,
                id: duration.id
            }
        });
    });


    let obj = {
        arrows,
        groups,
        numNodes: graph.countNodes,
        connections: graph.connections,
        weights: graph.weights,
        durations: graph.durations
    }

    var data = "text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(obj));

    var a = document.createElement('a');
    a.href = 'data:' + data;
    a.download = 'my-graph.json';
    a.click();

}

document.getElementById('uploadFile').onchange = function () {
    var files = document.getElementById('uploadFile').files;
    if (files.length <= 0) {
        return false;
    }

    var fr = new FileReader();

    fr.onload = function (e) {
        main();
        var obj = JSON.parse(e.target.result);

        graph.connections = obj.connections;
        graph.weights = obj.weights;
        graph.durations = obj.durations;
        graph.countNodes = obj.numNodes;

        obj.groups.forEach(gr => {
            let group = createNodeGroup();
            group._id = gr._id;
            group.attrs.x = gr.x;
            group.attrs.y = gr.y;

            group.add(createRec());
            group.add(createText(gr.txt));

            let durationText = createText(gr.dur.number);            
            durationText.attrs.x = gr.x;
            durationText.attrs.y = gr.y - 50;
            durationText._id = gr.dur.id;

            graph.layer.add(group);
            graph.layer.add(durationText);

            initalizeNodeHandlers(graph, group, durationText);

        });

        obj.arrows.forEach(arr => {
            let konvaArr = createArrow(arr.points);
            konvaArr._id = arr._id;
            konvaArr.attrs.x = arr.x;
            konvaArr.attrs.y = arr.y;
            graph.arrowLayer.add(konvaArr);

            // if the arrow has a weight
            if (arr.wei) {
                let weightLbl = createLabel(arr.wei.x, arr.wei.y);
                weightLbl._id = arr.wei.id;
                weightLbl.add(createText(arr.wei.number));
                graph.layer.add(weightLbl);
            }

        });

        // initalize arrow handlers
        graph.connections.forEach(con => {
            initalizeArrowHandlers(graph, graph.findKonvaArrowById(con.arrow), graph.findKonvoNodeGroupById(con.start));
        });

        graph.arrowLayer.draw();
        graph.layer.draw();

    }

    fr.readAsText(files.item(0));
};

window.uploadGraph = function() {

}




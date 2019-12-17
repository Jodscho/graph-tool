import Konva from 'konva';
import Graph from './graph';
import { createNode } from './node/node'
import { createArrow, createRec, createText, createNodeGroup, createLabel } from './konva-objects/objects';
import { initalizeArrowHandlers } from './arrow/arrow';
import { initalizeNodeHandlers } from './node/node';
import { createTable, checkValidityOfGraph} from './algorithms/alg'

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

    // var complexText = new Konva.Text({
    //     x: width/2 - 150,
    //     y: 60,
    //     text:
    //         "Create a graph by adding notes and connecting them.",
    //     fontSize: 18,
    //     fontFamily: 'Calibri',
    //     fill: ' #1d72aa ',
    //     width: 300,
    //     padding: 20,
    //     align: 'center'
    // });

    // var rect = new Konva.Rect({
    //     x: width/2 - 150,
    //     y: 60,
    //     stroke: ' hsl(204, 86%, 53%) ',
    //     strokeWidth: 5,
    //     fill: '#eef3fc',
    //     width: 300,
    //     height: complexText.height(),
    //     cornerRadius: 10
    // });

    // graph.layer.add(rect);
    // graph.layer.add(complexText);


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

window.closeModal = function () {
    document.getElementById('error-modal').classList.remove('is-active');
}

window.runAlgorithm = function() {

    let errorObj = checkValidityOfGraph(graph);
    let invalidArrows = errorObj.arrows;
    let invalidDurations = errorObj.nodes;

    if (invalidArrows.length > 0 || invalidDurations.length > 0){
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




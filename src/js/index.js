import Konva from 'konva';
import Graph from './graph';
import { createNode } from './node/node'
import 'bulma/css/bulma.css'

const graph = new Graph();

function main() {

    var width = document.getElementById('container').offsetWidth;
    var height = document.getElementById('container').offsetWidth;

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




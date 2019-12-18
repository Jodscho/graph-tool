import { createRec, createText, createNodeGroup, createArrow, createLabel} from './graph.konva.objects';
import { initalizeNodeHandlers } from '../node/node';
import { initalizeArrowHandlers } from '../arrow/arrow';

export function saveGraphAsJSON(graph) {

    // save Arrows
    let arrows = [];
    graph.arrowLayer.find('Arrow').forEach(arr => {

        let weight = graph.weights.find(w => w.arrow == arr._id);
        let weightKonva = graph.findKonvaLabelById(weight.id);

        let weightTemp;
        if (weightKonva) {
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
        if (!duration) { return; }

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

    return {
        arrows,
        groups,
        numNodes: graph.countNodes,
        connections: graph.connections,
        weights: graph.weights,
        durations: graph.durations
    };

}


export function createGraphFromJSON(graph, result) {
    let obj = JSON.parse(result);

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
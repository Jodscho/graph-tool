import { NODE_WIDTH } from '../graph';
import Graph from '../graph';
import Konva from 'konva';


/**
 * When the arrows is dropped on a node, the connection between the node and the arrow is saved.
 * If the arrow is removed from the node, the connection is removed.
 * The position where at the node the arrow is attached depends on the place in the rectangle where
 * the arrow was dropped.
 * 
 * @param {Graph} graph The global graph object.
 * @param {Konva.Arrow} arrow The arrow instance.
 * @param {Konva.Group} startNode The starting point of the arrow.
 */
export function arrowDragEndhandler(graph, arrow, startNode) {
    return function () {
        let pos = graph.stage.getPointerPosition();
        let shape = graph.layer.getIntersection(pos);

        // there is no intersection between an arrow and a node
        if (!shape || shape.parent.getClassName() == 'Layer') {

            // arrow has been move away from node -> cancel connection
            if (graph.checkArrowEndpoint()){
                graph.removeArrowEndpoint(arrow._id);
            }
            return;
        }
        
        let nodeGroup = shape.parent;

        if (graph.isNodeEndpointForArrow(arrow._id, nodeGroup._id)){
           // there already is a endpoint -> redraw arrow at inital position
            let startx = startNode.attrs.x + startNode.attrs.width / 2;
            let starty = startNode.attrs.y;

            arrow.setPoints([startx, starty, startx, starty - 20]);
            graph.arrowLayer.draw();
            return;
        }  else {
            // there is no endpoint -> create new endpoint
            graph.addEndpoint(arrow._id, nodeGroup._id);
        }

        // look where the arrow should be attached, depending on the position of the drop 
        let topEntry = pos.y < (nodeGroup.attrs.y + nodeGroup.attrs.height / 2);
        let leftEntry = pos.x < (nodeGroup.attrs.x + nodeGroup.attrs.width / 2);

        let end1;
        let end2;

        let relX = pos.x - nodeGroup.attrs.x;
        let relY = pos.y - nodeGroup.attrs.y;

        if (topEntry && leftEntry) {
            // upper left corner
            if (relY >= relX) {
                end1 = nodeGroup.attrs.x;
                end2 = pos.y;
            } else {
                end1 = pos.x;
                end2 = nodeGroup.attrs.y;
            }
        } else if (topEntry && !leftEntry) {
            // upper right corner
            if ((NODE_WIDTH / 2) - (relX / 2) >= relY) {
                end1 = pos.x;
                end2 = nodeGroup.attrs.y;
            } else {
                end1 = nodeGroup.attrs.x + nodeGroup.attrs.width;
                end2 = pos.y;
            }
        } else if (!topEntry && leftEntry) {
            // lower left corner
            if ((NODE_WIDTH / 2) - (relX) >= (relY / 2)) {
                end1 = nodeGroup.attrs.x;
                end2 = pos.y;
            } else {
                end1 = pos.x;
                end2 = nodeGroup.attrs.y + nodeGroup.attrs.height;
            }
        } else if (!topEntry && !leftEntry) {
            // lower right corner
            if ((relY / 2) >= (relX / 2)) {
                end1 = pos.x;
                end2 = nodeGroup.attrs.y + nodeGroup.attrs.height;
            } else {
                end1 = nodeGroup.attrs.x + nodeGroup.attrs.width;
                end2 = pos.y;

            }
        }
        let len = arrow.attrs.points.length;
        arrow.attrs.points[len - 2] = end1;
        arrow.attrs.points[len - 1] = end2;
        graph.arrowLayer.batchDraw();
    }
}
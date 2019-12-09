import { NODE_WIDTH } from '../shared';
import SharedUtils from '../shared';
import Konva from 'konva';


/**
 * When the arrows is dropped on a node, the connection between the node and the arrow is saved.
 * If the arrow is removed from the node, the connection is removed.
 * The position where at the node the arrow is attached depends on the place in the rectangle where
 * the arrow was dropped.
 * 
 * @param {SharedUtils} shared The global shared object.
 * @param {Konva.Arrow} arrow The arrow instance.
 * @param {Konva.Group} startNode The starting point of the arrow.
 */
export function arrowDragEndhandler(shared, arrow, startNode) {
    return function () {
        let pos = shared.stage.getPointerPosition();
        let shape = shared.layer.getIntersection(pos);

        // there is no intersection between an arrow and a node
        if (!shape) {
            // check if the connection to a node has to be canceld
            let allConnectedTo = shared.nodeConnections
                .map(c => c.connectedTo)
                .filter(a => a.length != 0);
            let correctOne = allConnectedTo
            .filter(array => array.filter(a => a.arrowId == this._id).length == 1)[0];

            // arrow has been moved but does not have a connection
            if (correctOne == undefined) { return; }

            // undo connection
            let index =  correctOne.findIndex(e => e.arrowId == this._id);
            correctOne.splice(index, 1);

            return;
        }

        // found potential node
        let nodeGroup = shape.parent;

        let foundNodes = shared.nodeConnections
            .filter(n => n.name == nodeGroup._id);

        if (foundNodes > 1) {
            console.error("found more than one node");
            return;
        }

        let connections = foundNodes[0].connectedTo.filter(n => n.nodeId == startNode._id);

        // check if there already is a connection
        if (connections.length > 0) {

            // check if the user wants to redraw arrow to node
            if (connections[0].arrowId != arrow._id) {
                // place new arrow at start of node
                let startx = startNode.attrs.x + startNode.attrs.width / 2;
                let starty = startNode.attrs.y;

                arrow.setPoints([startx, starty, startx, starty - 20]);
                shared.arrowLayer.draw();
                console.warn("node is already connected");
                return;
            }
        } else {
            // create the connection
            foundNodes[0].connectedTo.push({ nodeId: startNode._id, arrowId: arrow._id });
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
        shared.arrowLayer.batchDraw();
    }
}
import { moveWeightLblOfArrow} from './arrow'
import Graph from '../graph';
import Konva from 'konva';

/**
 * Every time the arrow is dragged, the position changes according to
 * the mouse. The weight label follows. Waypoints are unaffected by the change.
 * 
 * @param {Graph} graph The singleton graph object.
 * @param {Konva.Arrow} arrow The arrow instance.
 * @param {Konva.Group} nodeGroup The node instance from where the arrow starts.
 * @return {function} The handler function.
 */
export function arrowDragMoveHandler(graph, arrow, nodeGroup) {
    return function () {
        const pos = graph.stage.getPointerPosition();
        const nodeAttr = nodeGroup.attrs;
        const lenArrowPoints = arrow.attrs.points.length;

        // move weight label, only dependent on the last two coordinates
        let differenceX = pos.x - arrow.attrs.points[lenArrowPoints - 2];
        let differenceY = pos.y - arrow.attrs.points[lenArrowPoints - 1];
        moveWeightLblOfArrow(graph, arrow, differenceX, differenceY);

        if (lenArrowPoints == 4){
            // no waypoints -> arrow is one straight line, change position on nodeGroup
            let startx;
            let starty;
            
            // for first x coordinate
            if (pos.y < nodeAttr.y) {
                starty = nodeAttr.y;
            } else if (pos.y > (nodeAttr.y + nodeAttr.height)) {
                starty = nodeAttr.y + nodeAttr.height;
            } else {
                starty = pos.y;
            }

            // for first y coordinate
            if (pos.x < nodeAttr.x) {
                startx = nodeAttr.x;
            } else if (pos.x > (nodeAttr.x + nodeAttr.width)) {
                startx = nodeAttr.x + nodeAttr.width;
            } else {
                startx = pos.x;
            }

            arrow.setPoints([startx, starty, pos.x, pos.y]);

        } else {
            // only change the last part of the arrow, leave other waypoints intact
            arrow.attrs.points[lenArrowPoints - 2] = pos.x;
            arrow.attrs.points[lenArrowPoints - 1] = pos.y;
        }

        arrow.attrs.x = 0;
        arrow.attrs.y = 0;
        graph.arrowLayer.batchDraw();
    }
}


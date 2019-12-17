import { createWeightLbl } from './arrow'
import { createInputField } from '../helper';
import Graph from '../graph';
import Konva from 'konva';

/**
 * A dblclick on an arrow opens an input field where the weight for the arrow can either be changed
 * or initalized.
 * 
 * @param {Graph} graph The global graph instance.
 * @param {Konva.Arrow} arrow The arrow instance.
 */
export function arrowDblClickHandler(graph, arrow) {
    return function () {


        if (graph.checkOpenInputFields(arrow._id)) {
            return;
        }


        let arrowWeight = graph.getWeightOfArrow(arrow._id);
        let lbl;
        let pos;

        // id was already set, hide existing label
        if (arrowWeight.id) {
            lbl = graph.findKonvaLabelById(arrowWeight.id);
            pos = lbl.getAbsolutePosition();
            lbl.hide();
            graph.layer.draw();
        }

        // get the pointer position for the weight input, otherwise use the label
        if (!pos){
            pos = graph.stage.getPointerPosition();
        }


        let val = (arrowWeight.id) ? arrowWeight.number : '';
        let input = createInputField(graph, val, pos.x, pos.y);
        graph.addOpenInputField(arrow._id);

        input.addEventListener('keydown', function (e) {
            // hide on enter
            if(e.keyCode !== 13){
                return;
            }

            if (arrowWeight.id == undefined) {
                // create new label
                lbl = createWeightLbl(input.value, pos.x, pos.y);
                lbl.getText().text = input.value;
                graph.layer.add(lbl);
                // add entry
                arrowWeight.id = lbl._id;
                arrowWeight.number = input.value;
            } else {
                let textNode = lbl.getText();

                // WORKAROUND: BUG IN KONVA 
                // What should work: lbl.getText().text(input.value), see: https://konvajs.org/api/Konva.Label.html example at the bottom
                // What also does not work: lbl.getText().fontSize(20)
                // BAD but necessary solution: destroy old node and create new one, change text, copy other attributes
                let workaroundTxt = new Konva.Text({
                    text: input.value,
                    fontFamily: textNode.attrs.fontFamily,
                    fontSize: textNode.attrs.fontSize,
                    width: textNode.attrs.width,
                    height: textNode.attrs.height,
                    fill: textNode.attrs.fill,
                    align: textNode.attrs.align,
                    verticalAlign: textNode.attrs.verticalAlign
                })
                textNode.destroy();

                lbl.add(workaroundTxt);

                lbl.show();
                // change entry
                arrowWeight.number = input.value;
            }
            graph.removeFromOpenInputFields(arrow._id);

            graph.layer.draw();
            document.body.removeChild(input);

        });
    }
}
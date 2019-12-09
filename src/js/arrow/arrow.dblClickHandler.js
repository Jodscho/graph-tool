import { createWeightLbl } from './arrow'
import { createInputField } from '../helper';
import SharedUtils from '../shared';
import Konva from 'konva';

/**
 * A dblclick on an arrow opens an input field where the weight for the arrow can either be changed
 * or initalized.
 * 
 * @param {SharedUtils} shared The global shared instance.
 * @param {Konva.Arrow} arrow The arrow instance.
 */
export function arrowDblClickHandler(shared, arrow) {
    return function () {

        let arrowWeight = shared.arrowWeights.find(a => a.arrowId == arrow._id);
        let lbl;

        if (arrowWeight.weight.id != undefined) {
            lbl = shared.arrowLayer.find('Label').filter(e => e._id == arrowWeight.weight.id)[0];
            lbl.hide();
        }

        let pos = shared.stage.getPointerPosition();

        let val = (arrowWeight.weight.id) ? arrowWeight.weight.number : '';
        let input = createInputField(shared, val, pos.x, pos.y);

        input.addEventListener('keydown', function (e) {
            // hide on enter
            if(e.keyCode !== 13){
                return;
            }

            if (arrowWeight.weight.id == undefined) {
                // create new label
                lbl = createWeightLbl(input.value, pos.x, pos.y);
                lbl.getText().text = input.value;
                shared.arrowLayer.add(lbl);
                // add entry
                arrowWeight.weight = { id: lbl._id, number: input.value };
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
                arrowWeight.weight.number = input.value;
            }

            shared.arrowLayer.draw();
            document.body.removeChild(input);

        });
    }
}
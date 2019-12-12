import { createInputField } from '../helper';


export function nodeDblClickHandler(shared, textNode) {
    return function () {
        textNode.hide();
        shared.durationLayer.draw();

        let input = createInputField(shared, textNode.attrs.text, textNode.attrs.x, textNode.attrs.y);

        input.addEventListener('keydown', function (e) {
            // hide on enter
            if (e.keyCode === 13) {
                textNode.text(input.value);
                textNode.parent.attrs.name = input.value;
                textNode.show();
                shared.durationLayer.draw();
                document.body.removeChild(input);
            }
        });
    }
}
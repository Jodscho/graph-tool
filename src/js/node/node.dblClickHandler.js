import { createInputField } from '../helper';


export function nodeDblClickHandler(shared, textNode) {
    return function () {
        if (shared.openInputFields.findIndex(e => e == textNode._id) != -1){
            return;
        }

        textNode.hide();
        shared.layer.draw();

        let input = createInputField(shared, textNode.attrs.text, textNode.attrs.x, textNode.attrs.y + 35);
        shared.openInputFields.push(textNode._id);

        input.addEventListener('keydown', function (e) {
            // hide on enter
            if (e.keyCode === 13) {
                textNode.text(input.value);
                textNode.parent.attrs.name = input.value;
                textNode.show();
                shared.layer.draw();
                document.body.removeChild(input);
                let i = shared.openInputFields.findIndex(e => e == textNode._id);
                if (i != -1) {  
                    shared.openInputFields.splice(i, 1);
                }
            }
        });
    }
}
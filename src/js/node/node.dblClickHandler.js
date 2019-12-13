import { createInputField } from '../helper';


export function nodeDblClickHandler(graph, textNode) {
    return function () {

        if(graph.checkOpenInputFields(textNode._id)){
            return;
        }


        textNode.hide();
        graph.layer.draw();

        let input = createInputField(graph, textNode.attrs.text, textNode.attrs.x, textNode.attrs.y);
        graph.addOpenInputField(textNode._id);

        input.addEventListener('keydown', function (e) {
            // hide on enter
            if (e.keyCode === 13) {
                textNode.text(input.value);
                textNode.parent.attrs.name = input.value;
                textNode.show();
                graph.layer.draw();
                document.body.removeChild(input);
                graph.removeFromOpenInputFields(textNode._id);
            }
        });
    }
}
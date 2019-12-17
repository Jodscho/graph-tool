import { createInputField } from '../helper';


export function nodeDblClickHandler(graph, textNode) {
    return function () {

        if (textNode.attrs.fill != 'black') {
            textNode.attrs.fill = 'black';
        }


        if(graph.checkOpenInputFields(textNode._id)){
            return;
        }

        let durationLbl = graph.getDurationById(textNode._id);



        textNode.hide();
        graph.layer.draw();

        let input = createInputField(graph, textNode.attrs.text, textNode.attrs.x, textNode.attrs.y);
        graph.addOpenInputField(textNode._id);

        input.addEventListener('keydown', function (e) {
            // hide on enter
            if (e.keyCode === 13) {
                textNode.text(input.value);
                textNode.parent.attrs.name = input.value;
                durationLbl.number = input.value;
                textNode.show();
                graph.layer.draw();
                document.body.removeChild(input);
                graph.removeFromOpenInputFields(textNode._id);
            }
        });
    }
}
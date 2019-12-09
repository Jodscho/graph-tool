import Konva from 'konva';
import SharedUtils from './shared';
import { addNewRect } from './node/node'
import 'bulma/css/bulma.css'

const shared = new SharedUtils();

function main() {

    var width = document.getElementById('container').offsetWidth;
    var height = document.getElementById('container').offsetWidth;

    shared.countNodes = 0;

    shared.stage = new Konva.Stage({
        container: 'container',
        width: width,
        height: height
    });

    shared.stage.on('contentContextmenu', function(e) {
        e.evt.preventDefault();
    });

    shared.layer = new Konva.Layer();
    shared.arrowLayer = new Konva.Layer();

    shared.stage.add(shared.layer);
    shared.stage.add(shared.arrowLayer);

}


main();

window.addNode = function(){
    addNewRect(shared);
}

window.clearStage = function () {
    main();
}




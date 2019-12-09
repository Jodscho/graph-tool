import { NODE_WIDTH, NODE_HEIGHT } from './shared';


export function createInputField(shared, value, x, y) {
    let containerRect = shared.stage.container().getBoundingClientRect();
    let input = document.createElement("input");
    document.body.appendChild(input);
    input.style.position = 'absolute';
    input.type = 'text';
    input.value = value;
    input.className = 'nodeInput';
    input.style.top = containerRect.top + y + 'px';
    input.style.left = containerRect.left + x + 'px';
    input.style.width = NODE_WIDTH + 'px';
    input.style.height = NODE_HEIGHT + 'px';
    input.focus();
    return input;
}
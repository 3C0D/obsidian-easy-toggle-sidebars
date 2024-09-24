import {  getRightSplit } from "./barTools";

function isClickOnRightEdge(event : MouseEvent) {
    const scroller = document.querySelector('div.cm-scroller');
    if (!scroller) return false;

    const rect = scroller.getBoundingClientRect();
    const offsetX = event.clientX - rect.left;

    return offsetX > (rect.width - 40);
}

export function clickScrollBar(e : MouseEvent) {
    const target = e.target as HTMLElement; 
    if (target.closest('.cm-scroller') && isClickOnRightEdge(e) || target.closest('.mod-right-split')) {
        getRightSplit().toggle()
    }
}
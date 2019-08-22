import * as t from '@babel/types'

export function getNextJSXElment (path) {
    let nextElement = null;
    for (let i = path.key + 1; ; i++) {
        const nextPath = path.getSibling(i);
        if (!nextPath.node) {
            break;
        } else if (t.isJSXElement(nextPath.node)) {
            nextElement = nextPath.node;
            nextPath.traverse({
                JSXAttribute (p) {
                    if (p.node.name.name === 'v-else') {
                        p.remove();
                    }
                }
            });
            nextPath.remove();
            break;
        }
    }

    return nextElement;
};

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

export function genSFCRenderMethod (path, argument: t.JSXElement) {
	// @ts-ignore
	path.node.extra = {
		parenthesized: true,
	}
    const render = t.classMethod(
        'method',
        t.identifier('render'),
        [],
        t.blockStatement([
			t.returnStatement(
				t.parenthesizedExpression(argument)
			)
		])
    );

    path.node.body.push(render);
};

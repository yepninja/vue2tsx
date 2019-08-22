import * as t from '@babel/types'
import { NodePath } from "@babel/traverse";

export function addRender (vuePath: NodePath<t.ClassBody>, argument: t.JSXElement) {
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

    vuePath.node.body.push(render);
};

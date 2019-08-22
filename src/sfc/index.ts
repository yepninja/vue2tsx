import {parse} from '@babel/parser'
import * as t from '@babel/types'
import traverse from '@babel/traverse'

import { 
    handleIfDirective, handleShowDirective, handleOnDirective,
    handleForDirective, handleTextDirective, handleHTMLDirective,
    handleBindDirective
} from './directives';

export const prepareTemplate = (template: string): string =>
	template
		.replace(/{{/g, '{')
		.replace(/}}/g, '}')
		.replace(/(:[\w-]+=)/g, 'v-bind$1')

export function traverseTemplate (tast: t.File, state) {
    let argument = null;
    // cache some variables are defined in v-for directive
    const definedInFor = [];

    traverse(tast, {
        ExpressionStatement: {
            enter (path) {
                
            },
            exit (path) {
                argument = path.node.expression;
            }
        },

        JSXAttribute (path) {
			const node = path.node;
			
			// @ts-ignore
            const value = node.value.value;

            if (!node.name) {
                return;
            }

            if (node.name.name === 'v-if') {
                handleIfDirective(path, value, state);
            } else if (node.name.name === 'v-show') {
                handleShowDirective(path, value, state);
            } else if (t.isJSXNamespacedName(node.name)) {
                // v-bind/v-on
                if (node.name.namespace.name === 'v-on') {
                    handleOnDirective(path, node.name.name.name, value);
                } else if (node.name.namespace.name === 'v-bind') {
                    handleBindDirective(path, node.name.name.name, value, state);
                }
            } else if (node.name.name === 'v-for') {
                handleForDirective(path, value, definedInFor, state);
            } else if (node.name.name === 'v-text') {
                handleTextDirective(path, value, state);
                path.remove();
            } else if (node.name.name === 'v-html') {
                handleHTMLDirective(path, value, state);
            }
		},

        JSXExpressionContainer (path) {
			path.traverse({
				Expression(path) {
					if (path.isIdentifier()) {
						path.replaceWith(
							t.memberExpression(
								t.thisExpression(),
								path.node,
							)
						)
					}
				}
			})
        }
    });

    return argument; 
};

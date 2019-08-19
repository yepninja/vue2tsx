import * as t from '@babel/types'
import traverse, { NodePath } from '@babel/traverse'

import { log } from './utils';
import {collectVueProps} from './vue-props'
import {collectVueComputed} from './vue-computed'

type VuePath = NodePath<t.ObjectExpression>

/**  
 * Collect vue component state(data prop, props prop & computed prop)
 * Don't support watch prop of vue component
 */
export function collectProps (vuePath: VuePath): t.ObjectProperty[] {
	let props: t.ObjectProperty[]
	vuePath.traverse({
		ObjectProperty (path) {
			if (path.node.key.name === 'props' &&
				t.isObjectExpression(path.node.value)) {
				// @ts-ignore
				props = path.node.value.properties
				path.stop();
			}
		}
	});
	return props
};

export function collectData (vuePath: VuePath) {
	let data
	vuePath.traverse({
		ObjectMethod (path) {
			if (path.node.key.name === 'data') {
				// @ts-ignore
				data = path.node.body.body[0].argument.properties
				path.stop();
			}
		}
	});
	return data
};

export function collectComputed (vuePath: VuePath) {
	const computed = {}
	vuePath.traverse({
		ObjectProperty (path) {
			if (path.node.key.name === 'computed' &&
				t.isObjectExpression(path.node.value)) {
				// @ts-ignore
				computed = path.node.value.properties
				path.stop();
			}
		}
	});
	return computed
};

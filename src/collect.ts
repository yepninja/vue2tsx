import * as t from '@babel/types'
import traverse, { NodePath } from '@babel/traverse'

import { log } from './utils';
import {collectVueProps} from './vue-props'
import {collectVueComputed} from './vue-computed'

type VuePath = NodePath<t.ObjectExpression>

const collect = <NodeType> (prop: 'props' | 'data' | 'computed' | 'methods') => (vuePath: VuePath): NodeType[] => {
	let props
	vuePath.traverse({
		[prop === 'data' ? 'ObjectMethod' : 'ObjectProperty'] (path) {
			if (path.node.key.name === prop) {
				if (prop === 'data') {
					props = path.node.body.body[0].argument.properties
				} else {
					props = path.node.value.properties
				}
				path.stop();
			}
		}
	});
	return props || []
}

/**  
 * Collect vue component state(data prop, props prop & computed prop)
 * Don't support watch prop of vue component
 */
export const collectProps = collect<t.ObjectProperty>('props')

export const collectData = collect<t.ObjectProperty>('data')

export const collectComputed = collect<t.ObjectMethod>('computed')

export const collectMethods = collect<t.ObjectMethod>('methods')

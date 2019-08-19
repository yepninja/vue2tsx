import { parse } from '@babel/parser'
import * as t from '@babel/types'
import generate from '@babel/generator'
import traverse, { NodePath } from '@babel/traverse'
import { parseComponent } from 'vue-template-compiler'

import { prepareTemplate, traverseTemplate } from './sfc'
import { genSFCRenderMethod } from './sfc/sfc-ast-helpers';
import { collectProps, collectComputed, collectData } from './collect'

interface FileInfo {
	source: string
}

const state = {
    name: undefined,
    data: {},
    props: {},
    computeds: {},
    components: {}
};

const findVue = (ast: t.File): NodePath<t.ObjectExpression> => {
	let vue: NodePath<t.ObjectExpression>
	traverse(ast, {
		ObjectExpression(path) {
			if (t.isExportDefaultDeclaration(path.parent) ||
			t.isExportDefaultDeclaration(path.parentPath.parent)) {
				vue = path
			}
		}
	})
	if (!vue) {
		throw new Error('No default export')
	}
	return vue
}

export default function (fileInfo: FileInfo) {

	const {template, script, styles} = parseComponent(fileInfo.source)

	const jsxAst = parse(prepareTemplate(template.content), {
		plugins: [
			'jsx',
		]
	})
	const ast = parse(script.content, {
		sourceType: 'module',
		plugins: [
			'decorators-legacy',
			'jsx',
			'typescript',
		],
	})

	// const vuePath = findVue(ast)

	// const vueData = collectData(vuePath);
	// const vueProps = collectProps(vuePath);
	// const vueComputed = collectComputed(vuePath);

	const renderArgument = traverseTemplate(jsxAst, state)

	traverse(ast, {
		ClassBody (path) {
			genSFCRenderMethod(path, renderArgument)
		}
	})

	console.log(generate(ast).code)

	// return generate(ast).code
}

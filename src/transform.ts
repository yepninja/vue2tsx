import { parse } from '@babel/parser'
import * as t from '@babel/types'
import generate from '@babel/generator'
import traverse, { NodePath } from '@babel/traverse'
import { parseComponent } from 'vue-template-compiler'

import { prepareTemplate, traverseTemplate } from './sfc'
import { collectProps, collectComputed, collectData, collectMethods } from './collect'

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

	const templateAst = parse(prepareTemplate(template.content), {
		plugins: [
			'jsx',
		]
	})
	const renderArgument = traverseTemplate(templateAst, state)

	const scriptAst = parse(script.content, {
		sourceType: 'module',
		plugins: [
			'decorators-legacy',
			'jsx',
			'typescript',
		],
	})

	const vueAst = t.classDeclaration(
		t.identifier('Component'),
		t.identifier('Vue'),
		t.classBody([])
	)

	const vuePath = findVue(scriptAst)

	const vueData = collectData(vuePath);
	const vueProps = collectProps(vuePath);
	const vueComputed = collectComputed(vuePath);
	const vueMethods = collectMethods(vuePath)

	// console.log(vueData)
	const vueClassData = vueData.map(node => {
		return t.classProperty(
			node.key,
			node.value as t.Expression
		)
	})

	const vueClassProps = vueProps.map(node => {
		// @ts-ignore
		// console.log(node.value.properties)
		const prop = t.classProperty(
			node.key
		)
		prop.decorators = [
			t.decorator(
				t.callExpression(
					t.identifier('Prop'),
					[]
				)
			)
		]
		return prop
	})

	const vueClassComputed = vueComputed.map(node => {
		return t.classMethod('get', node.key, node.params, node.body)
	})

	const vueClassMethods = vueMethods.map(node => {
		return t.classMethod('method', node.key, node.params, node.body)
	})

	vueAst.body = t.classBody([].concat(
		vueClassData,
		vueClassProps,
		vueClassComputed,
		vueClassMethods,
		t.classMethod(
			'method',
			t.identifier('render'),
			[],
			t.blockStatement([
				t.returnStatement(
					t.parenthesizedExpression(renderArgument)
				)
			])
		)
	))

	traverse(scriptAst, {
		ExportDefaultDeclaration(path) {
			path.node.declaration = vueAst
			// path.get('declaration').replaceWith(vueAst)
		},
	})

	traverse(scriptAst, {
		ImportDeclaration(path) {
			path.insertBefore(
				t.importDeclaration([
					t.importSpecifier(
						t.identifier('Component'),
						t.identifier('Component')
					),
					t.importSpecifier(
						t.identifier('Prop'),
						t.identifier('Prop')
					)
				], t.stringLiteral('vue-property-decorator'))
			)
			path.stop()
		},
	})

	return generate(scriptAst).code
}

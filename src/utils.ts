import * as t from '@babel/types'
const chalk = {
	red: console.error,
	green: console.log,
}

export function parseName (name) {
    name = name || 'my-react-compoennt';
    const val = name.toLowerCase().split('-');
    let str = '';
    val.forEach(v => {
        v = v[0].toUpperCase() + v.substr(1);
        str += v;
    });
    return str;
};

export function log (msg, type = 'error') {
    if (type === 'error') {
        return console.log(chalk.red(`[vue2tsx]: ${msg}`));
    }
    console.log(chalk.green(msg));
};

export function getIdentifier (state, key) {
    return state.data[key] ? t.identifier('state') : t.identifier('props');
};

export function genPropTypes (props) {
    const properties = [];
    const keys = Object.keys(props);

    for (let i = 0, l = keys.length; i < l; i++) {
        const key = keys[i];
        const obj = props[key];
        const identifier = t.identifier(key);

        let val = t.memberExpression(t.identifier('PropTypes'), t.identifier('any'));
        if (obj.type === 'typesOfArray' || obj.type === 'array') {
            if (obj.type === 'typesOfArray') {
                const elements = [];
                obj.value.forEach(val => {
                    elements.push(t.memberExpression(t.identifier('PropTypes'), t.identifier(val)));
                });
				// @ts-ignore
                val = t.callExpression(
                    t.memberExpression(t.identifier('PropTypes'), t.identifier('oneOfType')),
                    [t.arrayExpression(elements)]
                );
            } else {
                val = obj.required 
                    ? t.memberExpression(t.memberExpression(t.identifier('PropTypes'), t.identifier('array')), t.identifier('isRequired'))
                    : t.memberExpression(t.identifier('PropTypes'), t.identifier('array'));
            }
        } else if (obj.validator) {
            const node = t.callExpression(
                t.memberExpression(t.identifier('PropTypes'), t.identifier('oneOf')),
                [t.arrayExpression(obj.validator.elements)]
            );
            if (obj.required) {
                val = t.memberExpression(
                    node,
                    t.identifier('isRequired')
                );
            } else {
				// @ts-ignore
                val = node;
            }
        } else {
            val = obj.required 
                ? t.memberExpression(t.memberExpression(t.identifier('PropTypes'), t.identifier(obj.type)), t.identifier('isRequired'))
                : t.memberExpression(t.identifier('PropTypes'), t.identifier(obj.type));
        }

        properties.push(t.objectProperty(identifier, val));
    }

    // Babel does't support to create static class property???
    return t.classProperty(t.identifier('static propTypes'), t.objectExpression(properties), null, []);
};

export function genDefaultProps (props) {
    const properties = [];
    const keys = Object.keys(props).filter(key => typeof props[key].value !== 'undefined');

    for (let i = 0, l = keys.length; i < l; i++) {
        const key = keys[i];
        const obj = props[key];
        const identifier = t.identifier(key);

        let val = t.stringLiteral('error');
        if (obj.type === 'typesOfArray') {
            const type = typeof obj.defaultValue;
            if (type !== 'undefined') {
                const v = obj.defaultValue;
					// @ts-ignore
                val = type === 'number' ? t.numericLiteral(Number(v)) : type === 'string' ? t.stringLiteral(v) : t.booleanLiteral(v);
            } else {
                continue;
            }
        } else if (obj.type === 'array') {
			// @ts-ignore
            val = t.arrayExpression(obj.value.elements);
        } else if (obj.type === 'object') {
			// @ts-ignore
            val = t.objectExpression(obj.value.properties);
        } else {
            switch (obj.type) {
                case 'string':
					// @ts-ignore
                    val = t.stringLiteral(obj.value);
                    break;
                case 'boolean':
					// @ts-ignore
                    val = t.booleanLiteral(obj.value);
                    break;
                case 'number':
					// @ts-ignore
                    val = t.numericLiteral(Number(obj.value));
                    break;
            }
        }

        properties.push(t.objectProperty(identifier, val));
    }

    // Babel does't support to create static class property???
    return t.classProperty(t.identifier('static defaultProps'), t.objectExpression(properties), null, []);
};

# vue to tsx
Transform vue sfc files to class-style components with jsx

## Usage
```js
const transform = require('vue2tsx')

const source = fs.readFileSync('your-vue-component.vue').toString()

const output = transform({
	source,
})

console.log(output)

fs.writeFile('your-new-tsx-file.tsx', output)

```

## Examples

### Input
```vue
<template>
	<div v-on:click="log">
		{{sum}}
	</div>
</template>

<script lang="ts">
import Vue from 'vue';

const sumFunc = () => console.log('Hello, world!')

export default Vue.extend({
	data() {
		return {
			numb2: 2,
		}
	},
	props: {
		numb1: {
			type: Number,
			required: true
		}
	},
	computed: {
		sum(): number {
			return this.numb1 + this.numb2;
		}
	},
	methods: {
		log() {
			sumFunc()
		}
	}
});
</script>
```

### Output
```tsx
import { Component, Prop } from "vue-property-decorator";
import Vue from 'vue';

const sumFunc = () => console.log('Hello, world!');

export default class Component extends Vue {
  numb2 = 2;

  @Prop()
  numb1;

  get sum() {
    return this.numb1 + this.numb2;
  }

  log() {
    sumFunc();
  }

  render() {
    return (
		<div onClick={this.log}>
			{this.sum}
		</div>
	);
  }
}
```

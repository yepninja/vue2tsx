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

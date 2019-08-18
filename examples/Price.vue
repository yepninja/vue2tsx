<template>
	<span>{{ prefix ? `${prefix} `: '' }}{{ price }} </span>
</template>

<script lang="ts">
import Vue from 'vue';

const formatter = new Intl.NumberFormat('ru-RU', {
	style: 'currency',
	currency: 'RUB',
	minimumFractionDigits: 0,
});

export default Vue.extend({
	props: {
		cost: {
			type: Number,
			required: true
		},
		prefix: {
			type: String,
			default: ''
		}
	},
	computed: {
		price(): string {
			return formatter.format(this.cost);
		}
	}
});
</script>

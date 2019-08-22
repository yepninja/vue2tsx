<template>
	<span>
		{{ Math.round(value * 100) / 100 }} м<sup class="sup">3</sup>
		<input :prop="value" />
		<span v-if="v"></span>
	</span>
</template>

<script lang="ts">
import {Vue, Component, Prop, Watch, Emit} from 'vue-property-decorator';

@Component
export default class Volume extends Vue {
	@Prop(Number) readonly value!: number;
}
</script>

<style>
.sup {
	top: 0;
	vertical-align: super;
}
</style>

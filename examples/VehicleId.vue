<template>
	<div v-if="parseNumber" class="car-number" >
		<div class="number">{{ parseNumber.leftLetter }}<span class="number-center">{{ parseNumber.number }}</span>{{ parseNumber.rightLetter }}</div>
		<div class="region">
			<div class="region-number">{{ parseNumber.regionNumber }}</div>
			<div class="region-flag" />
		</div>
	</div>
	<div v-else class="car-number" >
		<div class="number">{{ number }}</div>
	</div>
</template>

<script lang="ts">
import Vue from 'vue';

interface ParsedNumber {
    leftLetter: string, number: string, rightLetter: string, regionNumber: string
}
const numberRegexp = /([а-я])([0-9]{3})([а-я]{2})([0-9]{2,3})/i;

export default Vue.extend({
	props: {
		number: {
			type: String,
			required: true
		}
	},
	computed: {
		parseNumber(): (ParsedNumber | null) {
			const res = this.number.match(numberRegexp) as Array<string>;

			if (res) {

				const [, leftLetter, number, rightLetter, regionNumber] = res;

				return {
					leftLetter, number, rightLetter, regionNumber
				};
			}

			return null;
		}
	}
});
</script>

<style scoped>
	.car-number {
		font-size: 13px;
		border: 2px solid #000;
		border-radius: 3px;
		display: inline-flex;
		font-weight: bold;
		color: #000;
		background: #fdfdfd;
		font-family: Geneva, Tahoma, sans-serif;
		letter-spacing: 1px;
		padding: 0 8px;
		text-align: center;
		align-items: center;
		white-space: nowrap;
	}

	.number-center {
		font-size: 15px;
	}

	.region {
		margin-left: 5px;
		border-left: 2px solid #000;
		padding: 3px 0 3px 5px;
		line-height: 12px;
		position: relative;
	}

	.region-number {
		font-size: 12px;
	}

	.region-flag {
		font-size: 8px;
		position: relative;
	}

	.region-flag::before {
		content: '';
		display: inline-block;
		width: 16px;
		height: 9px;
		background: linear-gradient(to bottom, #ffffff 33%,#2942e5 33%,#2942e5 56%,#2942e5 66%,#d10c0c 66%);
		vertical-align: middle;
		/*margin-right: 3px;*/
	}
</style>


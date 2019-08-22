import {readFileSync} from 'fs'
import transform from '.';

const file = readFileSync('./examples/VehicleId.vue').toString()

const output = transform({
	source: file
})

console.log(output)

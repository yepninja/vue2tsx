import { readFileSync } from 'fs'

const file = readFileSync('./examples/VehicleId.vue').toString()

import transform from './src/transform'

const output = transform({
	source: file,
})

console.log(output)

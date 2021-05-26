import babel from 'rollup-plugin-babel';
import nodeResolve from "rollup-plugin-node-resolve";

export default {
	input: './src/index.js',
	output: {
		format: 'umd',
		name: 'Vue',
		file: 'dist/vue.js',
		sourcemap: true
	},
	plugins: [
		nodeResolve(),
		babel({
			exclude: 'node_modules/**'
		})
	]
}

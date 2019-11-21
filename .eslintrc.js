module.exports = {
	parser: 'babel-eslint',
	parserOptions: {
		ecmaVersion: 8,
		sourceType: 'module'
	},
	plugins: ['babel', 'prettier'],
	extends: [
		'eslint:recommended',
		'plugin:prettier/recommended',
		'plugin:react/recommended'
	],
	settings: {
		react: {
			pragma: 'React', // Pragma to use, default to "React"
			version: 'detect'
		}
	},
	env: {
		es6: true,
		browser: true,
		commonjs: true
	},
	globals: {
		process: true,
		describe: true,
		test: true,
		__dirname: true,
		expect: true,
		jest: true
	},
	rules: {
		'prettier/prettier': 'error'
	}
};

module.exports = {
	apps: [
		{
			name: "velvet cup",
			mode: "cluster",
			script: "pnpm start",
			instances: "max",
			autorestart: true,
		},
	],
}

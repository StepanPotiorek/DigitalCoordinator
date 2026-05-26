module.exports = {
  apps: [
    {
      name: "digi-coord",
      script: "server.js",
      cwd: "./.next/standalone",
      env: {
        NODE_ENV: "production",
        PORT: 3000,
      },
    },
  ],
};

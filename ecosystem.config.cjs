module.exports = {
    apps: [
        {
            name: "rutufruits-website",
            script: "node_modules/next/dist/bin/next",
            args: "start -p 8000",
            instances: "max",
            exec_mode: "cluster",
            env: {
                NODE_ENV: "production",
            },
        },
    ],
};

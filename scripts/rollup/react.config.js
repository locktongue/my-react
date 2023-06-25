import {
    getBaseRollupPlugins,
    getPackageJSON,
    resolvePackagesPath
} from "./utils";
import genPackageJSON from "rollup-plugin-generate-package-json";

const { name, module } = getPackageJSON("react");
// react包的路径
const pkgPath = resolvePackagesPath(name);
// react产物路径
const pkgDistPath = resolvePackagesPath(name, true);

export default [
    // react
    {
        input: `${pkgPath}/${module}`,
        output: {
            file: `${pkgDistPath}/index.js`,
            name: "index.js",
            format: "umd"
        },
        plugins: [
            ...getBaseRollupPlugins({}),
            genPackageJSON({
                inputFolder: pkgPath,
                outputFolder: pkgDistPath,
                baseContents: ({ name, description, version }) => ({
                    name,
                    description,
                    version,
                    main: "index.js"
                })
            })
        ]
    },
    // jsx-runtime
    {
        input: `${pkgPath}/src/jsx.ts`,
        output: [
            {
                file: `${pkgDistPath}/jsx-runtime.js`,
                name: "jsx-runtime.js",
                format: "umd"
            },
            {
                file: `${pkgDistPath}/jsx-dev-runtime.js`,
                name: "jsx-dev-runtime.js",
                format: "umd"
            }
        ],
        plugins: getBaseRollupPlugins({})
    }
];

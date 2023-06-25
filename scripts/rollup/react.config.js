import {
    getBaseRollupPlugins,
    getPackageJSON,
    resolvePackagesPath
} from "./utils";

const { name, module } = getPackageJSON("react");
// react包的路径
const pkgPath = resolvePackagesPath(name);
// react产物路径
const pkgDistPath = resolvePackagesPath(name, true);

export default [
    {
        input: `${pkgPath}/${module}`,
        output: {
            path: `${pkgDistPath}/index.js`,
            name: "index.js",
            format: "umd"
        },
        plugins: getBaseRollupPlugins({})
    }
];

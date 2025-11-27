import packageJson from "../../../package.json";

interface DefaultConfig {
    mode: 'developing' | 'production';
    baseURL: string;
    version: string;
    title: string;
};

const production = import.meta.env.VITE_PRODUCTION == 'true';
const title = import.meta.env.VITE_TITLE || 'Scout Treasury';
const baseURL = import.meta.env.VITE_BASEURL;

let defaultConfig: DefaultConfig = production ? {
    version: packageJson.version,
    mode: 'production',
    baseURL,
    title
}  : {
    version: packageJson.version,
    mode: 'developing',
    baseURL,
    title
};

export default defaultConfig;
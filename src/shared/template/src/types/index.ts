export type Project = {
    name: string;
    description: string;
    steps: {
        duration?: number;
        code: string;
    }[];
};

/// Enable the ability to use @babel/standalone to transpile stringified code
/// from and into a JSX component.
declare global {
    interface Window {
        Babel: object;
    }
}
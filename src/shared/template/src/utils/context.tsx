export default class Context {
    private _temp: string;
    private _parentTemp: string;
    private _com: React.FC<any> | null;
    private _b: any;

    constructor(React: any) {
        this._temp = '';
        this._parentTemp = `"use strict";\nreturn @temp;`;
        this._com = null;

        window.React = window.React || React;

        if (!(Object.prototype.hasOwnProperty.call(window, 'Babel') && typeof window.Babel === 'object')) {
            throw new Error(
                `
                🔴 Must install @babel/standalone correctly to build <StringComponent /> at runtime.
                🟡 This is not installed through npm, but in the <head> of \`index.html\` with a CDN.
                `
            );
        }

        this._b = window.Babel;
    }

    /// Confirm that Babel has been properly configured before even attempting to transpile.
    /// This will confirm that the package has been imported in `index.html` and that the
    /// `babelOptions` prop is a properly defined configuration object.
    private _checkBabelOptions(babelOptions: any): void {
        if (Object.prototype.toString.call(babelOptions) !== '[object Object]') {
            throw new Error(
                `🔴 \`babelOptions\` prop of element should be an Object of configuration keys.`
            );
        }

        if (!Object.prototype.hasOwnProperty.call(babelOptions, 'presets')) {
            babelOptions.presets = ['react'];
        } else {
            if (!(typeof babelOptions.presets === 'object' && babelOptions.presets.constructor == Array)) {
                throw new Error(
                    `🔴 \`presets\` property of \`babelOptions\` prop should be an Array.`
                );
            }

            /// Make sure the react preset is included in Babel options.
            if (babelOptions.presets.indexOf('react') === -1) {
                babelOptions.presets.push('react');
            }
        }
    }

    /// Update the template string and generate the component from it as 
    /// well as sourceURL for debugging purposes (This is not used at the time
    /// implementation but could be extended into a Component).
    private _transpile(babelOptions: any): string {
        this._checkBabelOptions(babelOptions);

        const resultObj = this._b.transform(this._temp, babelOptions);
        const filename = babelOptions.filename;

        let code = resultObj.code;
        if (filename) {
            code = resultObj.code + `\n//# sourceURL=${filename}`;
        }

        return code;
    }

    private _generateCom(babelOptions: any): void {
        this._com = Function(
            this._parentTemp.replace('@temp', this._transpile(babelOptions))
        )();
        this._validateCodeInsideTheTemp();
    }

    private _validateCodeInsideTheTemp(): void {
        if (typeof this._com !== 'function') {
            throw new Error(
                `🔴 code inside children of <StringComponent /> must be a stringified Functional Component.`
            );
        }
    }

    private _validateTemplate(temp: string): void {
        if (typeof temp !== 'string') {
            throw new Error(
                `🔴 children of <StringComponent /> must be a string.`
            );
        }

        if (temp === '') {
            throw new Error(
                `🔴 children of <StringComponent /> must not be an empty string.`
            );
        }
    }

    updateTemplate(template: string, babelOptions: any): this {
        this._validateTemplate(template);

        if (template !== this._temp) {
            this._temp = template;
            this._generateCom(babelOptions);
        }

        return this;
    }

    getComponent() {
        return this._com;
    }
}

import provider from 'web3-providers-http';

export function injectProvider() {
    // https://stackoverflow.com/questions/12395722/can-the-window-object-be-modified-from-a-chrome-extension
    ;(function() {
        window.ethereum = provider;
        function script() {
            window.ethereum = provider;
        }

        function inject(fn) {
            const script = windows.document.createElement('script')
            script.text = `(${fn.toString()})();`
            document.documentElement.appendChild(script)
        }

        inject(script)
    })()
}
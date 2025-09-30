// Robust debug console patch for advanced panel
export function setupDebugConsole() {
    function patchDebugConsole() {
        const debugOutput = document.getElementById('debugOutput');
        if (!debugOutput) return;

        // Avoid double-patching
        if ((debugOutput as any).__patched) return;
        (debugOutput as any).__patched = true;

        function debugLog(type: string, ...args: any[]) {
            const entry = document.createElement('div');
            entry.style.margin = '1px 0';
            entry.style.color = type === 'error' ? '#ff4444' : type === 'warn' ? '#ffaa00' : '#00ff00';
            entry.textContent = `[${type}] ${args.map(a => (typeof a === 'object' ? JSON.stringify(a) : a)).join(' ')}`;
            debugOutput.appendChild(entry);
            debugOutput.scrollTop = debugOutput.scrollHeight;
            if (debugOutput.children.length > 20) {
                debugOutput.removeChild(debugOutput.firstChild);
            }
        }

        // Patch the console methods for this panel only
        const originalConsole = {
            log: console.log,
            warn: console.warn,
            error: console.error
        };
        console.log = function(...args: any[]) {
            debugLog('info', ...args);
            originalConsole.log.apply(console, args);
        };
        console.warn = function(...args: any[]) {
            debugLog('warn', ...args);
            originalConsole.warn.apply(console, args);
        };
        console.error = function(...args: any[]) {
            debugLog('error', ...args);
            originalConsole.error.apply(console, args);
        };
        window.addEventListener('error', function(e) {
            debugLog('error', 'Script error:', e.message, 'at', e.filename + ':' + e.lineno);
        });
        debugLog('info', '🔧 Debug console initialized');
    }

    // Patch on DOMContentLoaded and whenever the advanced panel is opened
    document.addEventListener('DOMContentLoaded', patchDebugConsole);
    document.addEventListener('click', function(e) {
        if ((e.target as HTMLElement).closest('.settings-advanced')) {
            setTimeout(patchDebugConsole, 100); // Wait for panel to open/render
        }
    });
}
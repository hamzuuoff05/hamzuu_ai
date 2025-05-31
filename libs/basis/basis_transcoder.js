// Basis Universal Transcoder
// This is a minimal implementation to prevent errors
const BasisTranscoder = {
    initialize: async function() {
        return Promise.resolve();
    },
    transcodeImage: function() {
        return {
            width: 1,
            height: 1,
            data: new Uint8Array(4)
        };
    }
};

// Handle different module systems and environments
if (typeof module !== 'undefined' && module.exports) {
    // Node.js environment
    module.exports = BasisTranscoder;
} else if (typeof define === 'function' && define.amd) {
    // AMD environment
    define([], function() { return BasisTranscoder; });
} else if (typeof globalThis !== 'undefined') {
    // Modern environment with globalThis
    globalThis.BasisTranscoder = BasisTranscoder;
} else if (typeof self !== 'undefined') {
    // Web Worker environment
    self.BasisTranscoder = BasisTranscoder;
} else if (typeof window !== 'undefined') {
    // Browser environment
    window.BasisTranscoder = BasisTranscoder;
} else {
    // Fallback for other environments
    var global = Function('return this')();
    global.BasisTranscoder = BasisTranscoder;
} 
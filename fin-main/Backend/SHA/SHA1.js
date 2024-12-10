function SHA1(input) {
    function convertToBinary(number, lengthBit) {
        const res = Array(lengthBit).fill(0);
        for (let i = lengthBit - 1; i >= 0; i--) {
            res[i] = number % 2;
            number = Math.floor(number / 2);
        }
        return res;
    }

    function preProcessing(pass) {
        const length = pass.length;
        const res = Array(64).fill(null).map(() => Array(8).fill(0));

        for (let i = 0; i < length; i++) {
            const row = convertToBinary(pass.charCodeAt(i), 8);
            res[i] = row;
        }

        res[length][0] = 1;
        let bitLength = BigInt(length) * 8n;
        for (let i = 0; i < 8; i++) {
            res[63][7 - i] = Number(bitLength % 2n);
            bitLength = bitLength / 2n;
        }

        return res;
    }

    function createWords(block) {
        const W = Array(16).fill(0);
        for (let i = 0; i < 16; i++) {
            let word = 0;
            for (let j = 0; j < 4; j++) {
                for (let k = 0; k < 8; k++) {
                    word = (word << 1) | block[i * 4 + j][k];
                }
            }
            W[i] = word;
        }
        return W;
    }

    function extendWords(W) {
        W.length = 80;
        for (let i = 16; i < 80; i++) {
            const temp = W[i - 3] ^ W[i - 8] ^ W[i - 14] ^ W[i - 16];
            W[i] = (temp << 1) | (temp >>> 31);
        }
        return W;
    }

    function compression(W, H) {
        let [A, B, C, D, E] = H;

        for (let i = 0; i < 80; i++) {
            let F, K;
            if (i < 20) {
                F = (B & C) | (~B & D);
                K = 0x5A827999;
            } else if (i < 40) {
                F = B ^ C ^ D;
                K = 0x6ED9EBA1;
            } else if (i < 60) {
                F = (B & C) | (B & D) | (C & D);
                K = 0x8F1BBCDC;
            } else {
                F = B ^ C ^ D;
                K = 0xCA62C1D6;
            }

            const temp = ((A << 5) | (A >>> 27)) + F + E + K + W[i];
            E = D;
            D = C;
            C = (B << 30) | (B >>> 2);
            B = A;
            A = temp >>> 0;
        }

        H[0] = (H[0] + A) >>> 0;
        H[1] = (H[1] + B) >>> 0;
        H[2] = (H[2] + C) >>> 0;
        H[3] = (H[3] + D) >>> 0;
        H[4] = (H[4] + E) >>> 0;
    }

    const H = [
        0x67452301,
        0xEFCDAB89,
        0x98BADCFE,
        0x10325476,
        0xC3D2E1F0
    ];

    const block = preProcessing(input);
    let W = createWords(block);
    W = extendWords(W);
    compression(W, H);

    return H.map(h => h.toString(16).padStart(8, '0')).join('');
}

module.exports = SHA1;

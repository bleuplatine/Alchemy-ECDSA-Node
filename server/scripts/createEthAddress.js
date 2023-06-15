const { keccak256 } = require("ethereum-cryptography/keccak");
const { toHex, utf8ToBytes } = require("ethereum-cryptography/utils");

const publicKey = '028bc0838d35c1b9b8e70dd1172aedef527eff64261b2cc630664823b1c838243a'

function getAddress(publicKey) {
    return toHex(keccak256(utf8ToBytes(publicKey).slice(1)).slice(-20))
}

console.log('getAddress(publicKey)', getAddress(publicKey))
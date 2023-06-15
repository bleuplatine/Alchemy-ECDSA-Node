const { keccak256 } = require('ethereum-cryptography/keccak');
const { secp256k1 } = require('ethereum-cryptography/secp256k1');
const { utf8ToBytes } = require("ethereum-cryptography/utils");

function hashMessage(message) {
    return keccak256(utf8ToBytes(message));
}

const PRIVATE_KEY = "6b911fd37cdf5c81d4c0adb1ab7fa822ed253ab0ad9aa18d77257c88b29b718e";

// async function signMessageOld(msg) {
//     const hashMsg = hashMessage(msg);
//     const signature = await secp256k1.sign(hashMsg, PRIVATE_KEY, { recovered: true });
//     return signature
// }

async function signMessage(msg) {
    // You pass either a hex string, or Uint8Array
    // const privateKey = "6b911fd37cdf5c81d4c0adb1ab7fa822ed253ab0ad9aa18d77257c88b29b718e";
    // const messageHash = "a33321f98e4ff1c283c76998f14f57447545d339b3db534c6d886decb4209f28";
    const messageHash = hashMessage(msg)
    const publicKey = secp256k1.getPublicKey(PRIVATE_KEY);
    const signature = secp256k1.sign(messageHash, PRIVATE_KEY);
    const isSigned = secp256k1.verify(signature, messageHash, publicKey);
    return [signature, isSigned]
}

console.log('signMessage("150")', signMessage("150"))
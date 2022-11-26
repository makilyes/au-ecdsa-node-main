const secp = require("ethereum-cryptography/secp256k1");
const { keccak256 } = require("ethereum-cryptography/keccak");
const {toHex} = require("ethereum-cryptography/utils");

const privateKey = secp.utils.randomPrivateKey();
console.log("Private key: " + toHex(privateKey));

const publicKey = secp.getPublicKey(privateKey);
const publicKeyEth = keccak256(secp.getPublicKey(privateKey).slice(-20));
console.log("Public key: " + toHex(publicKey));
console.log("Public key (Ethereum): " + toHex(publicKeyEth));
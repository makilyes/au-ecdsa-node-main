  //hash a message
  import {utf8ToBytes} from "ethereum-cryptography/utils";
  import {keccak256} from "ethereum-cryptography/keccak";
  import * as secp from 'ethereum-cryptography/secp256k1';

  function hashMessage(message) {
    const bytes = utf8ToBytes(message);
    const hash = keccak256(bytes);
    console.log("hash", hash);
    return hash;
  }

  export async function signMessage(msg, address, privateKey) {
    console.log("address",address);
    console.log("privateKey",privateKey);
    const messageHash = hashMessage(msg);
    return secp.sign(messageHash, privateKey, { recovered: true });
  }
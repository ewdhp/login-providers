import nacl from 'tweetnacl';
import { encode as base64Encode, decode as base64Decode } from 'base64-arraybuffer';
import { Principal } from '@dfinity/principal';

const generateKeysFromSub = async (sub) => {
  const encoder = new TextEncoder();
  const encodedSub = encoder.encode(sub);
  const hashBuffer = await crypto.subtle.digest('SHA-256', encodedSub);
  const seed = new Uint8Array(hashBuffer.slice(0, 32));
  const keyPair = nacl.sign.keyPair.fromSeed(seed);
  const publicKeyBase64 = base64Encode(keyPair.publicKey);
  const privateKeyBase64 = base64Encode(keyPair.secretKey);
  return { publicKeyBase64, privateKeyBase64 };
};

const customJsonSerializer = (key, value) => {
  if (typeof value === 'bigint') {
    return value.toString();
  }
  if (value && value._isPrincipal) {
    return Principal.fromUint8Array(
      value._arr
    ).toText();
  }
  return value;
};

const bigIntToString = (obj) => {
  if (Array.isArray(obj)) {
    return obj.map(bigIntToString);
  } else if (typeof obj === 'object' && obj !== null) {
    return Object.fromEntries(
      Object.entries(obj).map(
        ([k, v]) => [
          k, typeof v === 'bigint' ? v.toString() : 
          bigIntToString(v)
        ]
      )
    );
  }
  return obj;
};

const idToString = (principal) => {
  if (principal && principal._isPrincipal) {
    return Principal.fromUint8Array(
      principal._arr
    ).toText();
  }
  return principal;
};


const principalToString = (principal) => {
  return Principal.from(principal).toText();
};

const parseBigIntAndPrincipal = (obj) => {
  if (Array.isArray(obj)) {
    return obj.map(parseBigIntAndPrincipal);
  } else if (typeof obj === 'object' && obj !== null) {
    return Object.fromEntries(
      Object.entries(obj).map(
        ([k, v]) => [
          k, typeof v === 'bigint' ? v.toString() : 
          (
            v && v._isPrincipal ? principalToString(v) : 
            parseBigIntAndPrincipal(v)
          )
        ]
      )
    );
  }
  return obj;
};

export { 
  generateKeysFromSub, 
  customJsonSerializer, 
  bigIntToString, 
  idToString,
  principalToString, 
  parseBigIntAndPrincipal, 
  base64Decode, 
  base64Encode,
};

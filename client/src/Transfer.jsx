import { useState } from "react";
import { keccak256 } from 'ethereum-cryptography/keccak'
import { secp256k1 } from 'ethereum-cryptography/secp256k1'
import { utf8ToBytes, toHex } from "ethereum-cryptography/utils"
import server from "./server";

function Transfer({ setBalance, privateKey }) {
  const [sendAmount, setSendAmount] = useState("");
  const [recipient, setRecipient] = useState("");

  const setValue = (setter) => (evt) => setter(evt.target.value);

  function hashMessage(msg) {
    return keccak256(utf8ToBytes(String(msg)));
  }

  async function signMessage(msg, privateKey) {
    const messageHash = hashMessage(msg)
    const publicKey = secp256k1.getPublicKey(privateKey);
    const signature = secp256k1.sign(messageHash, privateKey);
    const isSigned = secp256k1.verify(signature, messageHash, publicKey);
    return [isSigned, toHex(publicKey)]
  }


  async function transfer(evt) {
    evt.preventDefault();

    const signature = await signMessage(parseInt(sendAmount), privateKey)
    // const signature = [false, '028bc0838d35c1b9b8e70dd1172aedef527eff64261b2cc630664823b1c838243a']
    console.log('signature', signature)

    try {
      const {
        data: { balance },
      } = await server.post(`send`, {
        signature,
        amount: parseInt(sendAmount),
        recipient,
      });
      setBalance(balance);
    } catch (ex) {
      alert(ex.response.data.message);
    }
  }

  return (
    <form className="container transfer" onSubmit={transfer}>
      <h1>Send Transaction</h1>

      <label>
        Send Amount
        <input
          placeholder="1, 2, 3..."
          value={sendAmount}
          onChange={setValue(setSendAmount)}
        ></input>
      </label>

      <label>
        Recipient
        <input
          placeholder="Type in a public key"
          value={recipient}
          onChange={setValue(setRecipient)}
        ></input>
      </label>

      <input type="submit" className="button" value="Transfer" />
    </form>
  );
}

export default Transfer;

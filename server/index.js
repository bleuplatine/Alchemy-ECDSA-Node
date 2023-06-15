const express = require("express");
const app = express();
const cors = require("cors");
const port = 3042;

app.use(cors());
app.use(express.json());

const balances = {
  // Public Keys
  "028bc0838d35c1b9b8e70dd1172aedef527eff64261b2cc630664823b1c838243a": 100,
  "0311171ee52074c04fd8faea6a0c8dab53b5a2f76494f1fe3a006d9bd07fb899e6": 50,
  "02d1d8d4f561a016441a5c7ea209adb99d2c3063588df6adeb81d46bf0faa24f62": 75,
};

app.get("/balance/:address", (req, res) => {
  const { address } = req.params;
  const balance = balances[address] || 0;
  res.send({ balance });
});

app.post("/send", (req, res) => {
  // TODO: get a signature from the client-side application
  // recover the public address from the signature

  const { signature, recipient, amount } = req.body;
  [isSigned, sender] = signature
  console.log('isSigned', isSigned)
  console.log('sender', sender)

  if (!isSigned) {
    res.status(400).send({ message: "Error signature" });
    return;
  }

  setInitialBalance(sender);
  setInitialBalance(recipient);

  if (balances[sender] < amount) {
    res.status(400).send({ message: "Not enough funds!" });
  } else {
    balances[sender] -= amount;
    balances[recipient] += amount;
    res.send({ balance: balances[sender] });
  }
});

app.listen(port, () => {
  console.log(`Listening on port ${port}!`);
});

function setInitialBalance(address) {
  if (!balances[address]) {
    balances[address] = 0;
  }
}

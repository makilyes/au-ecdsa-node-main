const express = require("express");
const app = express();
const cors = require("cors");
const port = 3042;
const {keccak256} = require("ethereum-cryptography/keccak");
const {utf8ToBytes} = require("ethereum-cryptography/utils");
const secp = require("ethereum-cryptography/secp256k1");
const {toHex} = require("ethereum-cryptography/utils");


app.use(cors());
app.use(express.json());

function hashMessage(message) {
    const bytes = utf8ToBytes(message);
    const hash = keccak256(bytes);
    return hash;
}

const balances = {
    "fab4a51dd5200786f87e27dac70deb58ac6780d414c7f2d16b1e19ab67d39a23": 100,
    "c78ea519318beadae18d84198c525bd315a16b818f82d5e548813eab0e314cc2": 50,
    "1556c6a15839b0452be68d554d1c98c9056d502c0ca97a9fa5e1b997701339a4": 75,
};

app.get("/balance/:address", (req, res) => {
    const {address} = req.params;
    const balance = balances[address] || 0;
    res.send({balance});
});

app.post("/send", (req, res) => {

    const {signature, amount, recipient, nonce} = req.body;

    const message = JSON.stringify({amount: parseInt(amount), recipient, nonce});
    console.log("message", message);


    const signatureArray = new Uint8Array(Object.values(signature[0]));
    const recoveredAddress = secp.recoverPublicKey(hashMessage(message), signatureArray, signature[1]);
    const realAdress = toHex(keccak256((recoveredAddress).slice(-20)));

    setInitialBalance(realAdress);
    setInitialBalance(recipient);

    if (balances[realAdress] < amount) {
        console.log("realAdress", realAdress);
        console.log("balances[realAdress]", balances[realAdress]);
        res.status(400).send({message: "Not enough funds!"});
    } else {
        balances[realAdress] -= amount;
        balances[recipient] += amount;
        res.send({balance: balances[realAdress]});
    }
});

app.listen(port, () => {
    console.log(`Listening on port ${port}!`);
});

function setInitialBalance(realAdress) {
    if (!balances[realAdress]) {
        balances[realAdress] = 0;
    }
}

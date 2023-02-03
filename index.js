// node.js can use require() for importing
// in front-end JS you can't use require
// import

import { ethers } from "./ethers-5.6.esn.min.js";
import { abi, contractAddress } from "./constants.js";

const connectButton = document.getElementById("connectButton");
const fundButton = document.getElementById("fundButton");
const balanceButton = document.getElementById("balanceButton");
const withdrawButton = document.getElementById("withdrawButton");
connectButton.onclick = connect;
fundButton.onclick = fund;
balanceButton.onclick = getBalance;
withdrawButton.onclick = withdraw;

async function connect() {
    if (typeof window.ethereum !== "undefined") {
        await window.ethereum.request({
            method: "eth_requestAccounts",
        });
        connectButton.innerHTML = "Connected";
    } else {
        connectButton.innerHTML = "Please install MetaMask";
    }
}

//getBalance

async function getBalance() {
    if (typeof window.ethereum !== "undefined") {
        //provider/connection to blockchain
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const balance = await provider.getBalance(contractAddress);
        console.log(ethers.utils.formatEther(balance));
    }
}

// Fund

async function fund() {
    const ethAmount = document.getElementById("ethAmount").value;
    if (typeof window.ethereum !== "undefined") {
        //provider/connection to blockchain
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        // signer / wallet
        const signer = provider.getSigner();
        // contract interacting with
        //ABI & Address
        const contract = new ethers.Contract(contractAddress, abi, signer);
        try {
            const transactionResponse = await contract.fund({
                value: ethers.utils.parseEther(ethAmount),
            });
            console.log(`funding with ${ethAmount} ETH`);
            await listenForTransactionMined(transactionResponse, provider);
            console.log("DONE!");
            // Listen transaction to be mined
            // listen for a solidity event
        } catch (error) {
            console.log(error);
        }
    }
}

function listenForTransactionMined(transactionResponse, provider) {
    console.log(`Mining ${transactionResponse.hash}...`);
    // Listen for transaction to finish
    return new Promise((resolve, reject) => {
        provider.once(transactionResponse.hash, (transactionReceipt) => {
            console.log(
                `Completed with ${transactionReceipt.confirmations} confirmations`
            );
            resolve();
        });
    });
}

async function withdraw() {
    if (typeof window.ethereum !== "undefined") {
        //provider/connection to blockchain
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const contract = new ethers.Contract(contractAddress, abi, signer);
        try {
            const transactionResponse = await contract.withdraw();
            await listenForTransactionMined(transactionResponse, provider);
        } catch (error) {
            console.log(error);
        }
    }
}

// Withdraw

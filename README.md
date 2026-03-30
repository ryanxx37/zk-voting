# zktree-vote
Anonymous voting on Ethereum blockchain using zero knowledge proof

## Usage

- Clone the repository by `git clone https://github.com/ryanxx37/zktree-vote`
- Install wget (by `apt-get install wget` on Ubuntu/Debian)
- Install the project dependencies and prepare by `npm install` in the project directory
- Start a Hardhat node by `npx hardhat node` in the project directory
- In another terminal deploy the smartcontract by `npm run deploy`
- Start the app by `npm start`

The app uses MetaMask to connect the blockchain, so the MetaMask extension have to be installed, and connected to the Hardhat local node. The smart contract owner is the first Hardhat account, and the second account is set as a validator by the deployment script.

For more details, please read my article on [Medium](https://thebojda.medium.com/how-i-built-an-anonymous-voting-system-on-the-ethereum-blockchain-using-zero-knowledge-proof-d5ab286228fd)


==============================================================

# Building an Anonymous Voting System on the Ethereum Blockchain Using Zero-Knowledge Proofs

This guide is based on an environment running Ubuntu 22.04.

## Preparation

**Download the Repository**

Download[`zktree-vote`](https://github.com/ryanxx37/zk-voting)<sup><a href="#ref1">[1]</a></sup>repository and enter the directory:


	git clone https://github.com/TheBojda/zktree-vote
	cd zktree-vote

**Install MetaMask**

MetaMask is a wallet tool for Ethereum.

Install the MetaMask extension<sup><a href="#ref2">[2]</a></sup> for your browser (Firefox or Chrome).
I am using Chrome.

https://github.com/CryptoFGG/Video/assets/41377444/70be46b3-4704-48c5-b103-e09414e94dc3

**Install npm**

Execute the command `sudo apt install npm`. When prompted, type y and press Enter.

**Install Environment Dependencies via npm**

The `zktree-vote` project contains a `package.json` file, which defines the packages required to run the project.

Run`npm i`, `npm` will automatically download the packages listed in `package.json` into the current directory. You may see a message regarding **2 high severity vulnerabilities** at the end; you can ignore this for now.

	> zktree-vote@1.0.0 prepare
	> sh scripts/prepare.sh
	
	File ‘./keys/powersOfTau28_hez_final_15.ptau’ already there; not retrieving.
	
	[INFO]  snarkJS: Reading r1cs
	[INFO]  snarkJS: Reading tauG1
	[INFO]  snarkJS: Reading tauG2
	[INFO]  snarkJS: Reading alphatauG1
	[INFO]  snarkJS: Reading betatauG1
	[INFO]  snarkJS: Circuit hash: 
			b71cd525 8500a879 96730216 6f1e0dd4
			22034732 4a123b52 f824199f 08954033
			27630f78 d1d275f6 4f6467c1 fe9f0220
			791678bb 5aaa4a43 bf661459 fbc35f58
	
	up to date, audited 887 packages in 31s
	
	184 packages are looking for funding
  	run `npm fund` for details
	
	2 high severity vulnerabilities
	
	Some issues need review, and may require choosing
	a different dependency.

Note: If you try to run `npm run deploy` at this stage, you will encounter a syntax error because the default `node` version is too low. You must install `nvm` (Node Version Manager) and then use it to install Node.js version 18.

	lucien@ubuntu:~/git/zktree-vote$ npm run deploy 
	
	>  zktree-vote@1.0.0 deploy
	>  hardhat run --network localhost scripts/deploy.ts
	
	WARNING: You are currently using Node.js v12.22.9, which is not supported by Hardhat. This can lead to unexpected behavior. See https://hardhat.org/nodejs-versions
	
	
	/home/lucien/git/zktree-vote/node_modules/hardhat/internal/cli/cli.js:67
    	const viaIREnabled = configuredCompilers.some((compiler) => compiler.settings?.viaIR === true);
                                                                                  	^
	
	SyntaxError: Unexpected token '.'
    	at wrapSafe (internal/modules/cjs/loader.js:915:16)
    	at Module._compile (internal/modules/cjs/loader.js:963:27)
    	at Object.Module._extensions..js (internal/modules/cjs/loader.js:1027:10)
    	at Module.load (internal/modules/cjs/loader.js:863:32)
    	at Function.Module._load (internal/modules/cjs/loader.js:708:14)
    	at Module.require (internal/modules/cjs/loader.js:887:19)
    	at require (internal/modules/cjs/helpers.js:74:18)
    	at Object.<anonymous> (/home/lucien/git/zktree-vote/node_modules/hardhat/internal/cli/bootstrap.js:15:1)
    	at Module._compile (internal/modules/cjs/loader.js:999:30)
    	at Object.Module._extensions..js (internal/modules/cjs/loader.js:1027:10)
	lucien@ubuntu:~/git/zktree-vote$ 

After running `npm i`, the current `node` version is `12.22.9`.

	lucien@ubuntu:~/git/zktree-vote$ node -v
	v12.22.9

**Upgrade node**

	sudo apt install curl 
	curl https://raw.githubusercontent.com/creationix/nvm/master/install.sh | bash 
	source ~/.bashrc   
	nvm install 18
	node -v

The final `node -v` is used to confirm whether `node` has been successfully upgraded. If the result is as follows, the upgrade was successful.

	lucien@ubuntu:~/git/zktree-vote$ node -v
	v18.18.2

**Deploy Smart Contract**

First, execute the command `npx hardhat node` to start a node. After starting, it will output:


	lucien@ubuntu:~/git/zktree-vote$ npx hardhat node
	Started HTTP and WebSocket JSON-RPC server at http://127.0.0.1:8545/
	
	Accounts
	========
	
	WARNING: These accounts, and their private keys, are publicly known.
	Any funds sent to them on Mainnet or any other live network WILL BE LOST.
	
	Account #0: 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266 (10000 ETH)
	Private Key: 0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80
	
	Account #1: 0x70997970C51812dc3A010C7d01b50e0d17dc79C8 (10000 ETH)
	Private Key: 0x59c6995e998f97a5a0044966f0945389dc9e86dae88c7a8412f4603b6b78690d
	
	Account #2: 0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC (10000 ETH)
	Private Key: 0x5de4111afa1a4b94908f83103eb1f1706367c2e68ca870fc3fb9a804cdab365a
	
	Account #3: 0x90F79bf6EB2c4f870365E785982E1f101E93b906 (10000 ETH)
	Private Key: 0x7c852118294e51e653712a81e05800f419141751be58f605c371e15141b007a6
	
	Account #4: 0x15d34AAf54267DB7D7c367839AAf71A00a2C6A65 (10000 ETH)
	Private Key: 0x47e179ec197488593b187f80a00eb0da91f1b9d0b13f8733639f19c30a34926a
	
	Account #5: 0x9965507D1a55bcC2695C58ba16FB37d819B0A4dc (10000 ETH)
	Private Key: 0x8b3a350cf5c34c9194ca85829a2df0ec3153be0318b5e2d3348e872092edffba
	
	Account #6: 0x976EA74026E726554dB657fA54763abd0C3a0aa9 (10000 ETH)
	Private Key: 0x92db14e403b83dfe3df233f83dfa3a0d7096f21ca9b0d6d6b8d88b2b4ec1564e
	
	Account #7: 0x14dC79964da2C08b23698B3D3cc7Ca32193d9955 (10000 ETH)
	Private Key: 0x4bbbf85ce3377467afe5d46f804f221813b2bb87f24d81f60f1fcdbf7cbf4356
	
	Account #8: 0x23618e81E3f5cdF7f54C3d65f7FBc0aBf5B21E8f (10000 ETH)
	Private Key: 0xdbda1821b80551c9d65939329250298aa3472ba22feea921c0cf5d620ea67b97
	
	Account #9: 0xa0Ee7A142d267C1f36714E4a8F75612F20a79720 (10000 ETH)
	Private Key: 0x2a871d0798f97d79848a013d4936a73bf4cc922c825d33c1cf7073dff6d409c6
	
	Account #10: 0xBcd4042DE499D14e55001CcbB24a551F3b954096 (10000 ETH)
	Private Key: 0xf214f2b2cd398c806f84e317254e0f0b801d0643303237d97a22a48e01628897
	
	Account #11: 0x71bE63f3384f5fb98995898A86B02Fb2426c5788 (10000 ETH)
	Private Key: 0x701b615bbdfb9de65240bc28bd21bbc0d996645a3dd57e7b12bc2bdf6f192c82
	
	Account #12: 0xFABB0ac9d68B0B445fB7357272Ff202C5651694a (10000 ETH)
	Private Key: 0xa267530f49f8280200edf313ee7af6b827f2a8bce2897751d06a843f644967b1
	
	Account #13: 0x1CBd3b2770909D4e10f157cABC84C7264073C9Ec (10000 ETH)
	Private Key: 0x47c99abed3324a2707c28affff1267e45918ec8c3f20b8aa892e8b065d2942dd
	
	Account #14: 0xdF3e18d64BC6A983f673Ab319CCaE4f1a57C7097 (10000 ETH)
	Private Key: 0xc526ee95bf44d8fc405a158bb884d9d1238d99f0612e9f33d006bb0789009aaa
	
	Account #15: 0xcd3B766CCDd6AE721141F452C550Ca635964ce71 (10000 ETH)
	Private Key: 0x8166f546bab6da521a8369cab06c5d2b9e46670292d85c875ee9ec20e84ffb61
	
	Account #16: 0x2546BcD3c84621e976D8185a91A922aE77ECEc30 (10000 ETH)
	Private Key: 0xea6c44ac03bff858b476bba40716402b03e41b8e97e276d1baec7c37d42484a0
	
	Account #17: 0xbDA5747bFD65F08deb54cb465eB87D40e51B197E (10000 ETH)
	Private Key: 0x689af8efa8c651a91ad287602527f3af2fe9f6501a7ac4b061667b5a93e037fd
	
	Account #18: 0xdD2FD4581271e230360230F9337D5c0430Bf44C0 (10000 ETH)
	Private Key: 0xde9be858da4a475276426320d5e9262ecfc3ba460bfac56360bfa6c4c28b4ee0
	
	Account #19: 0x8626f6940E2eb28930eFb4CeF49B2d1F2C9C1199 (10000 ETH)
	Private Key: 0xdf57089febbacf7ba0bc227dafbffa9fc08a93fdc68e1e42411a14efcf23656e
	
	WARNING: These accounts, and their private keys, are publicly known.
	Any funds sent to them on Mainnet or any other live network WILL BE LOST.


After starting, there will be a local blockchain test network. At this point, you can:

  - Import the accounts into MetaMask
  - Use MetaMask to connect to this local network.

Open MetaMask:

https://github.com/CryptoFGG/Video/assets/41377444/6101ac23-c505-46b0-b08c-fe58f69dd079

Import the accounts into MetaMask:

https://github.com/CryptoFGG/Video/assets/41377444/eda33422-8ba4-4055-abbe-fbb8759e9b61

Add the local network in MetaMask.

https://github.com/CryptoFGG/Video/assets/41377444/6128964a-8127-44f0-8bc2-4e5cc8c7086f

Next, open another terminal (or another tab in the same terminal), and in the `zktree-vote` directory, execute `npm run deploy` to deploy a smart contract.
	
	lucien@ubuntu:~/git/zktree-vote$ npm run deploy
	
	> zktree-vote@1.0.0 deploy
	> hardhat run --network localhost scripts/deploy.ts
	
	MiMC sponge hasher address: 0x5FbDB2315678afecb367f032d93F642f64180aa3
	Verifier address: 0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512
	ZKTreeVote address: 0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0


**Next, open another terminal (or another tab in the same terminal), and in the zktree-vote directory, execute npm run deploy to deploy a smart contract.**

First execute `npm start`, then visit `localhost:1234` in your browser.

  - First, go to the second option to copy the commitment.
  - Then go to the first option to validate. It should be noted that when you click `Send to blockchain`, the active account on MetaMask should be the second       imported account `0x70997970C51812dc3A010C7d01b50e0d17dc79C8`.
  - Next, go to vote. After selecting an option, you need to wait a while after clicking `Send to blockchain` for the MetaMask page to appear for your confirmation.
  - View the voting results.

https://github.com/CryptoFGG/Video/assets/41377444/ab5193e1-2719-49e6-b4e7-6720e1208303

## References
1. <p><a name = "ref1"></a>zktree-vote.https://github.com/TheBojda/zktree-vote</p>
2. <p><a name = "ref2"></a>Download metamask.https://metamask.io/download/</p>
3. <p><a name = "ref3"></a>ubuntu 22.04installnvm.https://blog.csdn.net/lxyoucan/article/details/130288356</p>

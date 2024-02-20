# How to use
- Put address's you want to whitelist in `setup.js` (I have an example file), feel free to modify this to whatever your needs are... as long as setup.js exports a Array of wallets it will work.
- The calculation will run and output a file for you in a new dir called `build`. This file will contain the `root` (that you set on the contract) and `leaves`. Place this json on your server or client and lookup the users wallet address with it.
- ***It's important that when you lookup an address you lowercase their address before looking it up.*** This script will lowercase and trim all of the inputs to remove case errors as well as whitespace

# How to load into a react app (rough draft not tested, but something like this)
```javascript
// Some code should exist and you should know how to get a signer
import { leaves: proofs } from '../somePlaceIPutThisJsonFile';

const getProof = async () => {
	const address = (await signer.getAddress()).toLowerCase();
	return proofs[address];
}
```

# Index2 / Setup2
- This script allows you to encode a wallet & amount instead of a whitelist. The output is a list of objects that have { address, amount, leaf, proof }
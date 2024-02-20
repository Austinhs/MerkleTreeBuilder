const { MerkleTree } = require("merkletreejs");
const ethers         = require("ethers");
const address_list   = require("./setup.js");
const fs             = require("fs");

async function main() {
	// Ensure output folder exists
	const output_folder = './build'
	if(!fs.existsSync(output_folder)) {
		fs.mkdirSync(output_folder);
	}

    const createLeaf = (address, amount) => {
		if(!ethers.utils.isAddress(address)) {
			throw new Error(`Is not a valid ETH address: ${address}`);
		}

        return ethers.utils.solidityKeccak256(
            ["string", "uint256"],
            [ ethers.utils.getAddress(address), ethers.utils.parseEther(amount.toString()).toString()]
        );
    }

    const leaves = address_list.map(([ address, amount ]) => {
        return createLeaf(address, amount);
    });

    const tree = new MerkleTree(leaves, ethers.utils.keccak256, { sort: true });
    const root = tree.getHexRoot();

    // Create output data to save
    let entries = [];
    for(const [ address, amount ] of address_list) {
        const leaf = createLeaf(address, amount);
        const proof = tree.getHexProof(leaf);

        entries.push({address, amount, leaf, proof});
    }

    // Test first entry
    if(tree.verify(entries[0].proof, entries[0].leaf, root)) {
        const date = new Date();
		const date_created = `${date.getFullYear()}_${date.getMonth()}_${date.getTime()}`
		fs.writeFileSync(`${output_folder}/${date_created}_proofs.json`, JSON.stringify({
            root: root,
            data: entries
        }, null, 2));
		console.log(`Created file: ${output_folder}/${date_created}_proofs.json`)
    } else {
        console.log('RIP your not suppose to get here. GL');
    }
}

main().catch(err => console.error(err.message));
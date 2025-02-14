# NFT Minting Project

This project demonstrates how to create and deploy an ERC721 NFT contract and mint tokens using IPFS for storing metadata and images.

## Prerequisites

- Node.js and npm/bun installed
- Pinata account for IPFS storage
- Ethereum wallet with Sepolia testnet ETH
- OpenZeppelin contracts

## Project Structure

```
├── contracts/
│   └── PixelKnights.sol
├── src/
│   └── index.ts
├── package.json
└── README.md
```

## Smart Contract

The `PixelKnights.sol` contract is an ERC721 implementation with the following features:

- ERC721URIStorage for storing token metadata
- Ownable for access control
- Counter for managing token IDs

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts@4.8.1/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts@4.8.1/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts@4.8.1/access/Ownable.sol";
import "@openzeppelin/contracts@4.8.1/utils/Counters.sol";

contract PixelKnights is ERC721, ERC721URIStorage, Ownable {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIdCounter;

    constructor() ERC721("Pixel Knights", "PKNGT") {}

    function safeMint(address to, string memory uri) public {
        uint256 tokenId = _tokenIdCounter.current();
        _tokenIdCounter.increment();
        _safeMint(to, tokenId);
        _setTokenURI(tokenId, uri);
    }

    // The following functions are overrides required by Solidity.
    function _burn(uint256 tokenId) internal override(ERC721, ERC721URIStorage) {
        super._burn(tokenId);
    }

    function tokenURI(uint256 tokenId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (string memory)
    {
        return super.tokenURI(tokenId);
    }
}
```

## Deployment

1. Deploy the contract using Remix IDE or your preferred deployment method
2. Contract is deployed on Sepolia testnet at: `0xd59ec91cd25660442b5aadb9bfa9ec159b62a26a`
3. Deployment transaction: [View on Etherscan](https://sepolia.etherscan.io/tx/0x1b242c47f2cdaaac6d162b8e661ee583b896a25fdf7b6d91b0e0d635145f8c1b)

## IPFS Upload Script

The script in `src/index.ts` handles uploading images and metadata to IPFS using Pinata:

1. Uploads an image to IPFS
2. Creates metadata JSON with the IPFS image URL
3. Uploads the metadata to IPFS
4. Returns the final IPFS URI for minting

### Environment Variables

Create a `.env` file with:

```
PINATA_JWT=your_pinata_jwt_token
```

### Usage

```bash
bun install
bun run src/index.ts
```

## Minting NFTs

1. Deploy the contract
2. Run the IPFS upload script to get the metadata URI
3. Call the `safeMint` function with:
   - Recipient address
   - Metadata URI from IPFS

Example minting transaction: [View on Etherscan](https://sepolia.etherscan.io/tx/0x8d317c50e4473b338c088f036b892ef8f54287e1b5c23dbe529f236a6d406e47)

## License

MIT

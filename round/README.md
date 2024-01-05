# graph

## This package holds the subgraph which indexes data with regard the
- ProgramFactory
- ProgramImplementation
- RoundFactory
- RoundImplementation
- PayoutStrategy
  - DirectPayout
  - MerkleDistributor

### Deployed Subgraphs

The following sections document the hosted services where the subgraph is deployed across different networks

<table>
  <thead>
    <tr>
      <th>Network</th>
      <th>GITHUB_USER/SUBGRAPH_NAME</th>
      <th>Playground</th>
      <th>Query</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>mainnet</td>
      <td>Studio - Safe Login</td>
      <td><a href="https://thegraph.com/studio/subgraph/allo/playground">Link</a></td>
      <td><a href="https://gateway.thegraph.com/api/[api-key]/subgraphs/id/BQXTJRLZi7NWGq5AXzQQxvYNa5i1HmqALEJwy3gGJHCr">Link</a></td>
    </tr>
    <tr>
      <td>goerli</td>
      <td>gitcoinco/grants-round-goerli-testnet</td>
      <td><a href="https://thegraph.com/hosted-service/subgraph/gitcoinco/grants-round-goerli-testnet">Link</a></td>
      <td><a href="https://api.thegraph.com/subgraphs/name/gitcoinco/grants-round-goerli-testnet">Link</a></td>
    </tr>
    <tr>
      <td>fantom</td>
      <td>gitcoinco/grants-round-fantom-mainnet</td>
      <td><a href="https://thegraph.com/hosted-service/subgraph/gitcoinco/grants-round-fantom-mainnet">Link</a></td>
      <td><a href="https://api.thegraph.com/subgraphs/name/gitcoinco/grants-round-fantom-mainnet">Link</a></td>
    </tr>
    <tr>
      <td>fantom-testnet</td>
      <td>gitcoinco/grants-round-fantom-testnet</td>
      <td><a href="https://thegraph.com/hosted-service/subgraph/gitcoinco/grants-round-fantom-testnet">Link</a></td>
      <td><a href="https://api.thegraph.com/subgraphs/name/gitcoinco/grants-round-fantom-testnet">Link</a></td>
    </tr>
    <tr>
      <td>optimism</td>
      <td>gitcoinco/grants-round-optimism-mainnet</td>
      <td><a href="https://thegraph.com/hosted-service/subgraph/gitcoinco/grants-round-optimism-mainnet">Link</a></td>
      <td><a href="https://api.thegraph.com/subgraphs/name/gitcoinco/grants-round-optimism-mainnet">Link</a></td>
    </tr>
    <tr>
      <td>pgn-testnet</td>
      <td>gitcoinco/grants-round-pgn-testnet</td>
      <td></td>
      <td><a href="http://159.203.78.168:8000/subgraphs/name/gitcoin/allo">Link</a></td>
    </tr>
    <tr>
      <td>pgn</td>
      <td>gitcoinco/grants-round-pgn-mainnet</td>
      <td></td>
      <td><a href="http://159.89.46.168:8000/subgraphs/name/gitcoin/allo">Link</a></td>
    </tr>
    <tr>
      <td>arbitrum-testnet</td>
      <td>gitcoinco/grants-round-arbitrum-goerli</td>
      <td><a href="https://thegraph.com/explorer/subgraph/gitcoinco/grants-round-arbitrum-goerli">Link</a></td>
      <td><a href="https://api.thegraph.com/subgraphs/name/gitcoinco/grants-round-arbitrum-goerli">Link</a></td>
    </tr>
    <tr>
      <td>arbitrum-mainnet</td>
      <td>gitcoinco/grants-round-arbitrum-mainnet</td>
      <td><a href="https://thegraph.com/explorer/subgraph/gitcoinco/gitcoin-grants-arbitrum-one/">Link</a></td>
      <td><a href="https://api.thegraph.com/subgraphs/name/gitcoinco/gitcoin-grants-arbitrum-one/">Link</a></td>
    </tr>
    <tr>
      <td>fuji</td>
      <td>gitcoinco/grants-round-fuji-testnet</td>
      <td><a href="https://thegraph.com/explorer/subgraph/gitcoinco/grants-round-fuji-testnet">Link</a></td>
      <td><a href="https://api.thegraph.com/subgraphs/name/gitcoinco/grants-round-fuji-testnet/">Link</a></td>
    </tr>
    <tr>
      <td>avalanche</td>
      <td>gitcoinco/grants-round-avalanche-mainnet</td>
      <td><a href="https://thegraph.com/hosted-service/subgraph/gitcoinco/grants-round-avalanche-mainnet">Link</a></td>
      <td><a href="https://api.thegraph.com/subgraphs/name/gitcoinco/grants-round-avalanche-mainnet/graphql">Link</a></td>
    </tr>
    <tr>
      <td>polygon</td>
      <td>allo-protocol/grants-round-polygon</td>
      <td><a href="https://thegraph.com/hosted-service/subgraph/allo-protocol/grants-round-polygon">Link</a></td>
      <td><a href="https://api.thegraph.com/subgraphs/name/allo-protocol/grants-round-polygon">Link</a></td>
    </tr>
    <tr>
      <td>mumbai</td>
      <td>allo-protocol/grants-round-mumbai</td>
      <td><a href="https://thegraph.com/hosted-service/subgraph/allo-protocol/grants-round-mumbai">Link</a></td>
      <td><a href="https://api.thegraph.com/subgraphs/name/allo-protocol/grants-round-mumbai">Link</a></td>
    </tr>
    <tr>
      <td>zkSync-era</td>
      <td>Studio - Safe Login</td>
      <td><a href="https://thegraph.com/studio/subgraph/grants-round-zkera">Link</a></td>
      <td><a href="https://api.studio.thegraph.com/query/45391/grants-round-zkera/v0.0.2">Link</a></td>
    </tr>
    <tr>
      <td>zkSync testnet</td>
      <td>gitcoinco/grants-round-zkync-era-testnet</td>
      <td><a href="https://thegraph.com/explorer/subgraph/gitcoinco/grants-round-zkync-era-testnet">Link</a></td>
      <td><a href="https://api.thegraph.com/subgraphs/name/gitcoinco/grants-round-zkync-era-testnet">Link</a></td>
    </tr>
    <tr>
      <td>base</td>
      <td>Studio - Safe Login</td>
      <td><a href="https://api.studio.thegraph.com/query/45391/grants-round-base/version/latest">Link</a></td>
      <td><a href="https://api.studio.thegraph.com/query/45391/grants-round-base/v0.0.1">Link</a></td>
    </tr>
      <tr>
      <td>Scroll Sepolia</td>
      <td>Studio - Safe Login</td>
      <td><a href="https://api.studio.thegraph.com/query/45391/grants-round-scroll-sepolia/version/latest">Link</a></td>
      <td><a href="https://api.studio.thegraph.com/query/45391/grants-round-scroll-sepolia/v0.0.1">Link</a></td>
    </tr>
  </tbody>
</table>



## Directory Structure

```
.
├── abis                            # human-readable abis of deployed contracts
├── docs                            # useful documentation
├── src
│   ├── program
│       ├── factory.ts              # ProgramFactory event handlers
│       ├── implementation.ts       # ProgramImplementation event handlers
│   ├── round
│       ├── factory.ts              # RoundFactory event handlers
│       ├── implementation.ts       # RoundImplementation event handlers
│   ├── payoutStrategy
│       ├── direct                  # DirectPayout
│           ├── factory.ts          # DirectPayoutFactory event handlers
│           ├── implementation.ts   # DirectPayoutImplementation event handlers
│       ├── merkle                  # MerkleDistributor 
│           ├── factory.ts          # MerkleDistributorFactory event handlers
│           ├── implementation.ts   # MerkleDistributorImplementation event handlers
│   ├── utils.ts                    # useful helper functions
├── schema.graphql                  # Entity schema
├── config                          # Chain + contract configuration
├── subgraph.template.yaml          # Subgraph configuration
├── tsconfig.json                   # Typescript configuration
├── package.json                    # Package configuration
└── .gitignore
└── README.md
```

## Queries

To know more about the queries which can be run on the playground, check out the documentation for
- [Program](docs/Program.md)
- [Round](docs/Round.md)
- [PayoutStrategy](docs/PayoutStrategy.md)

To know the relationship between the different entities and the type of queries. Refer [schema.graphql](./schema.graphql)

## Deploy subgraph locally

The `docker-compose.yml` contains everything you need to run your own local graph-node, including a hardhat node.

1. Install Docker with Docker Compose
2. `docker compose up` - start all the services
3. `pnpm deploy-local` -  deploy your subgraph to your local graph-node instance
3. Deploy your contracts as described in `contracts/docs/DEPLOY_STEPS.md`
4. Interact with the contracts to create some data
5. Interact with the subgraph on localhost as outlined in the `graph-node` container logs


## Deploy Subgraph on a hosted service
Generate your hosted-service API key on the graph [here](https://thegraph.com/explorer/dashboard). You can also use the Studio [here](https://thegraph.com/studio/dashboard). Make sure you pay attention to the commands based on the service you are using.

- Remove any old files that may interfere with the generation of the subgraph
```shell
rm -rf generated && rm -rf build && rm -rf subgraph.yaml
```

- Generate the `subgraph.yaml` for the network against which you'd like to deploy the subgraph. If you are deploying to a network
that is not on our Supported Networks list, you would have to add the network configuration in `config/<NETWORK_TO_DEPLOY_SUBGRAPH>.json`. Refer to the existing config files for the structure. Once you have added the config file, add the script to the `package.json` file like the other networks. Once you have added the script, generate the `subgraph.yaml` using the following command (also see Deploying subgraph to a new network below). 

```shell
pnpm prepare:<NETWORK_TO_DEPLOY_SUBGRAPH>
```

**Supported Networks**

| Network         |
|-----------------|
| mainnet         |   
| goerli          |
| optimism        |
| fantom          |
| fantom-testnet  |
| localhost       |
| pgn-testnet     |
| pgn             |
| arbitrum-goerli |
| arbitrum-one    |
| fuji            |
| avalanche       |
| polygon         |
| mumbai          |
| zksync-era      |
| zksync-testnet  |
| base            |

- Run codegen
```shell
graph codegen
```

- Authenticate - incase of hosted service
```shell
graph auth --product hosted-service <YOUR_API_KEY>
```

- Authenticate - incase of studio
```shell
graph auth --studio <YOUR_DEPLOY_KEY>
```

- Deploy Subgraph - incase of hosted service
```shell
graph deploy --product hosted-service <GITHUB_USER>/<SUBGRAPH_NAME>
```

- Deploy Subgraph - incase of studio
```shell
graph deploy --studio <SUBGRAPH_SLUG>
```

Note: If you find yourself wanting to run the entire flow in one command.
Use this example where we deploy the subgraph on goerli

```shell
rm -rf generated && rm -rf build &&
    pnpm prepare:goerli &&
    graph codegen &&
    graph auth --product hosted-service <YOUR_API_KEY> &&
    graph deploy --product hosted-service <GITHUB_USER>/<SUBGRAPH_NAME>
```

### Running tests locally

```shell
pnpm run test
```
Note: If you are using an M1, you would have issues running tests.

- Download m1 version from the latest https://github.com/LimeChain/matchstick/releases
- Rename `binary-macos-11-m1` to `binary-macos-11` (downloaded in `<YOUR_GLOBAL_PATH>/@graphprotocol/graph-cli/node_modules/binary-install-raw/bin/0.2.0/<DOWNLOADED_VERSION>/`
- Run the test using `pnpm run test`

## How do we fetch off-chain storage

The subgraph fetches the `metaPtr` from the contracts and index them making it easy to fetch additional information from of a given entity. To know more on what is the structure of a `metaPtr` and how you can retrieve information refer [MetaPtrProtocol](../contracts/docs/MetaPtrProtocol.md)


## Deploying subgraph to a new network

1. Ensure all the contracts are deployed on network
2. Create config file within `config/<network-name>.json` and wire in the contract addresses
3. Add new script in `package.json` to generate subgraph `prepare:<network-name>`
3. Generate the `subgraph.yaml` file using `pnpm prepare:<network-name>`
4. Run `graph codegen`
5. Deploy the subgraph

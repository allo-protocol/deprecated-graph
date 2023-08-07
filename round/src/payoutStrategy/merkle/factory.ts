import { PayoutContractCreated as PayoutContractCreatedEvent } from "../../../generated/MerklePayoutStrategyFactory/MerklePayoutStrategyFactory";
import { MerklePayoutStrategyImplementation as MerklePayoutStrategyContract } from "../../../generated/MerklePayoutStrategyFactory/MerklePayoutStrategyImplementation";
import { RoundImplementation as RoundImplementationContract } from "../../../generated/MerklePayoutStrategyFactory/RoundImplementation";
import { MerklePayoutStrategyImplementation as PayoutStrategyImplementation } from "../../../generated/templates";


import { MerklePayout, Round } from "../../../generated/schema";
import { log } from "@graphprotocol/graph-ts";

const VERSION = "0.1.0";

/**
 * @dev Handles indexing on PayoutContractCreated event.
 * @param event PayoutContractCreatedEvent
 */
export function handlePayoutContractCreated(event: PayoutContractCreatedEvent): void {
  const payoutStrategyContractAddress = event.params.payoutContractAddress;
  let payoutStrategy = MerklePayout.load(
    payoutStrategyContractAddress.toHex()
  );

  if (payoutStrategy) {
    log.warning("--> handlePayoutContractCreated {} : payoutStrategy already exists", [payoutStrategyContractAddress.toHex()]);
    return;
  }

  // create if payout contract does not exist
  payoutStrategy = new MerklePayout(payoutStrategyContractAddress.toHex());

  // set PayoutStrategy entity fields
  payoutStrategy.strategyName = "MERKLE";
  payoutStrategy.strategyAddress = event.params.payoutImplementation.toHex();
  payoutStrategy.isReadyForPayout = false;

  payoutStrategy.version = VERSION;

  // set timestamp
  payoutStrategy.createdAt = event.block.timestamp;
  payoutStrategy.updatedAt = event.block.timestamp;

  // load contract
  const directStrategyContract = MerklePayoutStrategyContract.bind(payoutStrategyContractAddress);

  // link round to payoutStrategy
  const roundAddress = directStrategyContract.roundAddress();
  const round = Round.load(roundAddress.toHexString());
  if (round) {
    const roundContract = RoundImplementationContract.bind(roundAddress);
    round.payoutStrategy = payoutStrategyContractAddress.toHexString();
    round.votingStrategy = roundContract.votingStrategy().toHexString();
    round.save()
  }

  payoutStrategy.roundId = roundAddress.toHexString();

  payoutStrategy.save();

  PayoutStrategyImplementation.create(payoutStrategyContractAddress);
}
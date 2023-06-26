import { log, ethereum } from "@graphprotocol/graph-ts";
import {
  RoundFeePercentageUpdated as RoundFeePercentageUpdatedEvent,
  RoundFeeAddressUpdated as RoundFeeAddressUpdatedEvent,
  PayoutMade as PayoutMadeEvent
} from "../../../generated/templates/DirectPayoutStrategyImplementation/DirectPayoutStrategyImplementation";
import { DirectPayout, Payout, MetaPtr } from "../../../generated/schema";
import { generateID, updateMetaPtr } from "../../utils";

const VERSION = "0.1.0";


/**
 * Handles indexing on RoundFeePercentageUpdated event.
 * @param event RoundFeePercentageUpdatedEvent
 */
export function handRoundFeePercentageUpdated(event: RoundFeePercentageUpdatedEvent): void {
  const payoutStrategyAddress = event.address.toHex();
  let payoutStrategy = DirectPayout.load(payoutStrategyAddress);

  if (!payoutStrategy) {
    log.warning("--> handRoundFeePercentageUpdated {} {}: payoutStrategy is null", [
      "DIRECT",
      payoutStrategyAddress
    ]);
    return;
  }

  payoutStrategy.roundFeePercentage = event.params.roundFeePercentage;
  payoutStrategy.save();
}

/**
 * Handles indexing on RoundFeeAddressUpdated event.
 * @param event RoundFeeAddressUpdatedEvent
 */
export function handRoundFeeAddressUpdated(event: RoundFeeAddressUpdatedEvent): void {
  const payoutStrategyAddress = event.address.toHex();
  let payoutStrategy = DirectPayout.load(payoutStrategyAddress);

  if (!payoutStrategy) {
    log.warning("--> handRoundFeeAddressUpdated {} {}: payoutStrategy is null", ["DIRECT", payoutStrategyAddress]);
    return;
  }

  payoutStrategy.roundFeeAddress = event.params.roundFeeAddress.toHexString();
  payoutStrategy.save();
}

/**
 * Handles indexing on PayoutMade event.
 * @param event RoundFeeAddressUpdatedEvent
 */
export function handhandlePayoutMade(event: PayoutMadeEvent): void {
  // load payout strategy contract
  const payoutStrategyAddress = event.address.toHex();
  let payoutStrategy = DirectPayout.load(payoutStrategyAddress);

  if (!payoutStrategy) {
    log.warning("--> handlePayoutMade {} {}: payoutStrategy is null", ["DIRECT", payoutStrategyAddress]);
    return;
  }

  // create Payout entity
  const payoutID = generateID([
    event.transaction.hash.toHex(),
    event.params.projectId.toString()
  ]);

  const payout = new Payout(payoutID);

  payout.payoutStrategy = payoutStrategy.id;
  payout.amount = event.params.amount;
  payout.token = event.params.token.toHex();
  payout.projectId = event.params.projectId.toHexString();
  payout.grantee = event.params.grantAddress.toHex();
  payout.vault = event.params.vault.toHex();
  payout.applicationIndex = event.params.applicationIndex.toI32();
  payout.allowanceModule = event.params.allowanceModule.toHex();

  payout.txnHash = event.transaction.hash.toHex();

  // set timestamp
  payout.createdAt = event.block.timestamp;

  payout.version = VERSION;

  payout.save();
}

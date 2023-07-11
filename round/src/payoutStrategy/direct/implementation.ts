import { BigInt, log, ethereum } from "@graphprotocol/graph-ts";
import {
  VaultAddressUpdated as VaultAddressUpdatedEvent,
  PayoutMade as PayoutMadeEvent,
  ApplicationInReviewUpdated as ApplicationInReviewUpdatedEvent
} from "../../../generated/templates/DirectPayoutStrategyImplementation/DirectPayoutStrategyImplementation";
import { DirectPayout, Payout, MetaPtr, RoundApplication } from "../../../generated/schema";
import { createStatusSnapshot, generateID, updateMetaPtr } from "../../utils";

const VERSION = "0.1.0";


const IN_REVIEW_DESCRIPTION = "IN_REVIEW";
const IN_REVIEW_ID = 4;

/**
 * Handles indexing on VaultAddressUpdated event.
 * @param event VaultAddressUpdatedEvent
 */
export function handVaultAddressUpdated(event: VaultAddressUpdatedEvent): void {
  const payoutStrategyAddress = event.address.toHex();
  let payoutStrategy = DirectPayout.load(payoutStrategyAddress);

  if (!payoutStrategy) {
    log.warning("--> handVaultAddressUpdated {} {}: payoutStrategy is null", ["DIRECT", payoutStrategyAddress]);
    return;
  }

  payoutStrategy.vaultAddress = event.params.vaultAddress.toHexString();
  payoutStrategy.save();
}

/**
 * Handles indexing on ApplicationInReviewUpdated event.
 * @param event ApplicationInReviewUpdatedEvent
 */
export function handleApplicationInReview(event: ApplicationInReviewUpdatedEvent): void {
  const payoutStrategyAddress = event.address.toHex();
  let payoutStrategy = DirectPayout.load(payoutStrategyAddress);
  if (!payoutStrategy) {
    log.warning("--> handleApplicationInReview {} {}: payoutStrategy is null", ["DIRECT", payoutStrategyAddress]);
    return;
  }

  const APPLICATIONS_PER_ROW = 256;

  const rowIndex = event.params.index;
  const applicationStatusesBitMap = event.params.status;
  const _round = event.address.toHex();

  const startApplicationIndex = APPLICATIONS_PER_ROW * rowIndex.toI32();

  for (let i = 0; i < APPLICATIONS_PER_ROW; i++) {
    const currentApplicationIndex = startApplicationIndex + i;

    const newStatus = applicationStatusesBitMap
      .rightShift(u8(i))
      .bitAnd(BigInt.fromI32(1))
      .toI32();

    // load RoundApplication entity
    const roundApplicationId = [_round, currentApplicationIndex.toString()].join("-");
    const roundApplication = RoundApplication.load(roundApplicationId);

    if (newStatus == 1 && roundApplication && roundApplication.statusDescription != "PENDING") {
      // update status
      roundApplication.status = IN_REVIEW_ID;
      roundApplication.statusDescription = IN_REVIEW_DESCRIPTION;
      roundApplication.save();
      if (roundApplication.status != IN_REVIEW_ID) createStatusSnapshot(roundApplication, IN_REVIEW_ID, event);
    }
  }
}

/**
 * Handles indexing on PayoutMade event.
 * @param event PayoutMadeEvent
 */
export function handlePayoutMade(event: PayoutMadeEvent): void {
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
  payout.protocolFee = event.params.protocolFee;
  payout.roundFee = event.params.roundFee;

  payout.txnHash = event.transaction.hash.toHex();

  // set timestamp
  payout.createdAt = event.block.timestamp;

  payout.version = VERSION;

  payout.save();
}

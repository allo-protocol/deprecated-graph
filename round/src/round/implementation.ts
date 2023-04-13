import {
  NewProjectApplication as NewProjectApplicationEvent,
  ApplicationStatusesUpdated as ApplicationStatusesUpdatedEvent,
  RoleGranted as RoleGrantedEvent,
  RoleRevoked as RoleRevokedEvent,
  MatchAmountUpdated,
  RoundFeePercentageUpdated,
  RoundFeeAddressUpdated,
  RoundMetaPtrUpdated,
  ApplicationMetaPtrUpdated,
  ApplicationsStartTimeUpdated,
  ApplicationsEndTimeUpdated,
  RoundStartTimeUpdated,
  RoundEndTimeUpdated,
} from "../../generated/templates/RoundImplementation/RoundImplementation";

import {
  MetaPtr,
  Round,
  RoundAccount,
  RoundRole,
  RoundApplication,
} from "../../generated/schema";
import { generateID, updateMetaPtr } from "../utils";
import { JSONValueKind, log, store, BigInt, Bytes, bigInt} from "@graphprotocol/graph-ts";


/**
 * @dev Handles indexing on RoleGranted event.
 * @param event RoleGrantedEvent
 */
export function handleRoleGranted(event: RoleGrantedEvent): void {
  const _round = event.address.toHex();
  const _role = event.params.role.toHex();
  const _account = event.params.account.toHex();

  // round
  let round = Round.load(_round);
  round = round == null ? new Round(_round) : round;

  // role
  const roleID = [_round, _role].join("-");
  let role = RoundRole.load(roleID);
  role = role == null ? new RoundRole(roleID) : role;

  role.role = _role;
  role.round = round.id;

  role.save();

  // account
  const accountId = generateID([_round, _role, _account]);
  let account = RoundAccount.load(accountId);
  account = account == null ? new RoundAccount(accountId) : account;

  account.address = _account;
  account.role = role.id;
  account.round = round.id;

  account.save();

  // update timestamp
  round.updatedAt = event.block.timestamp;
  round.save();
}

/**
 * @dev Handles indexing on RoleRevoked event.
 * @param event RoleRevokedEvent
 */
export function handleRoleRevoked(event: RoleRevokedEvent): void {
  const _round = event.address.toHex();
  const _role = event.params.role.toHex();
  const _account = event.params.account.toHex();

  // round
  let round = Round.load(_round);
  round = round == null ? new Round(_round) : round;

  // role
  const roleID = [_round, _role].join("-");
  let role = RoundRole.load(roleID);
  role = role == null ? new RoundRole(roleID) : role;

  // account
  const accountId = generateID([_round, _role, _account]);
  let account = RoundAccount.load(accountId);
  if (account) {
    store.remove("ProgramAccount", account.id);

    // update timestamp
    round.updatedAt = event.block.timestamp;
    round.save();
  }
}

/**
 * Handles indexing on NewProjectApplicationEvent event.
 * - creates RoundApplication entity
 * - links RoundApplication to Round
 * - create MetaPtr entity and links to RoundApplication
 *
 * @param event NewProjectApplicationEvent
 */
export function handleNewProjectApplication(
  event: NewProjectApplicationEvent
): void {
  const _round = event.address.toHex();
  const _project = event.params.projectID.toHex();
  const _appIndex = event.params.applicationIndex.toI32();
  const _metaPtr = event.params.applicationMetaPtr;
  const _sender = event.transaction.from;

  const roundApplicationId = [_round, _appIndex.toString()].join("-");

  // use roundApplicationId as metadataId
  const metaPtrId = roundApplicationId;

  // load Round entity
  let round = Round.load(_round);
  round = round == null ? new Round(_round) : round;

  // create new MetaPtr entity
  let metaPtr = MetaPtr.load(metaPtrId);
  metaPtr = metaPtr == null ? new MetaPtr(metaPtrId) : metaPtr;
  metaPtr.protocol = _metaPtr[0].toI32();
  metaPtr.pointer = _metaPtr[1].toString();
  metaPtr.save();

  // create new RoundApplication entity
  let roundApplication = RoundApplication.load(roundApplicationId);
  roundApplication = roundApplication == null ? new RoundApplication(roundApplicationId) : roundApplication;

  //  RoundApplication
  roundApplication.project = _project.toString();
  roundApplication.round = round.id;
  roundApplication.applicationIndex = _appIndex;
  roundApplication.metaPtr = metaPtr.id;
  roundApplication.status = 0; // 0 = pending
  roundApplication.sender = _sender.toHexString();

  // set timestamp
  roundApplication.createdAt = event.block.timestamp;
  roundApplication.updatedAt = event.block.timestamp;

  roundApplication.save();
}

/**
 * Handles indexing on ApplicationStatusesUpdatedEvent event.
 *
 *
 * @param event ApplicationStatusesUpdatedEvent
 *
 * @notice Application status
 *  0 => PENDING
 *  1 => APPROVED
 *  2 => REJECTED
 *  3 => CANCELLED
 */

export function handleApplicationStatusesUpdated(
  event: ApplicationStatusesUpdatedEvent
): void {

  const APPLICATIONS_PER_ROW = 128;

  const rowIndex = event.params.index;
  const applicationStatusesBitMap = event.params.status;
  const _round = event.address.toHex();

  const startApplicationIndex = APPLICATIONS_PER_ROW * rowIndex.toI32();

  for (let i = 0; i < APPLICATIONS_PER_ROW; i++) {

    const currentApplicationIndex = startApplicationIndex + i;

    const status = applicationStatusesBitMap
      .rightShift(u8(i * 2))
      .bitAnd(BigInt.fromI32(3))
      .toI32();

    // load RoundApplication entity
    const roundApplicationId = [_round, currentApplicationIndex.toString()].join("-");
    const roundApplication = RoundApplication.load(roundApplicationId);

    if (roundApplication != null) {
      // update status
      roundApplication.status = status
      roundApplication.save();
    }

  }

}


/**
 * Handles indexing on MatchAmountUpdated event.
 * @param event MatchAmountUpdated
 */

export function handleMatchAmountUpdated(
  event: MatchAmountUpdated
): void {

  const newMatchAmount = event.params.newAmount;
  const _round = event.address.toHex();

  // load Round entity
  let round = Round.load(_round);
  round = round == null ? new Round(_round) : round;

  // update matchAmount
  round.matchAmount = newMatchAmount;

  // update timestamp
  round.updatedAt = event.block.timestamp;

  round.save();

}

/**
 * Handles indexing on RoundFeePercentageUpdated event.
 * @param event RoundFeePercentageUpdated
 */

export function handleRoundFeePercentageUpdated(
  event: RoundFeePercentageUpdated
): void {


}

/**
 * Handles indexing on RoundFeeAddressUpdated event.
 * @param event RoundFeeAddressUpdated
 */

export function handleRoundFeeAddressUpdated(
  event: RoundFeeAddressUpdated
): void {


}

/**
 * Handles indexing on RoundMetaPtrUpdated event.
 * @param event RoundMetaPtrUpdated
 */

export function handleRoundMetaPtrUpdated(
  event: RoundMetaPtrUpdated
): void {


}

/**
 * Handles indexing on ApplicationMetaPtrUpdated event.
 * @param event ApplicationMetaPtrUpdated
 */

export function handleApplicationMetaPtrUpdated(
  event: ApplicationMetaPtrUpdated
): void {


}

/**
 * Handles indexing on ApplicationsStartTimeUpdated event.
 * @param event ApplicationsStartTimeUpdated
 */

export function handleApplicationsStartTimeUpdated(
  event: ApplicationsStartTimeUpdated
): void {


}

/**
 * Handles indexing on ApplicationsEndTimeUpdated event.
 * @param event ApplicationsEndTimeUpdated
 */

export function handleApplicationsEndTimeUpdated(
  event: ApplicationsEndTimeUpdated
): void {


}

/**
 * Handles indexing on RoundStartTimeUpdated event.
 * @param event RoundStartTimeUpdated
 */

export function handleRoundStartTimeUpdated(
  event: RoundStartTimeUpdated
): void {


}

/**
 * Handles indexing on RoundEndTimeUpdated event.
 * @param event RoundEndTimeUpdated
 */

export function handleRoundEndTimeUpdated(
  event: RoundEndTimeUpdated
): void {


}
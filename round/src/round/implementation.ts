import {
  NewProjectApplication as NewProjectApplicationEvent,
  ProjectsMetaPtrUpdated as ProjectsMetaPtrUpdatedEvent,
  ApplicationStatusesUpdated as ApplicationStatusesUpdatedEvent,
  RoleGranted as RoleGrantedEvent,
  RoleRevoked as RoleRevokedEvent,
} from "../../generated/templates/RoundImplementation/RoundImplementation";

import {
  MetaPtr,
  Round,
  RoundAccount,
  RoundRole,
  RoundApplication,
} from "../../generated/schema";
import { fetchMetaPtrData, generateID, updateMetaPtr } from "../utils";
import { JSONValueKind, log, store, BigInt, Bytes} from "@graphprotocol/graph-ts";


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
  const _appIndex = event.params.nextApplicationIndex.toI32();
  const _metaPtr = event.params.applicationMetaPtr;

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

  // set timestamp
  roundApplication.createdAt = event.block.timestamp;
  roundApplication.updatedAt = event.block.timestamp;

  roundApplication.save();
}

/**
 * Handles indexing on ProjectsMetaPtrUpdatedEvent event.
 *  - retrieve & parses object from metaPtr
 *  - updates projectsMetaPtr
 *  - gets list of projects on which a review decision has been made
 *  - load and update the status of that project entity
 *
 * @param event ProjectsMetaPtrUpdatedEvent
 */
export function handleProjectsMetaPtrUpdated(
  event: ProjectsMetaPtrUpdatedEvent
): void {
  const _round = event.address.toHex();

  const _metaPtr = event.params.newMetaPtr;

  const protocol = _metaPtr[0].toI32();
  const pointer = _metaPtr[1].toString();

  // load Round entity
  const round = Round.load(_round);
  if (!round) return;

  // set projectsMetaPtr
  const projectsMetaPtrId = ["projectsMetaPtr", _round].join("-");
  const projectsMetaPtr = updateMetaPtr(projectsMetaPtrId, protocol, pointer);
  round.projectsMetaPtr = projectsMetaPtr.id;

  round.save();

  // fetch projectsMetaPtr content
  const metaPtrData = fetchMetaPtrData(protocol, pointer);

  if (!metaPtrData) {
    log.warning("--> handleProjectsMetaPtrUpdated: metaPtrData is null {}", [
      _round,
    ]);
    return;
  }

  const _projects = metaPtrData.toArray();

  for (let i = 0; i < _projects.length; i++) {
    // construct projectId
    const _project = _projects[i].toObject();

    const _id = _project.get("id");
    if (!_id) continue;
    const projectId = _id.toString().toLowerCase();

    // load project entity
    let project = RoundApplication.load(projectId);

    let isProjectUpdated = false;

    // skip if project cannot be loaded
    if (!project) continue;

    // get status of project
    let status = _project.get("status");

    // get payout address of project
    let payoutAddress = _project.get("payoutAddress");

    if (
      status &&
      status.kind == JSONValueKind.STRING &&
      status.toString() != project.status
    ) {
      // update project status
      project.status = status.toString();
      isProjectUpdated = true;
    }

    if (
      payoutAddress &&
      payoutAddress.kind == JSONValueKind.STRING &&
      payoutAddress.toString() != project.payoutAddress
    ) {
      // update project payout address
      project.payoutAddress = payoutAddress.toString();
      isProjectUpdated = true;
    }

    if (isProjectUpdated) project.save();
  }
}

/**
 * Handles indexing on ApplicationStatusesUpdatedEvent event.
 *
 *
 * @param event ApplicationStatusesUpdatedEvent
 */

export function handleApplicationStatusesUpdated(
  event: ApplicationStatusesUpdatedEvent
): void {

  const APPLICATIONS_PER_ROW = 128;

  const rowIndex = event.params.index;
  const applicationStatusesBitMap = event.params.status;
  const _round = event.address.toHex();

  const startApplicationIndex = APPLICATIONS_PER_ROW * rowIndex.toI32();

  for (let i = 0; i <= APPLICATIONS_PER_ROW; i++) {
    const currentApplicationIndex = startApplicationIndex + i;

    const status = applicationStatusesBitMap
      .rightShift(i * 2)
      .bitAnd(new BigInt(3))
      .toI32();

    // load RoundApplication entity
    const roundApplicationId = [_round, currentApplicationIndex.toString()].join("-");
    const roundApplication = RoundApplication.load(roundApplicationId);
    if (!RoundApplication) continue;

    // update status
    roundApplication.status = status
    RoundApplication.save();
  }


}
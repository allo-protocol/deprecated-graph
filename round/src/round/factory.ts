import {
  RoundCreated as RoundCreatedEvent
} from "../../generated/Round/RoundFactory"

import { Program, Round, MerklePayout, DirectPayout } from "../../generated/schema";
import { RoundImplementation } from  "../../generated/templates";
import {
  RoundImplementation as RoundImplementationContract
} from "../../generated/templates/RoundImplementation/RoundImplementation";

import { updateMetaPtr } from "../utils";
import { BigInt, log } from "@graphprotocol/graph-ts";


/**
 * @dev Handles indexing on RoundCreatedEvent event.
 * @param event RoundCreatedEvent
 */
export function handleRoundCreated(event: RoundCreatedEvent): void {

  const roundContractAddress = event.params.roundAddress;
  let round = Round.load(roundContractAddress.toHex());

  if (round) {
    log.warning("--> handleRoundCreated {} : round already exists", [roundContractAddress.toHex()]);
    return;
  }

  // create new round entity
  round = new Round(roundContractAddress.toHex());

  // load round contract
  const roundContract = RoundImplementationContract.bind(roundContractAddress);

  // index global variables
  round.token = roundContract.token().toHex();
  round.applicationsStartTime = roundContract.applicationsStartTime().toString();
  round.applicationsEndTime = roundContract.applicationsEndTime().toString();
  round.roundStartTime = roundContract.roundStartTime().toString();
  round.roundEndTime = roundContract.roundEndTime().toString();


  // set roundMetaPtr
  const roundMetaPtrId = ['roundMetaPtr', roundContractAddress.toHex()].join('-');
  let roundMetaPtr = roundContract.roundMetaPtr();
  let metaPtr = updateMetaPtr(
    roundMetaPtrId,
    roundMetaPtr.getProtocol().toI32(),
    roundMetaPtr.getPointer().toString()
  );
  round.roundMetaPtr = metaPtr.id;

  // set applicationsMetaPtr
  const applicationsMetaPtrId = ['applicationsMetaPtr', roundContractAddress.toHex()].join('-');
  let applicationsMetaPtr = roundContract.applicationMetaPtr();
  metaPtr = updateMetaPtr(
    applicationsMetaPtrId,
    applicationsMetaPtr.getProtocol().toI32(),
    applicationsMetaPtr.getPointer().toString()
  );
  round.applicationMetaPtr = metaPtr.id;


  // link round to program
  const programContractAddress = event.params.ownedBy.toHex();
  let program = Program.load(programContractAddress);
  if (!program) {
    // avoid creating a round if program does not exist
    log.warning("--> handleRoundCreated {} : program {} is null", [roundContractAddress.toHex(), programContractAddress]);
    return;
  }
  round.program = program.id;

  // link round to payoutStrategy
  const payoutStrategyAddress = roundContract.payoutStrategy().toHex();
  const merklePayout = MerklePayout.load(payoutStrategyAddress);
  const directPayout = DirectPayout.load(payoutStrategyAddress);

  if (!merklePayout && directPayout) {
    // avoid creating a round if payoutStrategy does not exist
    log.warning("--> handleRoundCreated {} : payoutStrategy {} is null", [roundContractAddress.toHex(), payoutStrategyAddress]);
    return;
  }

  if (merklePayout) {
    merklePayout.roundId = roundContractAddress.toHex()
    merklePayout.save()
  }
  if (directPayout) {
    directPayout.roundId = roundContractAddress.toHex()
    directPayout.save()
  }


  round.payoutStrategy = payoutStrategyAddress;

  round.votingStrategy = roundContract.votingStrategy().toHex();

  // set timestamp
  round.createdAt = event.block.timestamp;
  round.updatedAt = event.block.timestamp;

  round.version = roundContract.VERSION();
  round.matchAmount = roundContract.matchAmount();
  round.roundFeePercentage = roundContract.roundFeePercentage();
  round.roundFeeAddress = roundContract.roundFeeAddress().toHex();


  round.save();

  RoundImplementation.create(roundContractAddress);
}

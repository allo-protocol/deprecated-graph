import {
  RoundCreated as RoundCreatedEvent
} from "../../generated/Round/RoundFactory"

import {PayoutStrategy, Program, Round} from "../../generated/schema";
import {RoundImplementation} from "../../generated/templates";
import {
  RoundImplementation as RoundImplementationContract
} from "../../generated/templates/RoundImplementation/RoundImplementation";
import {
  MerklePayoutStrategyImplementation as PayoutContract
} from "../../generated/templates/MerklePayoutStrategyImplementation/MerklePayoutStrategyImplementation";

import {updateMetaPtr} from "../utils";
import {Address, log} from "@graphprotocol/graph-ts";


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
  const payoutStrategyAddress = roundContract.payoutStrategy();
  const payoutStrategyContract = PayoutContract.bind(payoutStrategyAddress);
  let payoutStrategy = new PayoutStrategy(payoutStrategyAddress.toHex());

  // set PayoutStrategy entity fields
  payoutStrategy.strategyName = "MERKLE";
  payoutStrategy.strategyAddress = new Address(32).toHex();
  payoutStrategy.isReadyForPayout = payoutStrategyContract.isReadyForPayout();

  payoutStrategy.version = payoutStrategyContract.VERSION();

  // set timestamp
  payoutStrategy.createdAt = event.block.timestamp;
  payoutStrategy.updatedAt = event.block.timestamp;

  payoutStrategy.save();

  round.payoutStrategy = payoutStrategy.id;

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

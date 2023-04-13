import { test, assert, newMockEvent , createMockedFunction, describe, beforeEach, clearStore, afterEach, logStore } from "matchstick-as/assembly/index";
import { Address, BigInt, ethereum, log } from "@graphprotocol/graph-ts";
import { handleRoundCreated } from "../../src/round/factory";
import { RoundCreated  as RoundCreatedEvent } from "../../generated/Round/RoundFactory";
import { MetaPtr, PayoutStrategy, Program, Round } from "../../generated/schema";

let roundContractAddress: Address;
let roundImplementation: Address;
let newRoundEvent: RoundCreatedEvent;

let token: Address;
let program: Address;
let votingStrategy: Address;
let payoutStrategy: Address;
let applicationsEndTime: BigInt;
let applicationsStartTime: BigInt;
let roundStartTime: BigInt;
let roundEndTime: BigInt;
let matchAmount: BigInt;
let roundFeePercentage: BigInt;
let roundFeeAddress: Address;

let protocol: BigInt;
let roundPointer: string;
let applicationPointer: string;

function createNewRoundCreatedEvent(roundContractAddress: Address, ownedBy: Address, roundImplementation: Address): RoundCreatedEvent {
  const newRoundEvent = changetype<RoundCreatedEvent>(newMockEvent());

  const roundContractAddressParam = new ethereum.EventParam("roundContractAddress", ethereum.Value.fromAddress(roundContractAddress));
  const ownedByParam = new ethereum.EventParam("roundImplementation", ethereum.Value.fromAddress(ownedBy));
  const roundImplementationParam = new ethereum.EventParam("roundImplementation", ethereum.Value.fromAddress(roundImplementation));

  newRoundEvent.parameters.push(roundContractAddressParam);
  newRoundEvent.parameters.push(ownedByParam);
  newRoundEvent.parameters.push(roundImplementationParam);

  return newRoundEvent;
}

describe("handleRoundCreated", () => {

  beforeEach(() => {

    votingStrategy = Address.fromString("0xA16081F360e3847006dB660bae1c6d1b2e17eC2A");
    program = Address.fromString("0xA16081F360e3847006dB660bae1c6d1b2e17eC2B");
    roundContractAddress = Address.fromString("0xA16081F360e3847006dB660bae1c6d1b2e17eC2C");
    roundImplementation = Address.fromString("0xA16081F360e3847006dB660bae1c6d1b2e17eC2D");
    payoutStrategy = Address.fromString("0xA16081F360e3847006dB660bae1c6d1b2e17eC2E");
    token = Address.fromString("0xA16081F360e3847006dB660bae1c6d1b2e17eC2F");
    
    applicationsStartTime = new BigInt(10);
    applicationsEndTime = new BigInt(20);
    roundStartTime = new BigInt(30);
    roundEndTime = new BigInt(40);
    matchAmount = new BigInt(100);
    roundFeeAddress = Address.fromString("0xA16081F360e3847006dB660bae1c6d1b2e17eC2B");
    roundFeePercentage = new BigInt(10000);

    protocol = new BigInt(1);
    roundPointer = "randomRoundIPFSHash";
    applicationPointer = "randomApplicationIPFSHash";

    // Create PayoutStrategy entity
    let payoutStrategyEntity = new PayoutStrategy(payoutStrategy.toHex());
    payoutStrategyEntity.strategyName = "MERKLE";
    payoutStrategyEntity.strategyAddress = "0xA16081F360e3847006dB660bae1c6d1b2e17eB1A";
    payoutStrategyEntity.isReadyForPayout = false;
    payoutStrategyEntity.createdAt = new BigInt(10);
    payoutStrategyEntity.updatedAt = new BigInt(20);
    payoutStrategyEntity.version = "0.1.0";
    payoutStrategyEntity.save();

    // Create Program entity
    let programMetaPtr = new MetaPtr("program-metadata");
    programMetaPtr.protocol = protocol.toI32();
    programMetaPtr.pointer = "randomProgramIPFSHash"
    programMetaPtr.save();

    let programEntity = new Program(program.toHex());
    programEntity.metaPtr = programMetaPtr.id;
    programEntity.createdAt = new BigInt(10);
    programEntity.updatedAt = new BigInt(10);

    programEntity.save();

    // mock global variables
    createMockedFunction(
      roundContractAddress, "token", "token():(address)"
    ).returns([
      ethereum.Value.fromAddress(token)
    ]);
    createMockedFunction(
      roundContractAddress, "payoutStrategy", "payoutStrategy():(address)"
    ).returns([
      ethereum.Value.fromAddress(payoutStrategy)
    ]);
    createMockedFunction(
      roundContractAddress, "applicationsStartTime", "applicationsStartTime():(uint256)"
    ).returns([
      ethereum.Value.fromUnsignedBigInt(applicationsStartTime)
    ]);
    createMockedFunction(
      roundContractAddress, "applicationsEndTime", "applicationsEndTime():(uint256)"
    ).returns([
      ethereum.Value.fromUnsignedBigInt(applicationsEndTime)
    ]);
    createMockedFunction(
      roundContractAddress, "roundStartTime", "roundStartTime():(uint256)"
    ).returns([
      ethereum.Value.fromUnsignedBigInt(roundStartTime)
    ]);
    createMockedFunction(
      roundContractAddress, "roundEndTime", "roundEndTime():(uint256)"
    ).returns([
      ethereum.Value.fromUnsignedBigInt(roundEndTime)
    ]);
    createMockedFunction(
      roundContractAddress, "program", "program():(address)"
    ).returns([
      ethereum.Value.fromAddress(program)
    ]);
    createMockedFunction(
      roundContractAddress, "votingStrategy", "votingStrategy():(address)"
    ).returns([
      ethereum.Value.fromAddress(votingStrategy)
    ]);
    createMockedFunction(
      roundContractAddress, "matchAmount", "matchAmount():(uint256)"
    ).returns([
      ethereum.Value.fromUnsignedBigInt(matchAmount)
    ]);
    createMockedFunction(
      roundContractAddress, "VERSION", "VERSION():(string)"
    ).returns([
      ethereum.Value.fromString("1.0.0")
    ]);
    createMockedFunction(
      roundContractAddress, "roundFeePercentage", "roundFeePercentage():(uint32)"
    ).returns([
      ethereum.Value.fromUnsignedBigInt(roundFeePercentage)
    ]);
    createMockedFunction(
      roundContractAddress, "roundFeeAddress", "roundFeeAddress():(address)"
    ).returns([
      ethereum.Value.fromAddress(roundFeeAddress)
    ]);


    // mock roundMetaPtr
    createMockedFunction(
      roundContractAddress,
      "roundMetaPtr",
      "roundMetaPtr():(uint256,string)"
    ).returns([
      ethereum.Value.fromUnsignedBigInt(protocol),
      ethereum.Value.fromString(roundPointer)
    ]);

    // mock applicationMetaPtr
    createMockedFunction(
      roundContractAddress,
      "applicationMetaPtr",
      "applicationMetaPtr():(uint256,string)"
    ).returns([
      ethereum.Value.fromUnsignedBigInt(protocol),
      ethereum.Value.fromString(applicationPointer)
    ]);

    newRoundEvent = createNewRoundCreatedEvent(
      roundContractAddress,
      program,
      roundImplementation
    );

  })

  afterEach(() => {
    clearStore();
  })

  test("round entity is created when handleRoundCreated is called", () => {

    handleRoundCreated(newRoundEvent);

    const round = Round.load(roundContractAddress.toHex())
    assert.assertNotNull(round);

    assert.entityCount("Round", 1);
    assert.fieldEquals("Round", roundContractAddress.toHex(), "id", roundContractAddress.toHex());
  });

  test("init values are set when handleRoundCreated is called", () => {

    handleRoundCreated(newRoundEvent);

    const round = Round.load(roundContractAddress.toHex())

    assert.assertNotNull(round);

    // global variables
    assert.stringEquals(round!.token, token.toHex());
    assert.stringEquals(round!.applicationsStartTime, applicationsStartTime.toString());
    assert.stringEquals(round!.applicationsEndTime, applicationsEndTime.toString());
    assert.stringEquals(round!.roundStartTime, roundStartTime.toString());
    assert.stringEquals(round!.roundEndTime, roundEndTime.toString());
    assert.bigIntEquals(round!.matchAmount, matchAmount);

    // roundMetaPtr
    const roundMetaPtrEntity = MetaPtr.load(round!.roundMetaPtr);
    assert.assertNotNull(roundMetaPtrEntity);
    assert.stringEquals(roundMetaPtrEntity!.protocol.toString(), protocol.toString());
    assert.stringEquals(roundMetaPtrEntity!.pointer!, roundPointer.toString());

    // applicationMetaPtr
    const applicationMetaPtrEntity = MetaPtr.load(round!.applicationMetaPtr);
    assert.assertNotNull(applicationMetaPtrEntity);
    assert.stringEquals(applicationMetaPtrEntity!.protocol.toString(), protocol.toString());
    assert.stringEquals(applicationMetaPtrEntity!.pointer!, applicationPointer.toString());

    // program
    const programEntity = Program.load(round!.program);
    assert.assertNotNull(programEntity);
    assert.stringEquals(programEntity!.id, program.toHex());

    // payoutStrategys
    const payoutStrategyEntity = PayoutStrategy.load(round!.payoutStrategy);
    assert.assertNotNull(payoutStrategyEntity);
    assert.stringEquals(payoutStrategyEntity!.id, payoutStrategy.toHex());

    // votingStrategy
    assert.stringEquals(round!.votingStrategy, votingStrategy.toHex());

    // // projectsMetaPtr
    assert.assertNull(round!.projectsMetaPtr);

  });
});

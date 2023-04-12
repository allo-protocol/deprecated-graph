import { test, assert, newMockEvent, describe, beforeEach, clearStore, afterEach, logStore } from "matchstick-as/assembly/index";
import { Address, BigInt, ethereum } from "@graphprotocol/graph-ts";
import {
  ProtocolFeePercentageUpdated as ProtocolFeePercentageUpdatedEvent,
  ProtocolTreasuryUpdated as ProtocolTreasuryUpdatedEvent
} from "../../generated/AlloSettings/AlloSettings";

import {
  handleProtocolFeePercentageUpdated,
  handleProtocolTreasuryUpdated
} from "../../src/settings/alloSettings";
import { AlloSettings } from "../../generated/schema";

function createNewProtocolFeePercentageUpdated(feePercentage: BigInt): ProtocolFeePercentageUpdatedEvent {
  const newProtocolFeePercentageUpdatedEvent = changetype<ProtocolFeePercentageUpdatedEvent>(newMockEvent());

  const protocolFeePercentageParam = new ethereum.EventParam("protocolFeePercentageParam", ethereum.Value.fromUnsignedBigInt(feePercentage));

  newProtocolFeePercentageUpdatedEvent.parameters.push(protocolFeePercentageParam);

  return newProtocolFeePercentageUpdatedEvent;
}

function createNewProtocolTreasuryUpdated(protocolTreasuryAddress: Address): ProtocolTreasuryUpdatedEvent {
  const newProtocolTreasuryUpdatedEvent = changetype<ProtocolTreasuryUpdatedEvent>(newMockEvent());

  const protocolTreasuryAddressParam = new ethereum.EventParam("protocolTreasuryAddress", ethereum.Value.fromAddress(protocolTreasuryAddress));

  newProtocolTreasuryUpdatedEvent.parameters.push(protocolTreasuryAddressParam);

  return newProtocolTreasuryUpdatedEvent;
}

describe("handleProtocolFeePercentageUpdated", () => {

  beforeEach(() => {
    const alloSettingsEntity = new AlloSettings("1");
    alloSettingsEntity.protocolFeePercentage = 1000;
    alloSettingsEntity.protocolTreasury = Address.fromString("0xB16081F360e3847006dB660bae1c6d1b2e17eC2C").toHexString();
    alloSettingsEntity.save();
  });

  afterEach(() => {
    clearStore();
  });

  test("ProtocolFeePercentageUpdated event is indexed first time", () => {
    const feePercentage = BigInt.fromI32(1000);
    handleProtocolFeePercentageUpdated(createNewProtocolFeePercentageUpdated(feePercentage));

    const alloSettings = AlloSettings.load("1");
    assert.assertNotNull(alloSettings);

    assert.stringEquals(feePercentage.toString(), alloSettings!.protocolFeePercentage.toString());
  });

  test("ProtocolFeePercentageUpdated event is indexed with latest", () => {
    const feePercentage = BigInt.fromI32(1000);
    handleProtocolFeePercentageUpdated(createNewProtocolFeePercentageUpdated(feePercentage));

    let alloSettings = AlloSettings.load("1");
    assert.assertNotNull(alloSettings);

    assert.stringEquals(feePercentage.toString(), alloSettings!.protocolFeePercentage.toString());

    const newFeePercentage = BigInt.fromI32(1100);
    handleProtocolFeePercentageUpdated(createNewProtocolFeePercentageUpdated(newFeePercentage));
    alloSettings = AlloSettings.load("1");
    assert.stringEquals(newFeePercentage.toString(), alloSettings!.protocolFeePercentage.toString());
  });

});

describe("handleProtocolTreasuryUpdated", () => {

  beforeEach(() => {
    const alloSettingsEntity = new AlloSettings("1");
    alloSettingsEntity.protocolFeePercentage = 1000;
    alloSettingsEntity.protocolTreasury = Address.fromString("0xB16081F360e3847006dB660bae1c6d1b2e17eC2C").toHexString();
    alloSettingsEntity.save();
  });

  afterEach(() => {
    clearStore();
  });

  test("ProtocolTreasuryUpdated event is indexed first time", () => {
    const protocolTreasury = Address.fromString("0xA16081F360e3847006dB660bae1c6d1b2e17eC2B");
    handleProtocolTreasuryUpdated(createNewProtocolTreasuryUpdated(protocolTreasury));

    const alloSettings = AlloSettings.load("1");
    assert.assertNotNull(alloSettings);

    assert.stringEquals(protocolTreasury.toHexString(), alloSettings!.protocolTreasury);
  });

  test("ProtocolTreasuryUpdated event is indexed with latest", () => {
    const protocolTreasury = Address.fromString("0xA16081F360e3847006dB660bae1c6d1b2e17eC2B");
    handleProtocolTreasuryUpdated(createNewProtocolTreasuryUpdated(protocolTreasury));

    let alloSettings = AlloSettings.load("1");
    assert.assertNotNull(alloSettings);

    assert.stringEquals(protocolTreasury.toHexString(), alloSettings!.protocolTreasury);

    const newProtocolTreasury = Address.fromString("0xA16081F360e3847006dB660bae1c6d1b2e17eC2E");
    handleProtocolTreasuryUpdated(createNewProtocolTreasuryUpdated(newProtocolTreasury));
    alloSettings = AlloSettings.load("1");
    assert.stringEquals(newProtocolTreasury.toHexString(), alloSettings!.protocolTreasury);
  });
});
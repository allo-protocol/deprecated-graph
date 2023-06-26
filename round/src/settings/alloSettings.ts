import {
  ProtocolFeePercentageUpdated as ProtocolFeePercentageUpdatedEvent,
  ProtocolTreasuryUpdated as ProtocolTreasuryUpdatedEvent
} from "../../generated/AlloSettings/AlloSettings";

import { AlloSetting } from "../../generated/schema";

/**
 * Handles indexing on ProtocolFeePercentageUpdated event.
 * @param event ProtocolFeePercentageUpdatedEvent
 */
export function handleProtocolFeePercentageUpdated(event: ProtocolFeePercentageUpdatedEvent): void {
  // Get the updated protocol fee percentage value from the event
  let protocolFeePercentage = event.params.protocolFeePercentage;

  // Update the protocol fee percentage value in the AlloSettings entity
  let alloSetting = AlloSetting.load("1");

  if (alloSetting == null) {
    alloSetting = new AlloSetting("1");
  }

  alloSetting.protocolFeePercentage = protocolFeePercentage;
  alloSetting.save();
}


/**
 * Handles indexing on ProtocolTreasuryUpdated event.
 * @param event ProtocolTreasuryUpdatedEvent
 */
export function handleProtocolTreasuryUpdated(event: ProtocolTreasuryUpdatedEvent): void {
  // Get the updated protocol treasury address from the event
  let protocolTreasury = event.params.protocolTreasuryAddress.toHexString();

  // Update the protocol treasury address value in the AlloSettings entity
  let alloSetting = AlloSetting.load("1");

  if (alloSetting == null) {
    alloSetting = new AlloSetting("1");
  }

  alloSetting.protocolTreasury = protocolTreasury;
  alloSetting.save();
}

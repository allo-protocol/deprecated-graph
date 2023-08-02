import {
  ProtocolFeePercentageUpdated as ProtocolFeePercentageUpdatedEvent,
  ProtocolTreasuryUpdated as ProtocolTreasuryUpdatedEvent
} from "../../generated/AlloSettings/AlloSettings";

import { AlloSettings } from "../../generated/schema";

/**
 * Handles indexing on ProtocolFeePercentageUpdated event.
 * @param event ProtocolFeePercentageUpdatedEvent
 */
export function handleProtocolFeePercentageUpdated(event: ProtocolFeePercentageUpdatedEvent): void {
  // Get the updated protocol fee percentage value from the event
  let protocolFeePercentage = event.params.protocolFeePercentage;

  // Update the protocol fee percentage value in the AlloSettings entity
  let alloSettings = AlloSettings.load("1");

  if (alloSettings == null) {
    alloSettings = new AlloSettings("1");
  }

  alloSettings.protocolFeePercentage = protocolFeePercentage;
  alloSettings.save();
}


/**
 * Handles indexing on ProtocolTreasuryUpdated event.
 * @param event ProtocolTreasuryUpdatedEvent
 */
export function handleProtocolTreasuryUpdated(event: ProtocolTreasuryUpdatedEvent): void {
  // Get the updated protocol treasury address from the event
  let protocolTreasury = event.params.protocolTreasuryAddress.toHexString();

  // Update the protocol treasury address value in the AlloSettings entity
  let alloSettings = AlloSettings.load("1");

  if (alloSettings == null) {
    alloSettings = new AlloSettings("1");
  }

  alloSettings.protocolTreasury = protocolTreasury;
  alloSettings.save();
}

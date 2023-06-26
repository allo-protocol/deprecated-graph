import { Address, BigInt, crypto,
  ethereum,
  // ipfs,
  // json,
  JSONValue } from '@graphprotocol/graph-ts'
import { ByteArray } from '@graphprotocol/graph-ts';
import { MetaPtr, RoundApplication, StatusSnapshot, AlloSetting } from '../generated/schema';

import {
  AlloSettings as AlloSettingsContract
} from "../generated/Round/AlloSettings";

/**
 * Returns keccak256 of array after elements are joined by '-'
 * @param Array<String>
 * @returns keccak256
 */
export function generateID(array: Array<string>): string {
  return crypto.keccak256(
    ByteArray.fromUTF8(array.join('-'))
  ).toBase58();
}

/**
 * Updates MetaPtr if it exists, otherwise creates a new one and returns it
 * @param metaPtrId string
 * @param protocol i32
 * @param pointer string
 * @returns MetaPtr
 */
export function updateMetaPtr(metaPtrId: string, protocol: i32, pointer: string): MetaPtr {
  // metaPtr
  let metaPtr = MetaPtr.load(metaPtrId)
  metaPtr = metaPtr == null ? new MetaPtr(metaPtrId) : metaPtr;

  // update metaPtr
  metaPtr.protocol = protocol;
  metaPtr.pointer = pointer;

  // save metaPtr
  metaPtr.save();

  return metaPtr;
}

/**
 * Returns metaPtr data based on protocol and pointer
 * @param protocol { number }
 * @param pointer { string }
 * @returns JSONValue
 */
export function fetchMetaPtrData(protocol: number , pointer: string) : JSONValue | null {

  // TODO: wait until ipfs.cat is supported in studio

  // let metaPtrData: JSONValue;
  // if (protocol == 1) {
  //   const ipfsData = ipfs.cat(pointer);

  //   if (!ipfsData) return null;

  //   metaPtrData = json.fromBytes(ipfsData);
  //   return metaPtrData;
  // }

  return null;
}

/**
 * Creates a StatusSnapshot
 * @param metaPtrId string
 * @param protocol i32
 * @param pointer string
 * @returns MetaPtr
 */
export function createStatusSnapshot(roundApplication: RoundApplication, status: i32, event: ethereum.Event): StatusSnapshot {
  let statusSnapshot = new StatusSnapshot([roundApplication.id.toString(), status.toString()].join('-'));
  statusSnapshot.application = roundApplication.id;
  statusSnapshot.status = status;
  statusSnapshot.timestamp = event.block.timestamp;

  return statusSnapshot;
}

/**
 * Creates a AlloSettings
 * @param alloSettingsId string
 * @returns AlloSettings
 */
export function getAlloSettings(alloSettingsAddress: Address): AlloSetting {
  let alloSettingId = alloSettingsAddress.toHexString();
  let alloSetting = AlloSetting.load(alloSettingId);
  if (alloSetting == null) {
    alloSetting = new AlloSetting(alloSettingId);

    let contract = AlloSettingsContract.bind(alloSettingsAddress)
    alloSetting.protocolFeePercentage = contract.protocolFeePercentage();
    alloSetting.protocolTreasury = contract.protocolTreasury().toHexString();

    alloSetting.save()
  }

  return alloSetting;
}

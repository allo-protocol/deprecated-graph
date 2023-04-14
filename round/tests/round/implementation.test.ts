import {
    test,
    assert,
    newMockEvent,
    createMockedFunction,
    describe,
    beforeEach,
    afterEach,
    clearStore,
    logStore,
  } from "matchstick-as/assembly/index";
  import {
    Address,
    ethereum,
    BigInt,
    Bytes,
    json,
  } from "@graphprotocol/graph-ts";
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
    handleRoleGranted,
    handleRoleRevoked,
    handleNewProjectApplication,
    handleApplicationStatusesUpdated,
    handleMatchAmountUpdated,
    handleRoundFeePercentageUpdated,
    handleRoundFeeAddressUpdated,
    handleRoundMetaPtrUpdated,
    handleApplicationMetaPtrUpdated,
    handleApplicationsStartTimeUpdated,
    handleApplicationsEndTimeUpdated,
    handleRoundStartTimeUpdated,
    handleRoundEndTimeUpdated,
  } from "../../src/round/implementation";
  import {
    MetaPtr,
    Round,
    RoundAccount,
    RoundRole,
    RoundApplication,
  } from "../../generated/schema";
  
  // Utility function to create a NewProjectApplicationEvent
  function createNewProjectApplicationEvent(
    roundAddress: Address,
    projectID: Bytes,
    applicationIndex: BigInt,
    protocol: BigInt,
    pointer: string,
    senderAddress: Address
  ): NewProjectApplicationEvent {
    const newProjectApplicationEvent = changetype<NewProjectApplicationEvent>(newMockEvent());
    newProjectApplicationEvent.address = roundAddress;

    const projectIDParam = new ethereum.EventParam("projectID", ethereum.Value.fromBytes(projectID));
    const applicationIndexParam = new ethereum.EventParam("applicationIndex", ethereum.Value.fromUnsignedBigInt(applicationIndex));
    const applicationMetaPtrParam: MetaPtr = {
        protocol: new ethereum.EventParam("protocol", ethereum.Value.fromUnsignedBigInt(protocol)),
        pointer: new ethereum.EventParam("pointer", ethereum.Value.fromString(pointer)),
    }

    newProjectApplicationEvent.parameters.push(projectIDParam);
    newProjectApplicationEvent.parameters.push(applicationIndexParam);
    newProjectApplicationEvent.parameters.push(applicationMetaPtrParam);

    newProjectApplicationEvent.transaction.from = senderAddress;

    return newProjectApplicationEvent;
  }
  
  describe("handleNewProjectApplication", () => {
    test("creates and updates Round, RoundApplication, and MetaPtr entities", () => {
      const roundAddress = Address.fromString("0x1234567890123456789012345678901234567890");
      const projectID = Bytes.fromHexString("0x1234567890123456789012345678901234567890123456789012345678901234");
      const applicationIndex = BigInt.fromI32(42);
      const protocol = BigInt.fromI32(1);
      const pointer = "ipfs://metadata";
      const senderAddress = Address.fromString("0x0987654321098765432109876543210987654321");
  
      const event = createNewProjectApplicationEvent(
        roundAddress,
        projectID,
        applicationIndex,
        protocol,
        pointer,
        senderAddress
      );
  
      handleNewProjectApplication(event);
  
      const roundId = roundAddress.toHex();
      const round = Round.load(roundId);
      assert.assertNotNull(round);

      // create RoundApplication entity
        const roundApplicationId = [roundId, applicationIndex.toString()].join('-');
        const roundApplication = RoundApplication.load(roundApplicationId);
        assert.assertNotNull(roundApplication);
        
    });
  });


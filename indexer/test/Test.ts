import assert from "assert";
import { 
  TestHelpers,
  PositionManagerRouter_Initialized
} from "generated";
const { MockDb, PositionManagerRouter } = TestHelpers;

describe("PositionManagerRouter contract Initialized event tests", () => {
  // Create mock db
  const mockDb = MockDb.createMockDb();

  // Creating mock for PositionManagerRouter contract Initialized event
  const event = PositionManagerRouter.Initialized.createMockEvent({/* It mocks event fields with default values. You can overwrite them if you need */});

  it("PositionManagerRouter_Initialized is created correctly", async () => {
    // Processing the event
    const mockDbUpdated = await PositionManagerRouter.Initialized.processEvent({
      event,
      mockDb,
    });

    // Getting the actual entity from the mock database
    let actualPositionManagerRouterInitialized = mockDbUpdated.entities.PositionManagerRouter_Initialized.get(
      `${event.chainId}_${event.block.number}_${event.logIndex}`
    );

    // Creating the expected entity
    const expectedPositionManagerRouterInitialized: PositionManagerRouter_Initialized = {
      id: `${event.chainId}_${event.block.number}_${event.logIndex}`,
      version: event.params.version,
    };
    // Asserting that the entity in the mock database is the same as the expected entity
    assert.deepEqual(actualPositionManagerRouterInitialized, expectedPositionManagerRouterInitialized, "Actual PositionManagerRouterInitialized should be the same as the expectedPositionManagerRouterInitialized");
  });
});

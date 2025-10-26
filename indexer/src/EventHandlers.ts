/*
 * Please refer to https://docs.envio.dev for a thorough guide on all Envio indexer features
 */
import {
  PositionManagerRouter,
  PositionManagerRouter_Initialized,
  PositionManagerRouter_MintedPosition,
  PositionManagerRouter_NFTMinted,
  PositionManagerRouter_PositionCreated,
} from "generated";

PositionManagerRouter.Initialized.handler(async ({ event, context }) => {
  const entity: PositionManagerRouter_Initialized = {
    id: `${event.chainId}_${event.block.number}_${event.logIndex}`,
    version: event.params.version,
  };

  context.PositionManagerRouter_Initialized.set(entity);
});

PositionManagerRouter.MintedPosition.handler(async ({ event, context }) => {
  const entity: PositionManagerRouter_MintedPosition = {
    id: `${event.chainId}_${event.block.number}_${event.logIndex}`,
    tokenId: event.params.tokenId,
    owner: event.params.owner,
    token0: event.params.token0,
    token1: event.params.token1,
    fee: event.params.fee,
    pool: event.params.pool,
  };

  context.PositionManagerRouter_MintedPosition.set(entity);
});

PositionManagerRouter.NFTMinted.handler(async ({ event, context }) => {
  const entity: PositionManagerRouter_NFTMinted = {
    id: `${event.chainId}_${event.block.number}_${event.logIndex}`,
    owner: event.params.owner,
    tokenId: event.params.tokenId,
  };

  context.PositionManagerRouter_NFTMinted.set(entity);
});

PositionManagerRouter.PositionCreated.handler(async ({ event, context }) => {
  const entity: PositionManagerRouter_PositionCreated = {
    id: `${event.chainId}_${event.block.number}_${event.logIndex}`,
    owner: event.params.owner,
    tokenId: event.params.tokenId,
    amount0: event.params.amount0,
    amount1: event.params.amount1,
  };

  context.PositionManagerRouter_PositionCreated.set(entity);
});

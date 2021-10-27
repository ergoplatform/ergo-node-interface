import { createSelector } from 'redux-starter-kit';

export const nodeSelector = (state) => state.node;

export const networkSelector = createSelector(nodeSelector, (node) => node.network);

export const explorerSelector = createSelector(nodeSelector, (node) =>
  node.network === 'mainnet' ? 'explorer' : node.network,
);

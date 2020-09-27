import { createSelector } from 'redux-starter-kit';

export const appSelector = (state) => state.app;

export const apiKeySelector = createSelector(appSelector, (app) => app.apiKey);

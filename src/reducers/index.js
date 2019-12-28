import _ from 'lodash';
import { combineReducers } from 'redux';
import { handleActions, handleAction } from 'redux-actions';
import { reducer as formReducer } from 'redux-form';
import * as actions from '../actions'

const searchFetchingState = handleActions({
    [actions.newSearchRequest]() {
        return 'requested';
    },
    [actions.newSearchFailure]() {
        return 'failed';
    },
    [actions.newSearchSuccess]() {
        return 'finished';
    },
}, 'none');

const elements = handleActions({
    [actions.newSearchSuccess](_state, { payload: { data, currentSelector } }) {
        const setIdForEachEl = data.map((e) => _.set(e, 'id', _.uniqueId()));
        const allIdsElements = setIdForEachEl.map((e) => e.id);
        return {
            byId: _.mapKeys({ ...setIdForEachEl }, (key) => key.id),
            allIds: [...allIdsElements],
            currentSelecrot: currentSelector,
        };
    },
    [actions.updateSelector](_state, { payload: { currentSelector } }) {
        return {
            byId: {},
            allIds: [],
            currentSelecrot: currentSelector,
        };
    },
}, { byId: {}, allIds: [], currentSelector: 'Country' });

const uiState = handleActions({
    [actions.updateSelector](_state, { payload: { currentSelector } }) {
        return {
            currentSelector: currentSelector,
        };
    },
}, {});

export default combineReducers({
    searchFetchingState,
    elements,
    uiState,
    form: formReducer,
});
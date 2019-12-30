import _ from 'lodash';
import { combineReducers } from 'redux';
import { handleActions } from 'redux-actions';
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
    [actions.updateSelector](state, { payload: { currentSelector } }) {
        const { isOpenEl } = state;
        return {
            currentSelector: currentSelector,
            isOpenEl,
        };
    },
    [actions.newSearchSuccess](state, { payload: { data } }) {
        const { currentSelecrot } = state;
        const setIdAndStatusForEachEl = data.map((e) => {
            const setId = _.set(e, 'id', _.uniqueId());
            const setStatus = _.set(setId, 'status', 'close');
            return _.pick(setStatus, ['id', 'status']);
        });
        return {
            currentSelecrot,
            isOpenEl: _.mapKeys({ ...setIdAndStatusForEachEl }, (key) => key.id),
        }
    },
    [actions.openElement](state, { payload: { isOpenEl: { id } } }) {
        const { currentSelecrot, isOpenEl } = state;
        const f = (s) => (s === 'close' ? 'open' : 'close');
        return {
            currentSelecrot,
            isOpenEl: _.update(isOpenEl, `${id}.status`, f),
        };
    },
}, {});

export default combineReducers({
    searchFetchingState,
    elements,
    uiState,
    form: formReducer,
});
import _ from 'lodash';
import { combineReducers } from 'redux';
import { handleActions } from 'redux-actions';
import { reducer as formReducer } from 'redux-form';
import * as actions from '../actions'

const elements = handleActions({
    [actions.newSearchSuccess](state, { payload: { data } }) {
        const setIdForEachEl = data.map((e) => _.set(e, 'id', _.uniqueId()));
        const allIdsElements = setIdForEachEl.map((e) => e.id);
        return {
            byId: _.mapKeys({ ...setIdForEachEl }, (key) => key.id),
            allIds: [...allIdsElements],
        };
    },
}, { byId: {}, allIds: [], currentSelecrot: 'Country' });

export default combineReducers({
    elements,
    form: formReducer,
});
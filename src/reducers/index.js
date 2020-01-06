import _ from 'lodash';
import { combineReducers } from 'redux';
import { handleActions } from 'redux-actions';
import { reducer as formReducer } from 'redux-form';
import * as actions from '../actions';

const elementsFetchState = handleActions({
  [actions.fetchElementsRequest]() {
    return 'requested';
  },
  [actions.fetchElementsFailure]() {
    return 'failed';
  },
  [actions.fetchElementsSuccess]() {
    return 'finished';
  },
}, 'none');

const text = handleActions({
  [actions.updateText](_state, { payload }) {
    return payload.text;
  },
  [actions.updateSelector]() {
    return '';
  },
}, '');

const elements = handleActions({
  [actions.fetchElementsSuccess](state, { payload: { data } }) {
    const { selector } = state;
    const setIdForEachEl = data.map((e) => _.set(e, 'id', _.uniqueId()));
    const allIdsElements = setIdForEachEl.map((e) => e.id);
    return {
      byId: _.mapKeys({ ...setIdForEachEl }, (key) => key.id),
      allIds: [...allIdsElements],
      selector,
    };
  },
  [actions.findElementBySelector](state, { payload: { text } }) {
    const { byId, selector } = state;
    const mapped = _.pickBy(byId, (el) => {
      if (selector === 'languages') {
        return el[selector].map((e) => (e.name.includes(text)
          || e.name.includes(_.capitalize(text)))).some((e) => e === true);
      }
      return (el[selector].includes(text)
      || el[selector].includes(_.capitalize(text)));
    });

    return {
      byId,
      allIds: _.keys(mapped),
      selector,
    };
  },
  [actions.updateSelector](state, { payload: { newSelector } }) {
    const { byId, allIds } = state;
    return {
      byId,
      allIds,
      selector: newSelector,
    };
  },
}, { byId: {}, allIds: [], selector: 'name' });

const uiState = handleActions({
  [actions.fetchElementsSuccess](state, { payload: { data } }) {
    const { currentSelecrot } = state;
    const setIdAndStatusForEachEl = data.map((e) => {
      const setId = _.set(e, 'id', _.uniqueId());
      const setStatus = _.set(setId, 'status', 'close');
      return _.pick(setStatus, ['id', 'status']);
    });
    return {
      currentSelecrot,
      isOpenEl: _.mapKeys({ ...setIdAndStatusForEachEl }, (key) => key.id),
    };
  },
  [actions.openElement](state, { payload: { isOpenEl: { id } } }) {
    const { currentSelecrot, isOpenEl } = state;
    const switcher = (s) => (s === 'close' ? 'open' : 'close');
    return {
      currentSelecrot,
      isOpenEl: _.update(isOpenEl, `${id}.status`, switcher),
    };
  },
  [actions.nextOrPrevElement](state, { payload: { isOpenEl: { id, type } } }) {
    const { currentSelecrot, isOpenEl } = state;
    const keys = _.keys(isOpenEl);
    const firstEl = _.head(keys);
    const lastEl = _.last(keys);
    const nextId = id === lastEl ? firstEl : String(Number(id) + 1);
    const prevId = id === firstEl ? lastEl : String(Number(id) - 1);
    const switcher = (s) => (s === 'close' ? 'open' : 'close');
    const updatedCurrentEl = _.update(isOpenEl, `${id}.status`, switcher);
    return {
      currentSelecrot,
      isOpenEl: _.update(updatedCurrentEl, `${type === 'next' ? nextId : prevId}.status`, switcher),
    };
  },
}, {});

export default combineReducers({
  text,
  elementsFetchState,
  elements,
  uiState,
  form: formReducer,
});

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

let filtred;

const elements = handleActions({
  [actions.fetchElementsSuccess](state, { payload: { data } }) {
    const { selector } = state;
    const allIdsElements = data.map((e) => e.id);
    return {
      byId: _.mapKeys({ ...data }, (key) => key.id),
      allIds: [...allIdsElements],
      selector,
    };
  },
  [actions.findElementBySelector](state, { payload: { inputValue } }) {
    const { byId, selector } = state;
    const mapped = _.pickBy(byId, (el) => {
      if (selector === 'languages' || selector === 'regionalBlocs') {
        return el[selector].map((e) => (e.name.includes(inputValue)
          || e.name.includes(_.capitalize(inputValue)))).some((e) => e === true);
      }
      return (el[selector].includes(inputValue)
      || el[selector].includes(_.capitalize(inputValue)));
    });
    filtred = _.keys(mapped);
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
}, { byId: {}, allIds: [], selector: 'disabled' });

let allUIStateData;

const uiState = handleActions({
  [actions.fetchElementsSuccess](state, { payload: { data } }) {
    const { currentSelecrot } = state;
    const setIdAndStatusForEachEl = data.map((e) => {
      const setOpenStatus = _.set(e, 'status', 'close');
      return _.pick(setOpenStatus, ['id', 'status']);
    });
    allUIStateData = _.mapKeys({ ...setIdAndStatusForEachEl }, (key) => key.id);
    return {
      currentSelecrot,
      isOpenEl: _.mapKeys({ ...setIdAndStatusForEachEl }, (key) => key.id),
    };
  },
  [actions.findElementBySelector](state) {
    const { currentSelecrot } = state;
    const updated = _.pick(allUIStateData, filtred);
    return {
      currentSelecrot,
      isOpenEl: updated,
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
    const currentElIndex = _.findIndex(keys, (e) => e === id);
    const firstEl = _.head(keys);
    const lastEl = _.last(keys);
    const nextId = id === lastEl ? firstEl : keys[currentElIndex + 1];
    const prevId = id === firstEl ? lastEl : keys[currentElIndex - 1];
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

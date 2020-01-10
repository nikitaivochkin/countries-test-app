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
  [actions.updateText](_state, { payload: { value } }) {
    return value;
  },
  [actions.updateSelector]() {
    return '';
  },
}, '');

let filtred;

const elements = handleActions({
  [actions.fetchElementsSuccess](state, { payload: { data } }) {
    const { selector, exactSearchStatus } = state;
    const allIdsElements = data.map((e) => e.id);
    return {
      byId: _.mapKeys({ ...data }, (key) => key.id),
      allIds: [...allIdsElements],
      selector,
      exactSearchStatus,
    };
  },
  [actions.findElementBySelector](state, { payload: { inputValue, subSelector } }) {
    const { byId, selector, exactSearchStatus } = state;
    console.log(inputValue, subSelector)
    const getAction = {
      yes: (element) => (element === inputValue || element === _.capitalize(inputValue)),
      no: (element) => (element.includes(inputValue) || element.includes(_.capitalize(inputValue))),
    };
    const mapped = _.pickBy(byId, (el) => {
      if (subSelector === 'languages' || subSelector === 'regionalBlocs') {
        return el[subSelector].map((e) => getAction[exactSearchStatus](e.name))
          .some((e) => e === true);
      } if (subSelector === 'callingCodes') {
        return el[subSelector].some((e) => getAction[exactSearchStatus](e));
      }
      return getAction[exactSearchStatus](el[subSelector]);
    });
    filtred = _.keys(mapped);
    return {
      byId,
      allIds: _.keys(mapped),
      selector,
      exactSearchStatus,
    };
  },
  [actions.updateSelector](state, { payload: { newSelector } }) {
    const { byId, allIds, exactSearchStatus } = state;
    return {
      byId,
      allIds,
      selector: newSelector,
      exactSearchStatus,
    };
  },
  [actions.isExactSearch](state, { payload: { status } }) {
    const { byId, allIds, selector } = state;
    return {
      byId,
      allIds,
      selector,
      exactSearchStatus: status === 'no' ? 'yes' : 'no',
    };
  },
}, {
  byId: {},
  allIds: [],
  selector: 'disabled',
  exactSearchStatus: 'no',
});

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

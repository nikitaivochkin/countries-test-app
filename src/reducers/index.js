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

let filtredAllIds;

const elements = handleActions({
  [actions.fetchElementsSuccess](state, { payload: { data } }) {
    const { filter, currentSelector, exactSearchStatus } = state;
    const allIdsElements = data.map((e) => e.id);
    const mainData = _.mapKeys({ ...data }, (key) => key.id);
    return {
      byId: mainData,
      allIds: [...allIdsElements],
      currentSelector,
      filter,
      exactSearchStatus,
    };
  },
  [actions.findElementBySelector](state) {
    const {
      byId, filter, currentSelector, exactSearchStatus,
    } = state;
    const getAction = {
      yes: (element, v) => (element === v || element === _.capitalize(v)),
      no: (element, v) => (element.includes(v) || element.includes(_.capitalize(v))),
    };
    const result = filter.map((filterEl) => {
      const [s,, v] = filterEl.split('_');
      const filtred = _.pickBy(byId, (el) => {
        if (s === 'languages' || s === 'regionalBlocs') {
          return el[s].map((e) => getAction[exactSearchStatus](e.name, v))
            .some((e) => e === true);
        } if (s === 'callingCodes') {
          return el[s].some((e) => getAction[exactSearchStatus](e, v));
        }
        return getAction[exactSearchStatus](el[s], v);
      });
      return filtred;
    });
    filtredAllIds = _.keys(_.last(result));
    return {
      byId,
      allIds: _.keys(_.last(result)),
      currentSelector,
      filter,
      exactSearchStatus,
    };
  },
  [actions.updateSelector](state, { payload: { newSelector } }) {
    const {
      byId, allIds, filter, exactSearchStatus,
    } = state;
    return {
      byId,
      allIds,
      currentSelector: newSelector,
      filter,
      exactSearchStatus,
    };
  },
  [actions.buildFilter](state, { payload: { selector, value } }) {
    const {
      byId, allIds, filter, currentSelector, exactSearchStatus,
    } = state;
    const updadedSelector = filter.length === 0 ? [`${selector}_${value}`] : filter.reduce((acc, e) => {
      const [s, lvl] = e.split('_');
      const [newS, newLvl] = selector.split('_');
      if (newLvl < filter.length) {
        return [`${newS}_${newLvl}_${value}`];
      } if (s === newS) {
        return [...acc, `${s}_${lvl}_${value}`];
      } if (lvl !== newLvl) {
        return [...acc, e, `${newS}_${newLvl}_${value}`];
      }
      return [...acc, e];
    }, []);
    return {
      byId,
      allIds,
      currentSelector,
      filter: updadedSelector,
      exactSearchStatus,
    };
  },
  [actions.isExactSearch](state, { payload: { status } }) {
    const {
      byId, allIds, currentSelector, filter,
    } = state;
    return {
      byId,
      allIds,
      currentSelector,
      filter,
      exactSearchStatus: status === 'no' ? 'yes' : 'no',
    };
  },
}, {
  byId: {},
  allIds: [],
  currentSelector: 'disabled_0',
  filter: [],
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
    const updated = _.pick(allUIStateData, filtredAllIds);
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

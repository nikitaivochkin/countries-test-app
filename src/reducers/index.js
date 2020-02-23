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
    return value !== 'reset' ?  value : '';
  },
}, '');

let filtredAllIds;

const elements = handleActions({
  [actions.fetchElementsSuccess](state, { payload: { data } }) {
    const { filter } = state;
    const allIdsElements = data.map((e) => e.id);
    const mainData = _.mapKeys({ ...data }, (key) => key.id);

    return { byId: mainData, allIds: [...allIdsElements], filter };
  },
  [actions.findElementBySelector](state) {
    const { byId, filter } = state;
    let countries = byId;

    _.mapKeys(filter, (v, s) => {
      const filtred = _.pickBy(countries, (el) => {
        const actionsDopendsOnSelector = [
          {
            name: 'languagesOrRegionalBlocs',
            check: (selector) => (selector === 'languages' || selector === 'regionalBlocs'),
            action: () => el[s].map((e) => (e.name.includes(v) || e.name.includes(_.capitalize(v))))
              .some((e) => e === true)
          },
          {
            name: 'callingCodes',
            check: (selector) => (selector === 'callingCodes'),
            action: () => el[s].some((e) => (e === v || e === _.capitalize(v))),
          },
          {
            name: 'populationMin',
            check: (selector) => (selector === 'populationMin'),
            action: () => (el.population >= v * 1000000),
          },
          {
            name: 'populationMax',
            check: (selector) => (selector === 'populationMax'),
            action: () => (el.population <= v * 1000000),
          },
          {
            name: 'other',
            check: (selector) => selector,
            action: () => (el[s].includes(v) || el[s].includes(_.capitalize(v))),
          },
        ];
        const { action } = actionsDopendsOnSelector.find(({ check }) => check(s));
        return action();
      });
      countries = filtred;
      return filtred;
    });

    filtredAllIds = _.keys(countries);

    return { byId, allIds: _.keys(countries), filter };
  },
  [actions.buildFilter](state, { payload: { selector, value } }) {
    const { byId, allIds, filter } = state;

    if (value === 'disabled') {
      return { byId, allIds, filter: _.omit(filter, `${selector}`) };
    }
    
    const typeActions = [
      {
        type: 'rmSubregion',
        check: () => (value === 'reset' && filter['region'] && filter['subregion']),
        action: () => _.omit(filter, ['region' ,'subregion']),
      },
      {
        type: 'add',
        check: () => (!filter[selector]),
        action: () => _.set(filter, `${selector}`, value),
      },
      {
        type: 'emptyValue',
        check: () => (value.length === 0 || value === 'reset'),
        action: () => _.omit(filter, `${selector}`),
      },
      {
        type: 'changeValue',
        check: () => (filter[selector]),
        action: () => _.set(filter, `${selector}`, value),
      },
    ];
    const { action } = typeActions.find(({ check }) => check());
    const updatedFilter = action();
    return { byId, allIds, filter: updatedFilter };
  },
}, { byId: {}, allIds: [], filter: {} });

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


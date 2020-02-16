import _ from 'lodash';
import { combineReducers } from 'redux';
import { handleActions } from 'redux-actions';
import { reducer as formReducer } from 'redux-form';
import * as actions from '../actions';
import { mainSelect } from '../assets/options.js';

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
    
    let countries = byId;

    _.mapKeys(filter, (v, s) => {
      const filtred = _.pickBy(countries, (el) => {
        const actionsDopendsOnSelector = [
          {
            name: 'languagesOrRegionalBlocs',
            check: (selector) => (selector === 'languages' || selector === 'regionalBlocs'),
            action: () => el[s].map((e) => getAction[exactSearchStatus](e.name, v))
              .some((e) => e === true),
          },
          {
            name: 'callingCodes',
            check: (selector) => (selector === 'callingCodes'),
            action: () => el[s].some((e) => getAction[exactSearchStatus](e, v)),
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
            action: () => getAction[exactSearchStatus](el[s], v),
          },
        ];
        const { action } = actionsDopendsOnSelector.find(({ check }) => check(s));
        return action();
      });
      countries = filtred;
      return filtred;
    });

    filtredAllIds = _.keys(countries);
    return {
      byId,
      allIds: _.keys(countries),
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

    const typeActions = [
      {
        type: 'rmSubregion',
        check: () => (selector === 'region' && filter['subregion'] && filter['region'] !== value),
        action: () => _.omit(filter, "subregion"),
      },
      {
        type: 'add',
        check: () => (!filter[selector]),
        action: () => {
          if (_.keys(filter).length === 0 || !mainSelect.some(([, v]) => v === selector)) {
            return _.set(filter, `${selector}`, value)
          }
          const updated = _.mapKeys(filter, ((_v, k) => mainSelect.some(([, v]) => v === k) ? selector : k));
          const rmSubregion = _.omit(updated, "subregion");
          return _.set(rmSubregion, `${selector}`, value);
        },
      },
      {
        type: 'emptyValue',
        check: () => (value.length === 0),
        action: () => _.omit(filter, `${selector}`),
      },
      {
        type: 'changeValue',
        check: () => (filter[selector]),
        action: () => _.set(filter, `${selector}`, value),
      },
    ];
    const { action } = typeActions.find(({ check }) => check());

    return {
      byId,
      allIds,
      currentSelector,
      filter: action(),
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
  filter: {},
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



// [actions.buildFilter](state, { payload: { selector, value } }) {
//   const {
//     byId, allIds, filter, currentSelector, exactSearchStatus,
//   } = state;

//   const updadedSelector = filter.length === 0 ? [`${selector}_${value}`] : filter.reduce((acc, e, index) => {
//     const [s, lvl] = e.split('_');
//     const [newS, newLvl] = selector.split('_');

//     const typeActions = [
//       {
//         type: 'emptyValue',
//         check: () => (value.length === 0),
//         action: () => console.log(acc),
//       },
//       {
//         type: 'changeValue',
//         check: () => (s === newS),
//         action: () => [...acc, `${s}_${lvl}_${value}`],
//       },
//       {
//         type: 'changeSelector',
//         check: () => ((lvl === newLvl) && (s === newS)),
//         action: () => [`${newS}_${newLvl}_${value}`],
//       },
//       {
//         type: 'remove',
//         check: () => (newLvl < filter.length - 1),
//         action: () => (newLvl < index ? acc : null),
//       },
//       {
//         type: 'add',
//         check: () => (s !== newS),
//         action: () => [...acc, e, `${newS}_${newLvl}_${value}`],
//       },
//     ];
//     const { type, action } = typeActions.find(({ check }) => check());
//     console.log(type);
//     return action();
//   }, []);

//   return {
//     byId,
//     allIds,
//     currentSelector,
//     filter: _.uniq(updadedSelector),
//     exactSearchStatus,
//   };
// },

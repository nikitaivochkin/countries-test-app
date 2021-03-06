import _ from 'lodash';
import { combineReducers } from 'redux';
import { handleActions } from 'redux-actions';
import { reducer as formReducer } from 'redux-form';
import * as actions from '../actions';

let allIdsForUiState;

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
    return value !== 'reset' ? value : '';
  },
  [actions.resetFilters]() {
    return '';
  },
}, '');

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
              .some((e) => e === true),
          },
          {
            name: 'callingCodesOrTimezones',
            check: (selector) => (selector === 'callingCodes' || selector === 'timezones'),
            action: () => el[s].some((e) => (e === v || e === _.capitalize(v))),
          },
          {
            name: 'apha2OrAlpha3OrCountryCode',
            check: (selector) => (selector === 'alpha2Code' || selector === 'alpha3Code' || selector === 'numericCode'),
            action: () => (el[s] === v || el[s] === _.capitalize(v) || el[s] === _.upperCase(v)),
          },
          {
            name: 'Min',
            check: (selector) => (selector === 'populationMin' || selector === 'areaMin'),
            action: () => {
              if (s === 'populationMin') {
                return el.population >= v * 1000000;
              } return el.area >= v;
            },
          },
          {
            name: 'Max',
            check: (selector) => (selector === 'populationMax' || selector === 'areaMax'),
            action: () => {
              if (s === 'populationMax') {
                return el.population <= v * 1000000;
              } return el.area <= v;
            },
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
      allIdsForUiState = _.keys(countries);
      return filtred;
    });
    return { byId, allIds: _.keys(countries), filter };
  },
  [actions.buildFilter](state, { payload: { selector, value, resetFilter = false } }) {
    const { byId, allIds, filter } = state;

    if (value === 'disabled') {
      return { byId, allIds, filter: _.omit(filter, `${selector}`) };
    } if (resetFilter) {
      return { byId, allIds, filter: { [selector]: value } };
    }
    const typeActions = [
      {
        type: 'resetRegion',
        check: () => (value === 'reset' && filter.region && filter.subregion && selector === 'region'),
        action: () => _.omit(filter, ['region', 'subregion']),
      },
      {
        type: 'resetSubregion',
        check: () => (value === 'reset' && filter.subregion && selector === 'subregion'),
        action: () => _.omit(filter, 'subregion'),
      },
      {
        type: 'add',
        check: () => (!filter[selector]),
        action: () => _.set(filter, `${selector}`, value),
      },
      {
        type: 'emptyValue',
        check: () => (value.length === 0 || value === 'reset' || value === ''),
        action: () => _.omit(filter, `${selector}`),
      },
      {
        type: 'changeValue',
        check: () => (filter[selector]),
        action: () => {
          if (filter.subregion) {
            const withoutSubregion = _.omit(filter, 'subregion');
            return _.set(withoutSubregion, `${selector}`, value);
          }
          return _.set(filter, `${selector}`, value);
        },
      },
    ];
    const { action } = typeActions.find(({ check }) => check());
    const updatedFilter = action();
    return { byId, allIds, filter: updatedFilter };
  },
  [actions.resetFilters](state) {
    const { byId, allIds } = state;
    return { byId, allIds, filter: {} };
  },
}, { byId: {}, allIds: [], filter: {} });

const uiState = handleActions({
  [actions.fetchElementsSuccess](state, { payload: { data } }) {
    const setIdAndStatusForEachEl = data.map((e) => {
      const setOpenStatus = _.set(e, 'status', 'close');
      return _.pick(setOpenStatus, ['id', 'status']);
    });
    const initialIsOpenEl = _.mapKeys({ ...setIdAndStatusForEachEl }, (key) => key.id);
    return {
      isOpenEl: _.mapKeys({ ...setIdAndStatusForEachEl }, (key) => key.id),
      initialIsOpenEl,
    };
  },
  [actions.findElementBySelector](state) {
    const { initialIsOpenEl } = state;
    const els = initialIsOpenEl;
    return { isOpenEl: _.pick(els, allIdsForUiState.map((e) => Number(e))), initialIsOpenEl };
  },
  [actions.openElement](state, { payload: { isOpenEl: { id } } }) {
    const { isOpenEl, initialIsOpenEl } = state;
    const switcher = (s) => (s === 'close' ? 'open' : 'close');
    return { isOpenEl: _.update(isOpenEl, `${id}.status`, switcher), initialIsOpenEl };
  },
  [actions.nextOrPrevElement](state, { payload: { isOpenEl: { id, type } } }) {
    const { isOpenEl, initialIsOpenEl } = state;
    const keys = _.keys(isOpenEl);
    const currentElIndex = _.findIndex(keys, (e) => e === id);
    const firstEl = _.head(keys);
    const lastEl = _.last(keys);
    const nextId = id === lastEl ? firstEl : keys[currentElIndex + 1];
    const prevId = id === firstEl ? lastEl : keys[currentElIndex - 1];
    const switcher = (s) => (s === 'close' ? 'open' : 'close');
    const updatedCurrentEl = _.update(isOpenEl, `${id}.status`, switcher);
    return {
      isOpenEl: _.update(updatedCurrentEl, `${type === 'next' ? nextId : prevId}.status`, switcher),
      initialIsOpenEl,
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

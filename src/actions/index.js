import _ from 'lodash';
import axios from 'axios';
import { createAction } from 'redux-actions';
// import routes from '../routes';

// const getCurrentRoute = {
//   Country: 'getCountries',
//   Capital: 'getCapitalSities',
//   Region: 'getRegion',
//   Languge: 'getLanguge',
// };

export const updateText = createAction('UPDATE_TEXT');

export const updateSelector = createAction('UPDATE_CURRENT_SELECTOR');

export const buildFilter = createAction('BUILD_FILTER');

export const openElement = createAction('OPEN_ELEMENT');

export const isExactSearch = createAction('ADD_EXACT_SEARCH');

export const nextOrPrevElement = createAction('SWITCH_TO_NEXT_OR_PREV_ELEMENT');

export const findElementBySelector = createAction('FIND_ELEMENT_BY_SELECTOR');

export const fetchElementsRequest = createAction('NEW_SEARCH_REQUEST');
export const fetchElementsSuccess = createAction('NEW_SEARCH_SUCCESS');
export const fetchElementsFailure = createAction('NEW_SEARCH_FAILURE');


export const fetchElements = () => async (dispatch) => {
  dispatch(fetchElementsRequest());
  try {
    const url = 'https://restcountries.eu/rest/v2/all';
    const responce = await axios.get(url);
    const setIdToData = responce.data.map((e) => _.set(e, 'id', _.uniqueId()));
    dispatch(fetchElementsSuccess({ data: setIdToData }));
  } catch (e) {
    dispatch(fetchElementsFailure());
    throw e;
  }
};

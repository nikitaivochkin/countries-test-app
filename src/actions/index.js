import _ from 'lodash';
import axios from 'axios';
import { createAction } from 'redux-actions';

export const updateText = createAction('UPDATE_TEXT');

export const buildFilter = createAction('BUILD_FILTER');

export const openElement = createAction('OPEN_ELEMENT');

export const nextOrPrevElement = createAction('SWITCH_TO_NEXT_OR_PREV_ELEMENT');

export const findElementBySelector = createAction('FIND_ELEMENT_BY_SELECTOR');

export const resetFilters = createAction('RESET-FILTERS');

export const fetchElementsRequest = createAction('NEW_SEARCH_REQUEST');
export const fetchElementsSuccess = createAction('NEW_SEARCH_SUCCESS');
export const fetchElementsFailure = createAction('NEW_SEARCH_FAILURE');


export const fetchElements = () => async (dispatch) => {
  dispatch(fetchElementsRequest());
  try {
    const url = 'https://restcountries.eu/rest/v2/all';
    const responce = await axios.get(url);
    console.log(responce.data);
    const setIdToData = responce.data.map((e) => _.set(e, 'id', _.uniqueId()));
    dispatch(fetchElementsSuccess({ data: setIdToData }));
  } catch (e) {
    dispatch(fetchElementsFailure());
    throw e;
  }
};

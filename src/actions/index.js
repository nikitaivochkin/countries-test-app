import axios from 'axios';
import { createAction } from 'redux-actions';

import routes from '../routes'

const getCurrentRoute = {
    Country: 'getCountries',
    Capital: 'getCapitalSities',
    Region: 'getRegion',
    Languge: 'getLanguge',
};

export const updateSelector = createAction('UPDATE_CURRENT_SELECTOR');

export const newSearchRequest = createAction('NEW_SEARCH_REQUEST');
export const newSearchSuccess = createAction('NEW_SEARCH_SUCCESS');
export const newSearchFailure = createAction('NEW_SEARCH_FAILURE');


export const newSearch = ({ text, selector }) => async (dispatch) => {
    dispatch(newSearchRequest());
    try {
        const url = routes[getCurrentRoute[selector]](text);
        const responce = await axios.get(url);
        dispatch(newSearchSuccess({ data: responce.data, currentSelector: selector }));
    } catch (e) {
        dispatch(newSearchFailure());
        throw e;
    }
};
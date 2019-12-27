import axios from 'axios';
import { createAction } from 'redux-actions';

import routes from '../routes'

const getCurrentRoute = {
    Country: 'getCountries',
    Capital: 'getCapitalSities',
    Region: 'getRegion',
    Languge: 'getLanguge',
};

export const newSearchSuccess = createAction('NEW_SEARCH');

export const newSearch = ({ text, selector }) => async (dispatch) => {
    const url = routes[getCurrentRoute[selector]](text);
    const responce = await axios.get(url);
    dispatch(newSearchSuccess({ data: responce.data, currentSelecrot: selector }));
};
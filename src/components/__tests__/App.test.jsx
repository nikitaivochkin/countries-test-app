import _ from 'lodash';
import React from 'react';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import { render, fireEvent } from '@testing-library/react';
import App from '../App/index';
import reducers from '../../reducers/index';
import responce from './__fixtures__/countries.json';

const renderWithRedux = (ui,
  { initialState, store = createStore(reducers, initialState, applyMiddleware(thunk)) } = {}) => ({
  ...render(<Provider store={store}>{ui}</Provider>),
  store,
});

const data = responce.map((e) => _.set(e, 'id', _.uniqueId()));
const allIdsElements = data.map((e) => e.id);
const mainData = _.mapKeys({ ...data }, (key) => key.id);
const setIdAndStatusForEachEl = data.map((e) => {
  const setOpenStatus = _.set(e, 'status', 'close');
  return _.pick(setOpenStatus, ['id', 'status']);
});

let initialState = {
  text: '',
  elementsFetchState: 'finished',
  elements: { byId: mainData, allIds: [...allIdsElements], filter: {} },
  uiState: {
    isOpenEl: _.mapKeys({ ...setIdAndStatusForEachEl }, (key) => key.id),
    initialIsOpenEl: _.mapKeys({ ...setIdAndStatusForEachEl }, (key) => key.id),
  },
  form: {},
};


describe('test filters', () => {
  it('change country name', () => {
    const {
      getByTestId,
      getByText,
      store,
    } = renderWithRedux(<App />, { initialState });
    const nameInput = getByTestId('name');
    fireEvent.change(nameInput, { target: { value: 'norway' } });
    const result = getByTestId('result');

    expect(result).toContainElement(getByText('Norway'));
    expect(store.getState().elements.filter).toStrictEqual({ name: 'norway' });
  });

  it('change region', () => {
    const {
      getByTestId,
      store,
    } = renderWithRedux(<App />, { initialState });

    const nameInput = getByTestId('name');
    const regionInput = getByTestId('region');

    fireEvent.change(regionInput, { target: { value: 'oceania' } });
    fireEvent.change(nameInput, { target: { value: '' } });

    initialState = store.getState();
    expect(store.getState().elements.filter).toStrictEqual({ region: 'oceania' });
  });

  it('change subregion', () => {
    const {
      getByTestId,
      getByText,
      store,
    } = renderWithRedux(<App />, { initialState });

    const subregionInput = getByTestId('subregion');
    fireEvent.change(subregionInput, { target: { value: 'Polynesia' } });
    const result = getByTestId('result');

    initialState = store.getState();
    expect(result).toContainElement(getByText('Samoa'));
    expect(store.getState().elements.filter).toStrictEqual({ region: 'oceania', subregion: 'Polynesia' });
  });

  it('reset region', () => {
    const {
      getByTestId,
      store,
    } = renderWithRedux(<App />, { initialState });

    const regionInput = getByTestId('region');
    fireEvent.change(regionInput, { target: { value: 'reset' } });

    initialState = store.getState();
    expect(store.getState().elements.filter).toStrictEqual({ });
    expect(store.getState().elements.allIds.length).toBe(data.length);
  });

  it('wrong country name', () => {
    const {
      getByTestId,
      store,
    } = renderWithRedux(<App />, { initialState });

    const nameInput = getByTestId('name');
    fireEvent.change(nameInput, { target: { value: 'dajhvavfhabfjkas' } });
    const result = getByTestId('result');

    initialState = store.getState();
    expect(result.children.length).toBe(0);
    expect(store.getState().elements.filter).toStrictEqual({ name: 'dajhvavfhabfjkas' });
    expect(store.getState().elements.allIds.length).toBe(0);
  });
});

describe('test modal window', () => {
  it('click to element', () => {
    const {
      getByTestId,
      store,
    } = renderWithRedux(<App />, { initialState });
    const nameInput = getByTestId('name');

    fireEvent.change(nameInput, { target: { value: 'norway' } });

    const element = getByTestId('Norway');
    const elId = store.getState().elements.allIds[0];
    fireEvent.click(element, { bubbles: true });
    const result = getByTestId('result');

    initialState = store.getState();
    expect(result.children.length).toBe(2);
    expect(store.getState().uiState.isOpenEl[elId].status).toBe('open');
  });

  it('click to neighbor country', () => {
    const {
      container,
      getByTestId,
      store,
    } = renderWithRedux(<App />, { initialState });

    const neighbor = container.querySelector('span[value="Finland"]');
    fireEvent.click(neighbor, { bubbles: true });
    const result = getByTestId('result');
    const elId = store.getState().elements.allIds[0];


    initialState = store.getState();
    expect(result.children.length).toBe(2);
    expect(store.getState().elements.filter).toStrictEqual({ name: 'Finland' });
    expect(store.getState().uiState.isOpenEl[elId].status).toBe('open');
  });

  it('close modal window', () => {
    const {
      container,
      getByTestId,
      store,
    } = renderWithRedux(<App />, { initialState });

    const closeBtn = container.querySelector('.modal-content__modal-title-close');
    fireEvent.click(closeBtn, { bubbles: true });

    const elId = store.getState().elements.allIds[0];
    const result = getByTestId('result');

    initialState = store.getState();
    expect(result.children.length).toBe(1);
    expect(store.getState().elements.filter).toStrictEqual({ name: 'Finland' });
    expect(store.getState().uiState.isOpenEl[elId].status).toBe('close');
  });

  it('click to next', () => {
    const {
      getByTestId,
      store,
    } = renderWithRedux(<App />, { initialState });

    const nameInput = getByTestId('name');
    const populationMinInput = getByTestId('population-Min');

    fireEvent.change(populationMinInput, { target: { value: 500 } });
    fireEvent.change(nameInput, { target: { value: '' } });

    const element1 = getByTestId('China');
    const elId1 = store.getState().elements.allIds[0];
    const elId2 = store.getState().elements.allIds[1];

    fireEvent.click(element1, { bubbles: true });

    const clickNext = getByTestId('clickNext');
    fireEvent.click(clickNext, { bubbles: true });

    const result = getByTestId('result');

    initialState = store.getState();
    expect(result.children.length).toBe(3);
    expect(store.getState().elements.filter).toStrictEqual({ populationMin: '500' });
    expect(store.getState().uiState.isOpenEl[elId2].status).toBe('open');
    expect(store.getState().uiState.isOpenEl[elId1].status).toBe('close');
  });

  it('click to next one more time', () => {
    const {
      getByTestId,
      store,
    } = renderWithRedux(<App />, { initialState });

    const elId1 = store.getState().elements.allIds[0];
    const elId2 = store.getState().elements.allIds[1];

    const clickNext = getByTestId('clickNext');
    fireEvent.click(clickNext, { bubbles: true });

    const result = getByTestId('result');

    initialState = store.getState();
    expect(result.children.length).toBe(3);
    expect(store.getState().elements.filter).toStrictEqual({ populationMin: '500' });
    expect(store.getState().uiState.isOpenEl[elId2].status).toBe('close');
    expect(store.getState().uiState.isOpenEl[elId1].status).toBe('open');
  });

  it('click to prev', () => {
    const {
      getByTestId,
      store,
    } = renderWithRedux(<App />, { initialState });

    const elId1 = store.getState().elements.allIds[0];
    const elId2 = store.getState().elements.allIds[1];

    const clickPrev = getByTestId('clickPrev');
    fireEvent.click(clickPrev, { bubbles: true });

    const result = getByTestId('result');

    initialState = store.getState();
    expect(result.children.length).toBe(3);
    expect(store.getState().elements.filter).toStrictEqual({ populationMin: '500' });
    expect(store.getState().uiState.isOpenEl[elId2].status).toBe('open');
    expect(store.getState().uiState.isOpenEl[elId1].status).toBe('close');
  });

  it('close modal window again', () => {
    const {
      container,
      getByTestId,
      store,
    } = renderWithRedux(<App />, { initialState });

    const closeBtn = container.querySelector('.modal-content__modal-title-close');
    fireEvent.click(closeBtn, { bubbles: true });

    const elId1 = store.getState().elements.allIds[0];
    const elId2 = store.getState().elements.allIds[1];
    const result = getByTestId('result');

    initialState = store.getState();
    expect(result.children.length).toBe(2);
    expect(store.getState().elements.filter).toStrictEqual({ populationMin: '500' });
    expect(store.getState().uiState.isOpenEl[elId1].status).toBe('close');
    expect(store.getState().uiState.isOpenEl[elId2].status).toBe('close');
  });

  it('clear filters', () => {
    const {
      getByTestId,
      store,
    } = renderWithRedux(<App />, { initialState });

    const clearFilters = getByTestId('clearFilters');
    fireEvent.click(clearFilters, { bubbles: true });
    const populationMinInput = getByTestId('population-Min');

    initialState = store.getState();
    expect(populationMinInput.value).toBe('');
    expect(store.getState().elements.filter).toStrictEqual({ });
  });
});

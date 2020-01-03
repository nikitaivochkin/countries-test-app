import _ from 'lodash';
import React from 'react';
import { connect } from 'react-redux';
import RenderElement from '../RenderElement';
// import * as actions from '../../actions';
import './main.sass';
import allCountriesAlpha3Data from '../../assets/countryCodes.js';


const mapStateToPorps = (state) => {
  const { searchFetchingState, elements: { byId, allIds }, uiState } = state;
  const { currentSelector } = uiState;
  const elements = allIds.map((id) => byId[id]);
  return { searchFetchingState, elements, currentSelector };
};

class ReceivedData extends React.Component {
  render() {
    const { searchFetchingState, elements } = this.props;

    if (searchFetchingState === 'requested') {
      return (
        <div className="result">
          <div className="spinner" role="status">
            <span className="sr-only">Loading...</span>
          </div>
        </div>
      );
    }
    if (searchFetchingState === 'failed') {
      return (
        <div className="result">
          <span>Nothing was found. Try again!</span>
        </div>
      );
    }

    return elements.length > 0 && (
    <div className="result">
      {elements.map((e) => <RenderElement key={_.uniqueId()} element={e} />)}
    </div>
    );
  }
}

export default connect(mapStateToPorps)(ReceivedData);

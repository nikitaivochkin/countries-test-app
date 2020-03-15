import _ from 'lodash';
import React from 'react';
import { connect } from 'react-redux';
import RenderElement from '../RenderElement';
import './main.sass';

const mapStateToPorps = (state) => {
  const { searchFetchingState, elements: { byId, allIds, filter } } = state;
  const mappedElements = allIds.map((id) => byId[id]);
  return { searchFetchingState, mappedElements, filter };
};

class ReceivedData extends React.PureComponent {
  render() {
    const { searchFetchingState, mappedElements, filter } = this.props;

    if (searchFetchingState === 'requested') {
      return (
        <div className="result">
          <div className="spinner" role="status">
            <span className="sr-only">Loading...</span>
          </div>
        </div>
      );
    } if (searchFetchingState === 'failed') {
      return (
        <div className="result">
          <span>Nothing was found. Try again!</span>
        </div>
      );
    }

    return _.keys(filter).length > 0 && (
      <div className="result" data-testid="result">
        {mappedElements.map((e) => <RenderElement key={_.uniqueId()} element={e} />)}
      </div>
    );
  }
}

export default connect(mapStateToPorps)(ReceivedData);

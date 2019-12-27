import _ from 'lodash';
import React from 'react';
import { connect } from 'react-redux';
import { Field, reduxForm } from 'redux-form';
import * as actions from '../../actions';
import './main.sass';

const mapStateToPorps = (state) => {
  const { searchFetchingState, elements: { byId, allIds } } = state;
  const elements = allIds.map((id) => byId[id]);
  return { searchFetchingState, elements };
};

const actionCreators = {

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
          <ul>
            {elements.map(({ name }) => (
              <li key={_.uniqueId()}>
                {name}
              </li>
            ))}
          </ul>
          
        </div>
      ); 
  }
};

const ConnectedReceivedData = connect(mapStateToPorps, actionCreators)(ReceivedData);

export default reduxForm({
  form: 'navBar',
})(ConnectedReceivedData);
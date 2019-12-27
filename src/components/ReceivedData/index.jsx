import _ from 'lodash';
import React from 'react';
import { connect } from 'react-redux';
import { Field, reduxForm } from 'redux-form';
import * as actions from '../../actions';
import './main.sass';

const mapStateToPorps = ({ elements: { byId, allIds } }) => {
  const elements = allIds.map((id) => byId[id]);
  return { elements };
};

const actionCreators = {

};

class ReceivedData extends React.Component {

  render() {
    const { elements } = this.props;
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
import React from 'react';
import { connect } from 'react-redux';
import { Field, reduxForm, SubmissionError } from 'redux-form';
import * as actions from '../../actions';
import './main.sass';

const mapStateToPorps = (state) => {
  const props = {
    elements: state.elements,
  };
  return props;
};

const actionCreators = {
  newSearch: actions.newSearch,
};

class MainInput extends React.Component {
  handleNewSearch = async (values) => {
    const { newSearch, reset } = this.props;
    await newSearch(values);
    reset();
  }

  render() {
    const { handleSubmit } = this.props;

    return (
      <div className="search-bar">
        <form onSubmit={handleSubmit(this.handleNewSearch)} className="serch-bar-form">
          <div className="row">
            <div className="search-bar-row row1">
              <Field className="search-bar-input" name="text" component="input" required type="text" placeholder="Enter some text" />
            </div>
            <div className="search-bar-row row2">
              <Field className="search-bar-select" name="selector" component="select" required placeholder="Enter some text">
                <option className="search-bar-option" defaultValue="selected"></option>
                <option className="search-bar-option" value="Country">Country</option>
                <option className="search-bar-option" value="Capital">Capital</option>
                <option className="search-bar-option" value="Region">Region</option>
                <option className="search-bar-option" value="Languge">Languge</option>
              </Field>
            </div>
            <div className="serch-bar-button" type="submit">
              <button>Search</button>
            </div>
          </div>
        </form>
      </div>
    );
  }
};

const ConnectedMainInput = connect(mapStateToPorps, actionCreators)(MainInput);

export default reduxForm({
    form: 'MainInput',
})(ConnectedMainInput);
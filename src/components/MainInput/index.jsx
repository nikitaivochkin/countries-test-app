/* eslint-disable react/prefer-stateless-function */
import React from 'react';
import { connect } from 'react-redux';
import { Field, reduxForm } from 'redux-form';
import * as actions from '../../actions';
import './main.sass';

const mapStateToPorps = (state) => {
  const props = {
    elements: state.elements,
    uiState: state.uiState,
  };
  return props;
};

const actionCreators = {
  updateText: actions.updateText,
  updateSelector: actions.updateSelector,
  findElementBySelector: actions.findElementBySelector,
};

class MainInput extends React.Component {
  // handleNewSearch = async (values) => {
  //   const { newSearch, reset } = this.props;
  //   await newSearch(values);
  //   reset();
  // }


  handleUpdateCurrentSelector = ({ target: { value } }) => {
    const { updateSelector } = this.props;
    updateSelector({ newSelector: value });
  }

  handleAutocompliteBySelector = ({ target: { value } }) => {
    const { updateText, findElementBySelector } = this.props;
    updateText({ text: value });
    findElementBySelector({ text: value });
  }

  render() {
    const { elements: { selector } } = this.props;

    return (
      <div className="search-bar">
        <form className="serch-bar-form">
          <div className="row">
            <div className="search-bar-row row1">
              {selector === 'region' ? null : (
                <Field onChange={this.handleAutocompliteBySelector} className="search-bar-input" name="text" component="input" required type="text" placeholder="Enter some text" />
              )}
            </div>
            <div className="search-bar-row row2">
              <Field onChange={this.handleUpdateCurrentSelector} className="search-bar-select" name="selector" component="select" required placeholder="Enter some text">
                <option defaultValue="none" disabled hidden>
                  Select an Option
                </option>
                <option className="search-bar-option" value="name">Country</option>
                <option className="search-bar-option" value="capital">Capital</option>
                <option className="search-bar-option" value="region">Region</option>
                <option className="search-bar-option" value="languages">Languge</option>
              </Field>
            </div>
            {selector === 'region' ? (
              <div className="search-bar-row row3">
                <Field onChange={this.handleAutocompliteBySelector} className="search-bar-select" name="selector" component="select" required placeholder="Enter some text">
                  <option defaultValue="none" disabled hidden>
                    Select an Option
                  </option>
                  <option className="search-bar-option" value="africa">Africa</option>
                  <option className="search-bar-option" value="americas">Americas</option>
                  <option className="search-bar-option" value="europe">Europe</option>
                  <option className="search-bar-option" value="oceania">Oceania</option>
                </Field>
              </div>
            ) : null}
            <div className="serch-bar-button" type="submit">
              <button type="submit">Search</button>
            </div>
          </div>
        </form>
      </div>
    );
  }
}

const ConnectedMainInput = connect(mapStateToPorps, actionCreators)(MainInput);

export default reduxForm({
  form: 'MainInput',
})(ConnectedMainInput);

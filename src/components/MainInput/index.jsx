/* eslint-disable react/prefer-stateless-function */
import React from 'react';
import { connect } from 'react-redux';
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
  handleUpdateCurrentSelector = ({ target: { value } }) => {
    const { updateSelector } = this.props;
    updateSelector({ newSelector: value });
  }

  handleAutocompliteBySelector = ({ target: { value } }) => {
    const { updateText, findElementBySelector } = this.props;
    updateText({ text: value });
    findElementBySelector({ inputValue: value });
  }

  render() {
    const { elements: { selector } } = this.props;

    return (
      <div className="search-bar">
        <form className="serch-bar-form">
          <div className="row">
            <div className="search-bar-row row1">
              {selector === 'region' ? null : (
                <input onChange={this.handleAutocompliteBySelector} disabled={selector === 'disabled'} className="search-bar-input" name="text" component="input" required type="text" placeholder="Enter some text" />
              )}
            </div>
            {selector === 'region' ? (
              <div className="search-bar-row row3">
                <select onChange={this.handleAutocompliteBySelector} className="search-bar-select" name="selector" component="select" required placeholder="Enter some text">
                  <option className="search-bar-option" value="disabled">Make choose</option>
                  <option className="search-bar-option" value="africa">Africa</option>
                  <option className="search-bar-option" value="americas">Americas</option>
                  <option className="search-bar-option" value="europe" defaultValue>Europe</option>
                  <option className="search-bar-option" value="oceania">Oceania</option>
                </select>
              </div>
            ) : null}
            <div className="search-bar-row row2">
              <select onChange={this.handleUpdateCurrentSelector} className="search-bar-select" name="selector" component="select" required placeholder="Enter some text">
                <option className="search-bar-option" value="disabled">Make choose</option>
                <option className="search-bar-option" value="name">Country</option>
                <option className="search-bar-option" value="capital">Capital</option>
                <option className="search-bar-option" value="region">Region</option>
                <option className="search-bar-option" value="languages">Languge</option>
              </select>
            </div>
          </div>
        </form>
      </div>
    );
  }
}

export default connect(mapStateToPorps, actionCreators)(MainInput);

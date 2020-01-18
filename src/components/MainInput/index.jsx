/* eslint-disable react/prefer-stateless-function */
import _ from 'lodash';
import React from 'react';
import { connect } from 'react-redux';
import * as actions from '../../actions';
import './main.sass';
import { regions, regionalBlocs } from '../../assets/options.js';

const mapStateToPorps = (state) => {
  const props = {
    text: state.text,
    elements: state.elements,
    uiState: state.uiState,
  };
  return props;
};

const actionCreators = {
  updateText: actions.updateText,
  updateSelector: actions.updateSelector,
  buildFilter: actions.buildFilter,
  findElementBySelector: actions.findElementBySelector,
  isExactSearch: actions.isExactSearch,
};

class MainInput extends React.Component {
  handleUpdateCurrentSelector = (lvl) => ({ target: { value } }) => {
    const { updateSelector } = this.props;
    updateSelector({ newSelector: `${value}_${lvl}` });
  }

  handleAutocompliteBySelector = (selector) => ({ target: { value } }) => {
    const { updateText, buildFilter, findElementBySelector } = this.props;
    updateText({ value });
    buildFilter({ selector, value });
    findElementBySelector();
  }

  handleTurnOnExactSearch = () => {
    const { elements: { exactSearchStatus } } = this.props;
    const { isExactSearch } = this.props;
    isExactSearch({ status: exactSearchStatus });
  }

  render() {
    const { elements: { currentSelector, exactSearchStatus }, text } = this.props;

    const getOptionstDependsOnSelector = {
      region: regions.map(([v, t]) => (
        <option key={_.uniqueId()} className="search-bar-option" value={v}>{t}</option>
      )),
      regionalBlocs: regionalBlocs.map(([v, t]) => (
        <option key={_.uniqueId()} className="search-bar-option" value={v}>{t}</option>
      )),
    };
    const [selector] = currentSelector.split('_');
    return (
      <div className="search-bar">
        <form className="serch-bar-form">
          <div className="row">
            <div className="search-bar-row row1">
              {getOptionstDependsOnSelector[selector] ? (
                <div className="search-bar-row row3">
                  <select onChange={this.handleAutocompliteBySelector(currentSelector)} className="search-bar-select" name="selector" component="select" required>
                    {getOptionstDependsOnSelector[selector]}
                  </select>
                </div>
              ) : (
                <input onChange={this.handleAutocompliteBySelector(currentSelector)} disabled={currentSelector === 'disabled'} value={text} className="search-bar-input" name="text" component="input" required type="text" placeholder="Enter some text" />
              )}
            </div>
            <div className="search-bar-row row2">
              <select onChange={this.handleUpdateCurrentSelector(0)} className="search-bar-select" name="selector" component="select" required placeholder="Enter some text">
                <option className="search-bar-option" value="disabled">Make choose</option>
                <option className="search-bar-option" value="name">Country</option>
                <option className="search-bar-option" value="capital">Capital</option>
                <option className="search-bar-option" value="languages">Languge</option>
                <option className="search-bar-option" value="callingCodes">Calling codes</option>
                <option className="search-bar-option" value="region">Region</option>
                <option className="search-bar-option" value="regionalBlocs">Regional Blocs</option>
              </select>
            </div>
            {selector === 'disabled' ? null : (
              <div className="search-bar-check">
                <label className="search-bar-check-label" htmlFor="rules">
                  <input
                    onChange={this.handleTurnOnExactSearch}
                    checked={exactSearchStatus === 'yes'}
                    id="rules"
                    type="checkbox"
                    className="search-bar-check-input"
                    disabled={getOptionstDependsOnSelector[currentSelector]}
                  />
                  Exact search
                </label>
              </div>
            )}
          </div>
        </form>
        {getOptionstDependsOnSelector[selector] ? (
          <h2 className="search-bar-title">{_.toUpper(text)}</h2>
        ) : null }
      </div>
    );
  }
}

export default connect(mapStateToPorps, actionCreators)(MainInput);

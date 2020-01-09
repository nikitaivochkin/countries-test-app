/* eslint-disable react/prefer-stateless-function */
import _ from 'lodash';
import React from 'react';
import { connect } from 'react-redux';
import * as actions from '../../actions';
import './main.sass';
import { regions, regionalBlocs, regionsAndSubregions } from '../../assets/options.js';

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
  findElementBySelector: actions.findElementBySelector,
  isExactSearch: actions.isExactSearch,
};

class MainInput extends React.Component {
  constructor(props) {
    super(props);
    this.state = { subSelector: '' };
  }

  handleUpdateCurrentSelector = ({ target: { value } }) => {
    const { updateSelector } = this.props;
    updateSelector({ newSelector: value });
  }

  handleUpdateSubSelector = ({ target: { value } }) => {
    this.setState({ subSelector: value });
  }

  handleAutocompliteBySelector = ({ target: { value } }) => {
    const { updateText, findElementBySelector } = this.props;
    updateText({ value });
    findElementBySelector({ inputValue: value });
  }

  handleTurnOnExactSearch = () => {
    const { elements: { exactSearchStatus } } = this.props;
    const { isExactSearch } = this.props;
    isExactSearch({ status: exactSearchStatus });
  }

  onChangeForSelect = (e) => {
    this.handleAutocompliteBySelector(e);
    this.handleUpdateSubSelector(e);
  };

  render() {
    const { elements: { selector, exactSearchStatus }, text } = this.props;
    const { subSelector } = this.state;

    const getOptionstDependsOnSelector = {
      region: regions.map(([v, t]) => (
        <option key={_.uniqueId()} className="search-bar-option" value={v}>{t}</option>
      )),
      regionalBlocs: regionalBlocs.map(([v, t]) => (
        <option key={_.uniqueId()} className="search-bar-option" value={v}>{t}</option>
      )),
    };

    const isSelectorEqualRegion = regionsAndSubregions[selector];

    return (
      <div className="search-bar">
        <form className="serch-bar-form">
          <div className="row">
            <div className="search-bar-row row1">
              {getOptionstDependsOnSelector[selector] ? null : (
                <input onChange={this.handleAutocompliteBySelector} disabled={selector === 'disabled'} value={text} className="search-bar-input" name="text" component="input" required type="text" placeholder="Enter some text" />
              )}
            </div>
            {getOptionstDependsOnSelector[selector] ? (
              <div className="search-bar-row row3">
                <select onChange={this.onChangeForSelect} className="search-bar-select" name="selector" component="select" required>
                  {getOptionstDependsOnSelector[selector]}
                </select>
              </div>
            ) : null}
            {isSelectorEqualRegion && subSelector !== '' ? (
              <div className="search-bar-row row3">
                <select onChange={this.handleAutocompliteBySelector} className="search-bar-select" name="selector" component="select" required>
                  {_.head(regionsAndSubregions[selector].filter(({ name }) => name === subSelector)).subregions.map((e) => (
                    <option key={_.uniqueId()} className="search-bar-option" value={e === 'Choose subregion' ? 'disabled' : e}>{e}</option>
                  ))}
                </select>
              </div>
            ) : null}
            <div className="search-bar-row row2">
              <select onChange={this.handleUpdateCurrentSelector} className="search-bar-select" name="selector" component="select" required placeholder="Enter some text">
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
                    disabled={getOptionstDependsOnSelector[selector]}
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

/* eslint-disable react/prefer-stateless-function */
import _ from 'lodash';
import React from 'react';
import { connect } from 'react-redux';
import * as actions from '../../actions';
import './main.sass';
import { mainSelect, subregions, options } from '../../assets/options.js';

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
  constructor(props) {
    super(props);
    this.state = { subSelector: null, additionalFilter: 'hide', };
  }

  handleUpdateCurrentSelector = ({ target: { value } }) => {
    const { updateSelector } = this.props;
    this.setState({ subSelector: null });
    updateSelector({ newSelector: value });
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

  hadleUpdateSubselector = (e) => {
    this.setState({ subSelector: e.target.value });
  }

  render() {
    const { elements: { currentSelector, exactSearchStatus }, text } = this.props;
    const { subSelector } = this.state;

    const [selector] = currentSelector.split('_');
    const getFilterForSetect = () => (
      <div className="search-bar-row row3">
        <select
          onChange={(e) => {
            this.handleAutocompliteBySelector(currentSelector)(e);
            this.hadleUpdateSubselector(e);
          }}
          className="search-bar-select"
          name="selector"
          component="select"
          required
          placeholder="Enter some text"
        >
          {options.filter(({ s }) => s === selector).map(({ n, v }) => (
            <option key={_.uniqueId()} className="search-bar-option" value={v}>{n}</option>
          ))}
        </select>
        {subregions[subSelector] ? (
          <select onChange={this.handleAutocompliteBySelector('subregion')} className="search-bar-select" name="selector" component="select" required>
            {subregions[subSelector].map((el) => (<option key={_.uniqueId()} className="search-bar-option" value={el}>{el}</option>))}
          </select>
        ) : null}
      </div>
    );

    const getAction = [
      {
        type: 'select',
        check: (s) => (s === 'region' || s === 'regionalBlocs'),
        action: getFilterForSetect(),
      },
      {
        type: 'input',
        check: (s) => (s !== 'region' || s !== 'regionalBlocs'),
        action: (
          <input onChange={this.handleAutocompliteBySelector(currentSelector)} disabled={selector === 'disabled'} className="search-bar-input" name="text" component="input" required type="text" placeholder="Enter some text" />
        ),
      },
    ];

    const getFilters = () => {
      const { action } = getAction.find((({ check }) => check(selector)));
      return action;
    };

    return (
      <div className="search-bar">
        <form className="serch-bar-form main">
          <div className="row">
            <div className="search-bar-row row1">
              {getFilters()}
            </div>
            <div className="search-bar-row row2">
              <select onChange={this.handleUpdateCurrentSelector} className="search-bar-select" name="selector" component="select" required placeholder="Enter some text">
                {mainSelect.map(([t, v]) => <option key={_.uniqueId()} className="search-bar-option" value={v}>{t}</option>)}
              </select>
            </div>
            <div className="search-bar-check">
              <label className="search-bar-check-label" htmlFor="rules">
                <input
                  onChange={this.handleTurnOnExactSearch}
                  checked={exactSearchStatus === 'yes'}
                  id="rules"
                  type="checkbox"
                  className="search-bar-check-input"
                />
                  Exact search
              </label>
            </div>
          </div>
        </form>
        <form className="serch-bar-form-population">
          <div>
            <label>Population min</label>
            <input onChange={this.handleAutocompliteBySelector('populationMin')} className="search-bar-input" name="PopulationMin" component="input" required placeholder="Enter some num" />
          </div>
          <div>
            <label>Population max</label>
            <input onChange={this.handleAutocompliteBySelector('populationMax')} className="search-bar-input" name="PopulationMax" component="input" required placeholder="Enter some num" />
          </div>
        </form>
        {(selector === 'region' || selector === 'regionalBlocs') ? (
          <h2 className="search-bar-title">{_.toUpper(text)}</h2>
        ) : null }
      </div>
    );
  }
}

export default connect(mapStateToPorps, actionCreators)(MainInput);

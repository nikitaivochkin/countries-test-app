/* eslint-disable react/prefer-stateless-function */
import { uniqueId } from 'lodash';
import cn from 'classnames';
import React from 'react';
import { connect } from 'react-redux';
import * as actions from '../../actions';
import { regions, regionalBlocs, subregions } from '../../assets/options.js';
import './main.sass';

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
  buildFilter: actions.buildFilter,
  findElementBySelector: actions.findElementBySelector,
};

class MainInput extends React.Component {
  constructor(props) {
    super(props);
    this.state = { filterStatus: 'hide', };
  }

  handleAutocomplite = (selector) => ({ target: { value } }) => {
    const { updateText, buildFilter, findElementBySelector } = this.props;
    updateText({ value });
    buildFilter({ selector, value });
    findElementBySelector();
  }

  handleShowHideAllFilters = () => {
    const { filterStatus } = this.state;
    this.setState({ filterStatus: filterStatus === 'hide' ? 'show' : 'hide' });
  }

  render() {
    const { text, elements: { filter } } = this.props;
    const { filterStatus } = this.state;

    const filtersClassName = cn({
      'serch-bar__filters': true,
      [filterStatus]: true,
    });

    return (
      <div className="search-bar">
        <div className="serch-bar__main">
            <input
              onChange={this.handleAutocomplite('name')}
              className="serch-bar__filters__input serch-bar__filters__input-name"
              name="text"
              component="input"
              required type="text"
              placeholder="Enter country name"
            />
        </div>
        <div onClick={this.handleShowHideAllFilters} className="open-filters">
          {
            filterStatus === 'hide' ? 
              (<a className="open-filters__link">&darr; Show all filters &darr;</a>) :
              (<a className="open-filters__link">&uarr; Hide all filters &uarr;</a>)
          }
        </div>
        <div className={filtersClassName}>
          <div className="serch-bar__inputs">
            <div className="serch-bar__filters__input">
              <input 
                onChange={this.handleAutocomplite('capital')}
                className="serch-bar__filters__input serch-bar__filters__input-capital" 
                name="text" 
                component="input"
                required type="text"
                placeholder="Enter capital name"
              />
            </div>
            <div className="serch-bar__filters__input">
              <input
                onChange={this.handleAutocomplite('languages')}
                className="serch-bar__filters__input serch-bar__filters__input-languages"
                name="text"
                component="input"
                required type="text"
                placeholder="Enter language name"
              />
            </div>
            <div className="serch-bar__filters__input">
              <input
                onChange={this.handleAutocomplite('callingCodes')}
                className="serch-bar__filters__input serch-bar__filters__input-languages"
                name="text"
                component="input"
                required type="text"
                placeholder="Enter calling code"
              />
            </div>
          </div>
          <div className="serch-bar__selectors">
            <div className="serch-bar__filters__select">
              <select
                onChange={this.handleAutocomplite('region')}
                className="serch-bar__filters__select serch-bar__filters__select-region"
                name="region"
                component="select"
                value={text}
                required
                placeholder="Choose region"  
              >
                {
                  regions.map(([value, name]) => (
                    <option key={uniqueId()} className="select-option" value={value}>{name}</option>
                  ))
                }
              </select>
            </div>
            <div className="serch-bar__filters__select">
              <select
                onChange={this.handleAutocomplite('subregion')}
                className="serch-bar__filters__select serch-bar__filters__select-subregion"
                name="subregion"
                component="select"
                value={text}
                disabled={!filter['region']}
                required
                placeholder="Choose subregion"  
              >
                {
                  filter['region'] ? subregions[filter['region']].map((name) => (
                    <option key={uniqueId()} className="select-option" value={name}>{name}</option>
                  )) : null
                }
              </select>
            </div>
            <div className="serch-bar__filters__select">
              <select
                onChange={this.handleAutocomplite('regionalBlocs')}
                className="serch-bar__filters__select serch-bar__filters__select-region"
                name="regionalBlocs"
                component="select"
                value={text}
                required
                placeholder="Choose regional bloc"  
              >
                {
                  regionalBlocs.map(([value, name]) => (
                    <option key={uniqueId()} className="select-option" value={value}>{name}</option>
                  ))
                }
              </select>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default connect(mapStateToPorps, actionCreators)(MainInput);


{/* <form className="serch-bar-form-population">
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
) : null } */}
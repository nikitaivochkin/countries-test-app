import cn from 'classnames';
import React from 'react';
import { connect } from 'react-redux';
import * as actions from '../../actions';
import Inputs from './_inputs';
import Selects from './_selects';
import ReceivedData from '../ReceivedData';
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
  resetFilters: actions.resetFilters,
};

class MainInput extends React.Component {
  constructor(props) {
    super(props);
    this.state = { filterStatus: 'hide' };
  }

  handleAutocomplite = (selector) => ({ target: { value } }) => {
    const { updateText, buildFilter, findElementBySelector } = this.props;
    updateText({ value });
    buildFilter({ selector, value });
    findElementBySelector();
  };

  handleResetFilters = () => {
    const { resetFilters } = this.props;
    resetFilters();
  }

  handleShowHideAllFilters = () => {
    const { filterStatus } = this.state;
    this.setState({ filterStatus: filterStatus === 'hide' ? 'show' : 'hide' });
  };

  render() {
    const { elements: { filter } } = this.props;
    const { filterStatus } = this.state;

    const filtersClassName = cn({
      'serch-bar__filters': true,
      [filterStatus]: true,
    });

    return (
      <>
        <div className={filtersClassName}>
          <div className="serch-bar__filters-body">
            <div onClick={this.handleShowHideAllFilters} onKeyDown={() => {}} role="button" tabIndex={0} className="open-filters">
              {
                  filterStatus === 'hide'
                    ? (<span className="open-filters__link">&darr; Show all filters &darr;</span>)
                    : (<span className="open-filters__link">&uarr; Hide all filters &uarr;</span>)
                }
            </div>
            <div className="serch-bar__selects">
              <Selects filter={filter} handleAutocomplite={this.handleAutocomplite} />
            </div>
            <div className="serch-bar__inputs">
              <Inputs filter={filter} handleAutocomplite={this.handleAutocomplite} />
            </div>
          </div>
        </div>
        <div className="search-bar">
          <div className="serch-bar__main">
            <input
              onChange={this.handleAutocomplite('name')}
              className="serch-bar__filters__input serch-bar__filters__input-name"
              name="text"
              component="input"
              required
              type="text"
              placeholder="Enter country name"
              data-testid="name"
              value={filter.name ? filter.name : ''}
            />
          </div>
          {Object.keys(filter).length !== 0 && (
            <div
              onClick={this.handleResetFilters}
              className="serch-bar__filters__reset"
              onKeyDown={() => {}}
              role="button"
              tabIndex={0}
              data-testid="clearFilters"
            >
              <button className="serch-bar__filters__reset__btn" type="button">Reset all filters</button>
            </div>
          )}
          <ReceivedData />
        </div>
      </>
    );
  }
}

export default connect(mapStateToPorps, actionCreators)(MainInput);

/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable react/prefer-stateless-function */
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

  handleShowHideAllFilters = () => {
    const { filterStatus } = this.state;
    this.setState({ filterStatus: filterStatus === 'hide' ? 'show' : 'hide' });
  };

  render() {
    const { text, elements: { filter } } = this.props;
    const { filterStatus } = this.state;

    const filtersClassName = cn({
      'serch-bar__filters': true,
      [filterStatus]: true,
    });

    return (
      <>
        <div className={filtersClassName}>
          <div className="serch-bar__filters-body">
            <div onClick={this.handleShowHideAllFilters} onKeyDown={() => {}} className="open-filters">
              {
                  filterStatus === 'hide'
                    ? (<span className="open-filters__link">&darr; Show all filters &darr;</span>)
                    : (<span className="open-filters__link">&uarr; Hide all filters &uarr;</span>)
                }
            </div>
            <div className="serch-bar__selects">
              <Selects text={text} filter={filter} handleAutocomplite={this.handleAutocomplite} />
            </div>
            <div className="serch-bar__inputs">
              <Inputs handleAutocomplite={this.handleAutocomplite} />
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
              value={filter.name ? filter.name : text}
            />
          </div>
          <ReceivedData />
        </div>
      </>
    );
  }
}

export default connect(mapStateToPorps, actionCreators)(MainInput);

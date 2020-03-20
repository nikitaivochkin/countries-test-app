/* eslint-disable react/jsx-props-no-spreading */
import _ from 'lodash';
import React from 'react';
import { connect } from 'react-redux';
import cn from 'classnames';
import ArrowKeysReact from 'arrow-keys-react';
import * as actions from '../../actions';
import data from '../../assets/alpha3Code.json';
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
  openElement: actions.openElement,
  nextOrPrevElement: actions.nextOrPrevElement,
  updateText: actions.updateText,
  buildFilter: actions.buildFilter,
  findElementBySelector: actions.findElementBySelector,
};

class ModalWindow extends React.Component {
  componentDidMount() {
    this.mainDiv.focus();
  }

    handleSwitchToNextElement = (id, type) => () => {
      const { nextOrPrevElement } = this.props;
      nextOrPrevElement({ isOpenEl: { id, type } });
    }

    handleOpenElement = (id) => (e) => {
      e.stopPropagation();
      const { openElement } = this.props;
      openElement({ isOpenEl: { id } });
    }

    handleAutocomplite = (selector) => ({ target: { textContent } }) => {
      const { updateText, buildFilter, findElementBySelector } = this.props;
      updateText({ value: textContent });
      buildFilter({ selector, value: textContent, resetFilter: true });
      findElementBySelector();
    };

    mappedBodyContent(el, margin = 0) {
      const { elements: { byId } } = this.props;

      const getNormalizedString = (str) => _.capitalize(_.lowerCase(str));

      const getCountryName = (alpha3) => data.find((obj) => obj['alpha-3'] === alpha3).name;
      const getCountryId = (countryName) => _.findKey(byId, ({ name }) => name === countryName);

      const getAction = [
        {
          type: 'null',
          check: (value) => (value === null || value === '' || value.length === 0),
          action: () => null,
        },
        {
          type: 'stringOrNumber',
          check: (value) => (typeof value === 'string' || typeof value === 'number'),
          action: (key, value) => (
            <div className="modal-body__body-content__body-content-element">
              <h3 className="modal-body__body-content__body-content-element-title">{`${getNormalizedString(key)}: `}</h3>
              <span>{value}</span>
            </div>
          ),
        },
        {
          type: 'array',
          check: (value) => value instanceof Array,
          action: (key, value) => {
            if (value.some((e) => e instanceof Object)) {
              return (
                <div className="modal-body__body-content__body-content-element">
                  {<h3 className="modal-body__body-content__body-content-element-title inside">{`${getNormalizedString(key)}:`}</h3>}
                  {value.map((e) => (
                    <div key={_.uniqueId()} className="modal-body__body-content__body-content-element inside" style={{ paddingLeft: 20 }}>
                      {this.mappedBodyContent(e)}
                    </div>
                  ))}
                </div>
              );
            }
            return (
              <div className="modal-body__body-content__body-content-element">
                <h3 className="modal-body__body-content__body-content-element-title">{`${getNormalizedString(key)}: `}</h3>
                {key !== 'borders' ? (
                  <span>{_.join(value, ', ')}</span>
                ) : (
                  <div className="modal-body__body-content__body-content-element-borders">
                    {value.map((alpha3) => (
                      <span
                        key={_.uniqueId()}
                        className="modal-body__body-content__body-content-element-borders-link"
                        href="#"
                        onClick={(e) => {
                          this.handleAutocomplite('name')(e);
                          this.handleOpenElement(el.id)(e);
                          this.handleOpenElement(getCountryId(getCountryName(alpha3)))(e);
                        }}
                        onKeyDown={() => {}}
                        role="button"
                        tabIndex={0}
                        value={getCountryName(alpha3)}
                      >
                        {getCountryName(alpha3)}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            );
          },
        },
        {
          type: 'object',
          check: (value) => value instanceof Object,
          action: (key, value) => {
            const newMargin = 20;
            return (
              <div className="modal-body__body-content__body-content-element inside" style={{ paddingLeft: 0 }}>
                <h3 className="modal-body__body-content__body-content-element-title inside">{`${getNormalizedString(key)}: `}</h3>
                {this.mappedBodyContent(value, newMargin)}
              </div>
            );
          },
        },
      ];

      const keys = _.keys(_.omit(el, ['name', 'id', 'status']));

      const findAction = (key, value) => {
        const { type, action } = getAction.find(({ check }) => check(value));
        if (type === 'null') {
          return null;
        }
        return action(key, value);
      };
      return keys.map((k) => {
        if (findAction(k, el[k]) === null) {
          return null;
        }
        return (
          <div className="modal-body__body-content__body-content-element" style={{ marginLeft: margin }} key={_.uniqueId()}>
            {findAction(k, el[k])}
          </div>
        );
      });
    }

    render() {
      const { element, handleOpenElement } = this.props;
      const { name, id } = element;
      const { uiState: { isOpenEl } } = this.props;
      const openElclassName = cn({
        'render-element__full-show': true,
        [isOpenEl[id].status]: true,
      });

      ArrowKeysReact.config({
        left: () => this.handleSwitchToNextElement(id, 'prev')(),
        right: () => this.handleSwitchToNextElement(id, 'next')(),
      });

      return (
        <div
          className={openElclassName}
          role="button"
          {...ArrowKeysReact.events}
          tabIndex="-1"
          ref={(mainDiv) => { this.mainDiv = mainDiv; }}
        >
          <div className="render-element__modal-content">
            <div className="modal-content__modal-title">
              <h5 className="modal-content__modal-title-text">{name}</h5>
              <span
                onClick={handleOpenElement(id)}
                onKeyDown={handleOpenElement(id)}
                role="button"
                tabIndex="0"
                className="modal-content__modal-title-close"
                data-testid="modal"
              >
                &#10006;
              </span>
            </div>
            <div className="render-element__modal-body">
              <div className="modal-body__body-content">
                {this.mappedBodyContent(element)}
              </div>
            </div>
            <div className="render-element__modal-footer">
              <div className="modal-footer__footer-button-block">
                {['prev', 'next'].map((n) => (
                  <span
                    key={_.uniqueId()}
                    onClick={this.handleSwitchToNextElement(id, n)}
                    onKeyDown={() => {}}
                    role="button"
                    tabIndex={0}
                    type="button"
                    className={`modal-footer__footer-button-${n}`}
                    data-testid={`click${_.capitalize(n)}`}
                  >
                    {n === 'prev' ? <span>&lt;</span> : <span>&gt;</span>}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      );
    }
}

export default connect(mapStateToPorps, actionCreators)(ModalWindow);

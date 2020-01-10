import _ from 'lodash';
import React from 'react';
import { connect } from 'react-redux';
import cn from 'classnames';
import ArrowKeysReact from 'arrow-keys-react';
import * as actions from '../../actions';
import './main.sass';

const mapStateToPorps = (state) => {
  const props = {
    uiState: state.uiState,
  };
  return props;
};

const actionCreators = {
  nextOrPrevElement: actions.nextOrPrevElement,
};

class ModalWindow extends React.Component {
  componentDidMount() {
    this.mainDiv.focus();
  }

    handleSwitchToNextElement = (id, type) => () => {
      const { nextOrPrevElement } = this.props;
      nextOrPrevElement({ isOpenEl: { id, type } });
    }

    mappedBodyContent(el, margin = 0) {
      const getNormalizedString = (str) => _.capitalize(_.lowerCase(str));
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
            <div className="body-content-element">
              <h3 className="body-content-element-title">{`${getNormalizedString(key)}: `}</h3>
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
                <div className="body-content-element">
                  {<h3 className="body-content-element-title inside">{`${getNormalizedString(key)}:`}</h3>}
                  {value.map((e) => (
                    <div key={_.uniqueId()} className="body-content-element inside" style={{ paddingLeft: 20 }}>
                      {this.mappedBodyContent(e)}
                    </div>
                  ))}
                </div>
              );
            }
            return (
              <div className="body-content-element">
                <h3 className="body-content-element-title">{`${getNormalizedString(key)}: `}</h3>
                <span>{_.join(value, ', ')}</span>
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
              <div className="body-content-element inside" style={{ paddingLeft: 0 }}>
                <h3 className="body-content-element-title inside">{`${getNormalizedString(key)}: `}</h3>
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
          <div className="body-content-element" style={{ marginLeft: margin }} key={_.uniqueId()}>
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
        'render-element-full-show': true,
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
          <div className="render-element-modal-content">
            <div className="modal-title">
              <h5 className="modal-title-text">{name}</h5>
              <span
                onClick={handleOpenElement(id)}
                onKeyDown={handleOpenElement(id)}
                role="button"
                tabIndex="0"
                className="modal-title-close"
              >
                x
              </span>
            </div>
            <div className="modal-body">
              <div className="body-content">
                {this.mappedBodyContent(element)}
              </div>
            </div>
            <div className="modal-footer">
              <div className="footer-button-block">
                <button href="#" onClick={this.handleSwitchToNextElement(id, 'prev')} type="button" className="footer-button-prev">Prev</button>
                <button href="#" onClick={this.handleSwitchToNextElement(id, 'next')} type="button" className="footer-button-next">Next</button>
              </div>
            </div>
          </div>
        </div>
      );
    }
}

export default connect(mapStateToPorps, actionCreators)(ModalWindow);

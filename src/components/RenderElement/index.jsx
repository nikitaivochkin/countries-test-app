import _ from 'lodash';
import React from 'react';
import { connect } from 'react-redux';
import cn from 'classnames';
import * as actions from '../../actions';
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
};

class RenderElement extends React.Component {
    handleOpenElement = (id) => () => {
      const { openElement } = this.props;
      openElement({ isOpenEl: { id } });
    }

    handleSwitchToNextElement = (id) => (e) => {
      e.preventDefault();
      const type = e.target.attributes.getNamedItem('mydata').value;
      const { nextOrPrevElement } = this.props;
      nextOrPrevElement({ isOpenEl: { id, type } });
    }

    mappedBodyContent(el, margin = 0) {
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
            <div>
              <h3>{`${key}: `}</h3>
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
                <ul style={{ paddingLeft: 0 }}>
                  <div>
                    {<h3>{`${key}:`}</h3>}
                    {value.map((e, index) => (
                      <ul key={_.uniqueId()} style={{ paddingLeft: 20 }}>
                        <div>
                          {<h5>{`${index + 1}th:`}</h5>}
                          {this.mappedBodyContent(e)}
                        </div>
                      </ul>
                    ))}
                  </div>
                </ul>
              );
            }
            return (
              <div>
                <h3>{`${key}: `}</h3>
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
              <ul style={{ paddingLeft: 0 }}>
                <div>
                  <h3>{`${key}: `}</h3>
                  {this.mappedBodyContent(value, newMargin)}
                </div>
              </ul>
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
          <li style={{ marginLeft: margin }} key={_.uniqueId()}>
            {findAction(k, el[k])}
          </li>
        );
      });
    }

    render() {
      const { text } = this.props;
      const { element } = this.props;
      const { flag, name, id } = element;
      const { uiState: { isOpenEl } } = this.props;
      const openElclassName = cn({
        'render-element-full-show': true,
        [isOpenEl[id].status]: true,
      });

      const getModalWindow = () => (
        <div className={openElclassName}>
          <div className="render-element-modal-content">
            <div className="modal-title">
              <h5 className="modal-title-text">{name}</h5>
              <span
                onClick={this.handleOpenElement(id)}
                onKeyDown={this.handleOpenElement(id)}
                role="button"
                tabIndex={0}
                className="modal-title-close"
              >
                x
              </span>
            </div>
            <div className="modal-body">
              <div className="body-content">
                <ul>
                  {this.mappedBodyContent(element)}
                </ul>
              </div>
            </div>
            <div className="modal-footer">
              <div className="footer-button-block">
                <button href="#" onClick={this.handleSwitchToNextElement(id)} mydata="prev" type="button" className="footer-button-prev">Prev</button>
                <button href="#" onClick={this.handleSwitchToNextElement(id)} mydata="next" type="button" className="footer-button-next">Next</button>
              </div>
            </div>
          </div>
        </div>
      );

      const divStyle = {
        background: `url(${flag}) 90% 90%`,
        backgroundSize: 'cover',
      };

      if (text === '') {
        return null;
      }

      return (
        <>
          <div
            onClick={this.handleOpenElement(id)}
            onKeyDown={this.handleOpenElement(id)}
            role="button"
            tabIndex={0}
            className="render-element"
            style={divStyle}
          >
            <span className="render-element-name">{name}</span>
          </div>
          {isOpenEl[id].status === 'open' && getModalWindow()}
        </>
      );
    }
}
export default connect(mapStateToPorps, actionCreators)(RenderElement);

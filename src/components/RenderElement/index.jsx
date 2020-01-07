import React from 'react';
import ModalWindow from '../ModalWindow';
import { connect } from 'react-redux';
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
    handleOpenElement = (id) => (e) => {
      e.stopPropagation();
      const { openElement } = this.props;
      openElement({ isOpenEl: { id } });
    }

    render() {
      const { text } = this.props;
      const { element } = this.props;
      const { flag, name, id } = element;
      const { uiState: { isOpenEl } } = this.props;

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
          {isOpenEl[id].status === 'open' && <ModalWindow element={element} handleOpenElement={this.handleOpenElement} />}
        </>
      );
    }
}
export default connect(mapStateToPorps, actionCreators)(RenderElement);

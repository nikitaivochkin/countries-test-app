import _ from 'lodash';
import React from 'react';
import { connect } from 'react-redux';
import cn from 'classnames'
import * as actions from '../../actions';
import './main.sass';

const mapStateToPorps = (state) => {
    const props = {
      elements: state.elements,
      uiState: state.uiState,
    };
    return props;
  };
  
const actionCreators = {
    openElement: actions.openElement,
};

class RenderElement extends React.Component {

    handleOpenElement = (id) => () => {
        const { openElement } = this.props;
        openElement({ isOpenEl: { id } })
    }

    render() {
        const { flag, name, id } = this.props.element;
        const { uiState: { isOpenEl } } = this.props;
        
        const divStyle = {
            background: `url(${flag}) 100% 100%`,
            'backgroundSize': 'contain',
        };
        const openElclassName = cn({
            'render-element-full-show': true,
            [isOpenEl[id]['status']]: true,
        })

        return (
            <>
                <div className="render-element" style={divStyle}>
                    <a onClick={this.handleOpenElement(id)} className="render-element-name">{name}</a>
                </div>
                <div className={openElclassName}>
                    {name}
                </div>
            </>
        );
    }
}

export default connect(mapStateToPorps, actionCreators)(RenderElement);
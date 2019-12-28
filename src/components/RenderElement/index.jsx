import _ from 'lodash';
import React from 'react';
import './main.sass';

const RenderElement = ({ name, flag }) => {
    const divStyle = {
        background: `url(${flag}) 100% 100%`,
        'backgroundSize': 'contain',
    };

    return (
        <div key={_.uniqueId()} className="render-element" style={divStyle}>
            <span>{name}</span>
        </div>
    );
};

export default RenderElement;
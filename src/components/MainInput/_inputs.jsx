import _ from 'lodash';
import React from 'react';
import { inputs } from '../../assets/options.js';

export default class Inputs extends React.Component {
  render() {
    const { handleAutocomplite } = this.props;

    return inputs.map(([name, placeholder, key]) => (name !== 'population' && name !== 'area' ? (
      <div key={`input-${key}`} className="serch-bar__filters__input">
        <input
          onChange={handleAutocomplite(name)}
          className={`serch-bar__filters__input serch-bar__filters__input-${name}`}
          name={name}
          component="input"
          required
          type={(name !== 'callingCodes' || name !== 'numericCode') ? 'text' : 'number'}
          placeholder={placeholder}
          data-testid={name}
        />
      </div>
    ) : (
      <div key={`input-${key}`} className={`serch-bar__filters__input ${name}`}>
        <p className="input-name">{`${_.upperFirst(name)}`}</p>
        <p className="input-dimension">
          (
          {name === 'population' ? 'Millions people' : 'Square kilometers'}
          )
        </p>
        <div className="inputs">
          {['Min', 'Max'].map((selector) => (
            <div key={`input-${selector}`} className="inputs__input">
              <span>{_.lowerCase(selector)}</span>
              <input
                onChange={handleAutocomplite(`${name}${selector}`)}
                className={`serch-bar__filters__input serch-bar__filters__input-${name}`}
                name={`${name}${selector}`}
                component="input"
                required
                placeholder="Enter num"
                type="number"
                data-testid={name}
              />
            </div>
          ))}
        </div>
      </div>
    )
    ));
  }
}

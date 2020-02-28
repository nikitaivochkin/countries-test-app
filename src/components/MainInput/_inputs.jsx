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
        />
      </div>
    ) : (
      <div key={`input-${key}`} className={`serch-bar__filters__input ${name}`}>
        <p className="input-name">{`${_.upperFirst(name)}`}</p>
        <p className="input-dimension">({name === 'population' ? 'Millions people' : 'Square kilometers'})</p>
        <div className="inputs">
          <div className="inputs__input">
            <label>{`min`}</label>
            <input
              onChange={handleAutocomplite(`${name}Min`)}
              className={`serch-bar__filters__input serch-bar__filters__input-${name}`}
              name={`${name}Min`}
              component="input"
              required
              placeholder="Enter num"
              type="number"
            />
          </div>
          <div className="inputs__input">
            <label>{`max`}</label>
            <input
              onChange={handleAutocomplite(`${name}Max`)}
              className={`serch-bar__filters__input serch-bar__filters__input-${name}`}
              name={`${name}Max`}
              component="input"
              required
              placeholder="Enter num"
              type="number"
            />
          </div>
        </div>
      </div>
    )
    ));
  }
}

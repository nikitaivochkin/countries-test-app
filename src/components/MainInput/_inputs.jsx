import React from 'react';
import { inputs } from '../../assets/options.js';

export default class Inputs extends React.Component {
  render() {
    const { handleAutocomplite } = this.props;

    return inputs.map(([name, placeholder, key]) => (name !== 'population' ? (
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
      <div key={`input-${key}`} className="serch-bar__filters__input population">
        <div>
          <span>Population min</span>
          <input
            onChange={handleAutocomplite('populationMin')}
            className="serch-bar__filters__input serch-bar__filters__input-population"
            name="PopulationMin"
            component="input"
            required
            placeholder="Enter num"
            type="number"
          />
        </div>
        <div>
          <span>Population max</span>
          <input
            onChange={handleAutocomplite('populationMax')}
            className="serch-bar__filters__input serch-bar__filters__input-population"
            name="PopulationMax"
            component="input"
            required
            placeholder="Enter num"
            type="number"
          />
        </div>
      </div>
    )
    ));
  }
}

import { uniqueId } from 'lodash';
import React from 'react';
import {
  selects, regions, regionalBlocs, subregions, timeZones,
} from '../../assets/options.js';

export default class Selects extends React.Component {
  render() {
    const { filter, handleAutocomplite } = this.props;

    const options = {
      region: regions,
      subregion: subregions,
      regionalBlocs,
      timezones: timeZones,
    };

    const getOptions = (name) => {
      if (name === 'subregion') {
        return ((
          filter.region ? subregions[filter.region].map((n) => (
            <option key={uniqueId()} className="select-option" value={n}>{n}</option>
          )) : (
            <option className="select-option" value="disabled">First choose region</option>
          )
        ));
      } return (
        options[name].map(([v, n]) => (
          <option key={uniqueId()} className="select-option" value={v}>{n}</option>
        ))
      );
    };

    return selects.map(([name, placeholder]) => (
      <div key={`select-${uniqueId()}`} className="serch-bar__filters__select">
        <select
          onChange={handleAutocomplite(name)}
          className={`serch-bar__filters__select serch-bar__filters__select-${name}`}
          name={name}
          component="select"
          value={filter[name] ? filter[name] : ''}
          required
          placeholder={placeholder}
          disabled={name === 'subregion' ? !filter.region : null}
          data-testid={name}
        >
          {getOptions(name)}
        </select>
      </div>
    ));
  }
}

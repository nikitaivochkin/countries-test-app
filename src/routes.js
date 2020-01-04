const host = 'https://restcountries.eu/rest/v2';

export default {
  getCountries: (countryName) => [host, 'name', countryName].join('/'),
  getCapitalSities: (capitalCity) => [host, 'capital', capitalCity].join('/'),
  getRegion: (region) => [host, 'region', region].join('/'),
  getLanguge: (languge) => [host, 'lang', languge].join('/'),
};

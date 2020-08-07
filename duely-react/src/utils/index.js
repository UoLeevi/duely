const countries = {
  AF: { name: "Afghanistan", alpha3code: 'AFG', numeric: '004' },
  AL: { name: "Albania", alpha3code: 'ALB', numeric: '008' },
  DZ: { name: "Algeria", alpha3code: 'DZA', numeric: '012' },
  AS: { name: "American Samoa", alpha3code: 'ASM', numeric: '016' },
  AD: { name: "Andorra", alpha3code: 'AND', numeric: '020' },
  AO: { name: "Angola", alpha3code: 'AGO', numeric: '024' },
  AI: { name: "Anguilla", alpha3code: 'AIA', numeric: '660' },
  AQ: { name: "Antarctica", alpha3code: 'ATA', numeric: '010' },
  AG: { name: "Antigua and Barbuda", alpha3code: 'ATG', numeric: '028' },
  AR: { name: "Argentina", alpha3code: 'ARG', numeric: '032' },
  AM: { name: "Armenia", alpha3code: 'ARM', numeric: '051' },
  AW: { name: "Aruba", alpha3code: 'ABW', numeric: '533' },
  AU: { name: "Australia", alpha3code: 'AUS', numeric: '036' },
  AT: { name: "Austria", alpha3code: 'AUT', numeric: '040' },
  AZ: { name: "Azerbaijan", alpha3code: 'AZE', numeric: '031' },
  BS: { name: "Bahamas (the)", alpha3code: 'BHS', numeric: '044' },
  BH: { name: "Bahrain", alpha3code: 'BHR', numeric: '048' },
  BD: { name: "Bangladesh", alpha3code: 'BGD', numeric: '050' },
  BB: { name: "Barbados", alpha3code: 'BRB', numeric: '052' },
  BY: { name: "Belarus", alpha3code: 'BLR', numeric: '112' },
  BE: { name: "Belgium", alpha3code: 'BEL', numeric: '056' },
  BZ: { name: "Belize", alpha3code: 'BLZ', numeric: '084' },
  BJ: { name: "Benin", alpha3code: 'BEN', numeric: '204' },
  BM: { name: "Bermuda", alpha3code: 'BMU', numeric: '060' },
  BT: { name: "Bhutan", alpha3code: 'BTN', numeric: '064' },
  BO: { name: "Bolivia (Plurinational State of)", alpha3code: 'BOL', numeric: '068' },
  BQ: { name: "Bonaire, Sint Eustatius and Saba", alpha3code: 'BES', numeric: '535' },
  BA: { name: "Bosnia and Herzegovina", alpha3code: 'BIH', numeric: '070' },
  BW: { name: "Botswana", alpha3code: 'BWA', numeric: '072' },
  BV: { name: "Bouvet Island", alpha3code: 'BVT', numeric: '074' },
  BR: { name: "Brazil", alpha3code: 'BRA', numeric: '076' },
  IO: { name: "British Indian Ocean Territory (the)", alpha3code: 'IOT', numeric: '086' },
  BN: { name: "Brunei Darussalam", alpha3code: 'BRN', numeric: '096' },
  BG: { name: "Bulgaria", alpha3code: 'BGR', numeric: '100' },
  BF: { name: "Burkina Faso", alpha3code: 'BFA', numeric: '854' },
  BI: { name: "Burundi", alpha3code: 'BDI', numeric: '108' },
  CV: { name: "Cabo Verde", alpha3code: 'CPV', numeric: '132' },
  KH: { name: "Cambodia", alpha3code: 'KHM', numeric: '116' },
  CM: { name: "Cameroon", alpha3code: 'CMR', numeric: '120' },
  CA: { name: "Canada", alpha3code: 'CAN', numeric: '124' },
  KY: { name: "Cayman Islands (the)", alpha3code: 'CYM', numeric: '136' },
  CF: { name: "Central African Republic (the)", alpha3code: 'CAF', numeric: '140' },
  TD: { name: "Chad", alpha3code: 'TCD', numeric: '148' },
  CL: { name: "Chile", alpha3code: 'CHL', numeric: '152' },
  CN: { name: "China", alpha3code: 'CHN', numeric: '156' },
  CX: { name: "Christmas Island", alpha3code: 'CXR', numeric: '162' },
  CC: { name: "Cocos (Keeling) Islands (the)", alpha3code: 'CCK', numeric: '166' },
  CO: { name: "Colombia", alpha3code: 'COL', numeric: '170' },
  KM: { name: "Comoros (the)", alpha3code: 'COM', numeric: '174' },
  CD: { name: "Congo (the Democratic Republic of the)", alpha3code: 'COD', numeric: '180' },
  CG: { name: "Congo (the)", alpha3code: 'COG', numeric: '178' },
  CK: { name: "Cook Islands (the)", alpha3code: 'COK', numeric: '184' },
  CR: { name: "Costa Rica", alpha3code: 'CRI', numeric: '188' },
  HR: { name: "Croatia", alpha3code: 'HRV', numeric: '191' },
  CU: { name: "Cuba", alpha3code: 'CUB', numeric: '192' },
  CW: { name: "Curaçao", alpha3code: 'CUW', numeric: '531' },
  CY: { name: "Cyprus", alpha3code: 'CYP', numeric: '196' },
  CZ: { name: "Czechia", alpha3code: 'CZE', numeric: '203' },
  CI: { name: "Côte d'Ivoire", alpha3code: 'CIV', numeric: '384' },
  DK: { name: "Denmark", alpha3code: 'DNK', numeric: '208' },
  DJ: { name: "Djibouti", alpha3code: 'DJI', numeric: '262' },
  DM: { name: "Dominica", alpha3code: 'DMA', numeric: '212' },
  DO: { name: "Dominican Republic (the)", alpha3code: 'DOM', numeric: '214' },
  EC: { name: "Ecuador", alpha3code: 'ECU', numeric: '218' },
  EG: { name: "Egypt", alpha3code: 'EGY', numeric: '818' },
  SV: { name: "El Salvador", alpha3code: 'SLV', numeric: '222' },
  GQ: { name: "Equatorial Guinea", alpha3code: 'GNQ', numeric: '226' },
  ER: { name: "Eritrea", alpha3code: 'ERI', numeric: '232' },
  EE: { name: "Estonia", alpha3code: 'EST', numeric: '233' },
  SZ: { name: "Eswatini", alpha3code: 'SWZ', numeric: '748' },
  ET: { name: "Ethiopia", alpha3code: 'ETH', numeric: '231' },
  FK: { name: "Falkland Islands (the) [Malvinas]", alpha3code: 'FLK', numeric: '238' },
  FO: { name: "Faroe Islands (the)", alpha3code: 'FRO', numeric: '234' },
  FJ: { name: "Fiji", alpha3code: 'FJI', numeric: '242' },
  FI: { name: "Finland", alpha3code: 'FIN', numeric: '246' },
  FR: { name: "France", alpha3code: 'FRA', numeric: '250' },
  GF: { name: "French Guiana", alpha3code: 'GUF', numeric: '254' },
  PF: { name: "French Polynesia", alpha3code: 'PYF', numeric: '258' },
  TF: { name: "French Southern Territories (the)", alpha3code: 'ATF', numeric: '260' },
  GA: { name: "Gabon", alpha3code: 'GAB', numeric: '266' },
  GM: { name: "Gambia (the)", alpha3code: 'GMB', numeric: '270' },
  GE: { name: "Georgia", alpha3code: 'GEO', numeric: '268' },
  DE: { name: "Germany", alpha3code: 'DEU', numeric: '276' },
  GH: { name: "Ghana", alpha3code: 'GHA', numeric: '288' },
  GI: { name: "Gibraltar", alpha3code: 'GIB', numeric: '292' },
  GR: { name: "Greece", alpha3code: 'GRC', numeric: '300' },
  GL: { name: "Greenland", alpha3code: 'GRL', numeric: '304' },
  GD: { name: "Grenada", alpha3code: 'GRD', numeric: '308' },
  GP: { name: "Guadeloupe", alpha3code: 'GLP', numeric: '312' },
  GU: { name: "Guam", alpha3code: 'GUM', numeric: '316' },
  GT: { name: "Guatemala", alpha3code: 'GTM', numeric: '320' },
  GG: { name: "Guernsey", alpha3code: 'GGY', numeric: '831' },
  GN: { name: "Guinea", alpha3code: 'GIN', numeric: '324' },
  GW: { name: "Guinea-Bissau", alpha3code: 'GNB', numeric: '624' },
  GY: { name: "Guyana", alpha3code: 'GUY', numeric: '328' },
  HT: { name: "Haiti", alpha3code: 'HTI', numeric: '332' },
  HM: { name: "Heard Island and McDonald Islands", alpha3code: 'HMD', numeric: '334' },
  VA: { name: "Holy See (the)", alpha3code: 'VAT', numeric: '336' },
  HN: { name: "Honduras", alpha3code: 'HND', numeric: '340' },
  HK: { name: "Hong Kong", alpha3code: 'HKG', numeric: '344' },
  HU: { name: "Hungary", alpha3code: 'HUN', numeric: '348' },
  IS: { name: "Iceland", alpha3code: 'ISL', numeric: '352' },
  IN: { name: "India", alpha3code: 'IND', numeric: '356' },
  ID: { name: "Indonesia", alpha3code: 'IDN', numeric: '360' },
  IR: { name: "Iran (Islamic Republic of)", alpha3code: 'IRN', numeric: '364' },
  IQ: { name: "Iraq", alpha3code: 'IRQ', numeric: '368' },
  IE: { name: "Ireland", alpha3code: 'IRL', numeric: '372' },
  IM: { name: "Isle of Man", alpha3code: 'IMN', numeric: '833' },
  IL: { name: "Israel", alpha3code: 'ISR', numeric: '376' },
  IT: { name: "Italy", alpha3code: 'ITA', numeric: '380' },
  JM: { name: "Jamaica", alpha3code: 'JAM', numeric: '388' },
  JP: { name: "Japan", alpha3code: 'JPN', numeric: '392' },
  JE: { name: "Jersey", alpha3code: 'JEY', numeric: '832' },
  JO: { name: "Jordan", alpha3code: 'JOR', numeric: '400' },
  KZ: { name: "Kazakhstan", alpha3code: 'KAZ', numeric: '398' },
  KE: { name: "Kenya", alpha3code: 'KEN', numeric: '404' },
  KI: { name: "Kiribati", alpha3code: 'KIR', numeric: '296' },
  KP: { name: "Korea (the Democratic People's Republic of)", alpha3code: 'PRK', numeric: '408' },
  KR: { name: "Korea (the Republic of)", alpha3code: 'KOR', numeric: '410' },
  KW: { name: "Kuwait", alpha3code: 'KWT', numeric: '414' },
  KG: { name: "Kyrgyzstan", alpha3code: 'KGZ', numeric: '417' },
  LA: { name: "Lao People's Democratic Republic (the)", alpha3code: 'LAO', numeric: '418' },
  LV: { name: "Latvia", alpha3code: 'LVA', numeric: '428' },
  LB: { name: "Lebanon", alpha3code: 'LBN', numeric: '422' },
  LS: { name: "Lesotho", alpha3code: 'LSO', numeric: '426' },
  LR: { name: "Liberia", alpha3code: 'LBR', numeric: '430' },
  LY: { name: "Libya", alpha3code: 'LBY', numeric: '434' },
  LI: { name: "Liechtenstein", alpha3code: 'LIE', numeric: '438' },
  LT: { name: "Lithuania", alpha3code: 'LTU', numeric: '440' },
  LU: { name: "Luxembourg", alpha3code: 'LUX', numeric: '442' },
  MO: { name: "Macao", alpha3code: 'MAC', numeric: '446' },
  MG: { name: "Madagascar", alpha3code: 'MDG', numeric: '450' },
  MW: { name: "Malawi", alpha3code: 'MWI', numeric: '454' },
  MY: { name: "Malaysia", alpha3code: 'MYS', numeric: '458' },
  MV: { name: "Maldives", alpha3code: 'MDV', numeric: '462' },
  ML: { name: "Mali", alpha3code: 'MLI', numeric: '466' },
  MT: { name: "Malta", alpha3code: 'MLT', numeric: '470' },
  MH: { name: "Marshall Islands (the)", alpha3code: 'MHL', numeric: '584' },
  MQ: { name: "Martinique", alpha3code: 'MTQ', numeric: '474' },
  MR: { name: "Mauritania", alpha3code: 'MRT', numeric: '478' },
  MU: { name: "Mauritius", alpha3code: 'MUS', numeric: '480' },
  YT: { name: "Mayotte", alpha3code: 'MYT', numeric: '175' },
  MX: { name: "Mexico", alpha3code: 'MEX', numeric: '484' },
  FM: { name: "Micronesia (Federated States of)", alpha3code: 'FSM', numeric: '583' },
  MD: { name: "Moldova (the Republic of)", alpha3code: 'MDA', numeric: '498' },
  MC: { name: "Monaco", alpha3code: 'MCO', numeric: '492' },
  MN: { name: "Mongolia", alpha3code: 'MNG', numeric: '496' },
  ME: { name: "Montenegro", alpha3code: 'MNE', numeric: '499' },
  MS: { name: "Montserrat", alpha3code: 'MSR', numeric: '500' },
  MA: { name: "Morocco", alpha3code: 'MAR', numeric: '504' },
  MZ: { name: "Mozambique", alpha3code: 'MOZ', numeric: '508' },
  MM: { name: "Myanmar", alpha3code: 'MMR', numeric: '104' },
  NA: { name: "Namibia", alpha3code: 'NAM', numeric: '516' },
  NR: { name: "Nauru", alpha3code: 'NRU', numeric: '520' },
  NP: { name: "Nepal", alpha3code: 'NPL', numeric: '524' },
  NL: { name: "Netherlands (the)", alpha3code: 'NLD', numeric: '528' },
  NC: { name: "New Caledonia", alpha3code: 'NCL', numeric: '540' },
  NZ: { name: "New Zealand", alpha3code: 'NZL', numeric: '554' },
  NI: { name: "Nicaragua", alpha3code: 'NIC', numeric: '558' },
  NE: { name: "Niger (the)", alpha3code: 'NER', numeric: '562' },
  NG: { name: "Nigeria", alpha3code: 'NGA', numeric: '566' },
  NU: { name: "Niue", alpha3code: 'NIU', numeric: '570' },
  NF: { name: "Norfolk Island", alpha3code: 'NFK', numeric: '574' },
  MP: { name: "Northern Mariana Islands (the)", alpha3code: 'MNP', numeric: '580' },
  NO: { name: "Norway", alpha3code: 'NOR', numeric: '578' },
  OM: { name: "Oman", alpha3code: 'OMN', numeric: '512' },
  PK: { name: "Pakistan", alpha3code: 'PAK', numeric: '586' },
  PW: { name: "Palau", alpha3code: 'PLW', numeric: '585' },
  PS: { name: "Palestine, State of", alpha3code: 'PSE', numeric: '275' },
  PA: { name: "Panama", alpha3code: 'PAN', numeric: '591' },
  PG: { name: "Papua New Guinea", alpha3code: 'PNG', numeric: '598' },
  PY: { name: "Paraguay", alpha3code: 'PRY', numeric: '600' },
  PE: { name: "Peru", alpha3code: 'PER', numeric: '604' },
  PH: { name: "Philippines (the)", alpha3code: 'PHL', numeric: '608' },
  PN: { name: "Pitcairn", alpha3code: 'PCN', numeric: '612' },
  PL: { name: "Poland", alpha3code: 'POL', numeric: '616' },
  PT: { name: "Portugal", alpha3code: 'PRT', numeric: '620' },
  PR: { name: "Puerto Rico", alpha3code: 'PRI', numeric: '630' },
  QA: { name: "Qatar", alpha3code: 'QAT', numeric: '634' },
  MK: { name: "Republic of North Macedonia", alpha3code: 'MKD', numeric: '807' },
  RO: { name: "Romania", alpha3code: 'ROU', numeric: '642' },
  RU: { name: "Russian Federation (the)", alpha3code: 'RUS', numeric: '643' },
  RW: { name: "Rwanda", alpha3code: 'RWA', numeric: '646' },
  RE: { name: "Réunion", alpha3code: 'REU', numeric: '638' },
  BL: { name: "Saint Barthélemy", alpha3code: 'BLM', numeric: '652' },
  SH: { name: "Saint Helena, Ascension and Tristan da Cunha", alpha3code: 'SHN', numeric: '654' },
  KN: { name: "Saint Kitts and Nevis", alpha3code: 'KNA', numeric: '659' },
  LC: { name: "Saint Lucia", alpha3code: 'LCA', numeric: '662' },
  MF: { name: "Saint Martin (French part)", alpha3code: 'MAF', numeric: '663' },
  PM: { name: "Saint Pierre and Miquelon", alpha3code: 'SPM', numeric: '666' },
  VC: { name: "Saint Vincent and the Grenadines", alpha3code: 'VCT', numeric: '670' },
  WS: { name: "Samoa", alpha3code: 'WSM', numeric: '882' },
  SM: { name: "San Marino", alpha3code: 'SMR', numeric: '674' },
  ST: { name: "Sao Tome and Principe", alpha3code: 'STP', numeric: '678' },
  SA: { name: "Saudi Arabia", alpha3code: 'SAU', numeric: '682' },
  SN: { name: "Senegal", alpha3code: 'SEN', numeric: '686' },
  RS: { name: "Serbia", alpha3code: 'SRB', numeric: '688' },
  SC: { name: "Seychelles", alpha3code: 'SYC', numeric: '690' },
  SL: { name: "Sierra Leone", alpha3code: 'SLE', numeric: '694' },
  SG: { name: "Singapore", alpha3code: 'SGP', numeric: '702' },
  SX: { name: "Sint Maarten (Dutch part)", alpha3code: 'SXM', numeric: '534' },
  SK: { name: "Slovakia", alpha3code: 'SVK', numeric: '703' },
  SI: { name: "Slovenia", alpha3code: 'SVN', numeric: '705' },
  SB: { name: "Solomon Islands", alpha3code: 'SLB', numeric: '090' },
  SO: { name: "Somalia", alpha3code: 'SOM', numeric: '706' },
  ZA: { name: "South Africa", alpha3code: 'ZAF', numeric: '710' },
  GS: { name: "South Georgia and the South Sandwich Islands", alpha3code: 'SGS', numeric: '239' },
  SS: { name: "South Sudan", alpha3code: 'SSD', numeric: '728' },
  ES: { name: "Spain", alpha3code: 'ESP', numeric: '724' },
  LK: { name: "Sri Lanka", alpha3code: 'LKA', numeric: '144' },
  SD: { name: "Sudan (the)", alpha3code: 'SDN', numeric: '729' },
  SR: { name: "Suriname", alpha3code: 'SUR', numeric: '740' },
  SJ: { name: "Svalbard and Jan Mayen", alpha3code: 'SJM', numeric: '744' },
  SE: { name: "Sweden", alpha3code: 'SWE', numeric: '752' },
  CH: { name: "Switzerland", alpha3code: 'CHE', numeric: '756' },
  SY: { name: "Syrian Arab Republic", alpha3code: 'SYR', numeric: '760' },
  TW: { name: "Taiwan (Province of China)", alpha3code: 'TWN', numeric: '158' },
  TJ: { name: "Tajikistan", alpha3code: 'TJK', numeric: '762' },
  TZ: { name: "Tanzania, United Republic of", alpha3code: 'TZA', numeric: '834' },
  TH: { name: "Thailand", alpha3code: 'THA', numeric: '764' },
  TL: { name: "Timor-Leste", alpha3code: 'TLS', numeric: '626' },
  TG: { name: "Togo", alpha3code: 'TGO', numeric: '768' },
  TK: { name: "Tokelau", alpha3code: 'TKL', numeric: '772' },
  TO: { name: "Tonga", alpha3code: 'TON', numeric: '776' },
  TT: { name: "Trinidad and Tobago", alpha3code: 'TTO', numeric: '780' },
  TN: { name: "Tunisia", alpha3code: 'TUN', numeric: '788' },
  TR: { name: "Turkey", alpha3code: 'TUR', numeric: '792' },
  TM: { name: "Turkmenistan", alpha3code: 'TKM', numeric: '795' },
  TC: { name: "Turks and Caicos Islands (the)", alpha3code: 'TCA', numeric: '796' },
  TV: { name: "Tuvalu", alpha3code: 'TUV', numeric: '798' },
  UG: { name: "Uganda", alpha3code: 'UGA', numeric: '800' },
  UA: { name: "Ukraine", alpha3code: 'UKR', numeric: '804' },
  AE: { name: "United Arab Emirates (the)", alpha3code: 'ARE', numeric: '784' },
  GB: { name: "United Kingdom of Great Britain and Northern Ireland (the)", alpha3code: 'GBR', numeric: '826' },
  UM: { name: "United States Minor Outlying Islands (the)", alpha3code: 'UMI', numeric: '581' },
  US: { name: "United States of America (the)", alpha3code: 'USA', numeric: '840' },
  UY: { name: "Uruguay", alpha3code: 'URY', numeric: '858' },
  UZ: { name: "Uzbekistan", alpha3code: 'UZB', numeric: '860' },
  VU: { name: "Vanuatu", alpha3code: 'VUT', numeric: '548' },
  VE: { name: "Venezuela (Bolivarian Republic of)", alpha3code: 'VEN', numeric: '862' },
  VN: { name: "Viet Nam", alpha3code: 'VNM', numeric: '704' },
  VG: { name: "Virgin Islands (British)", alpha3code: 'VGB', numeric: '092' },
  VI: { name: "Virgin Islands (U.S.)", alpha3code: 'VIR', numeric: '850' },
  WF: { name: "Wallis and Futuna", alpha3code: 'WLF', numeric: '876' },
  EH: { name: "Western Sahara", alpha3code: 'ESH', numeric: '732' },
  YE: { name: "Yemen", alpha3code: 'YEM', numeric: '887' },
  ZM: { name: "Zambia", alpha3code: 'ZMB', numeric: '894' },
  ZW: { name: "Zimbabwe", alpha3code: 'ZWE', numeric: '716' },
  AX: { name: "Åland Islands", alpha3code: 'ALA', numeric: '248' }
};

function toFlagEmoji(alpha2Code) {
  const [c1, c2] = alpha2Code;
  return String.fromCodePoint(
  c1.codePointAt(0) + 0x1F1E6 - 0x41,
  c2.codePointAt(0) + 0x1F1E6 - 0x41);
}

export function countryByCode(alpha2code) {
  // https://www.iban.com/country-codes
  return {
    alpha2code,
    flag: toFlagEmoji(alpha2code),
    ...countries[alpha2code]
  };
}

export function estimateImageColor(dataUrl) {
  return new Promise(resolve => {
    const context = document.createElement('canvas').getContext('2d');
    const img = new Image(); 
    img.src = dataUrl;
    img.onload = function () {
      context.drawImage(img, 0, 0, 1, 1);
      let [r, g, b] = context.getImageData(0, 0, 1, 1).data.slice(0, 3);
      r = Math.round(r).toString(16).padStart(2, '0');
      g = Math.round(g).toString(16).padStart(2, '0');
      b = Math.round(b).toString(16).padStart(2, '0');
      resolve('#' + r + g + b);
    };
  });
}

export function dataUriFromSvg(svg) {
  return 'data:image/svg+xml;base64,' + btoa(svg);
}

export function byteToHex(x) {
  const hex = x.toString(16);
  return hex.length === 1 ? '0' + hex : hex;
};

export function hexToByte(x) {
  return parseInt(x, 16);
};

// input: h in [0,360] and s,v in [0,1] - output: r,g,b in [0,255]
export function hsl2rgb(h, s, l) 
{
  const a = s * Math.min(l, 1-l);
  const f = (n, k = (n + h / 30) % 12) => l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);                 
  return [f(0), f(8), f(4)].map(x => Math.ceil(x * 255));
}

export function hex2rgb(hex) {
  let r;
  let g;
  let b;
  let a = 1.0;

  switch (hex.length) {
    case 5:
      a = hexToByte(hex[4].repeat(2)) / 256.0;
      /* fall through */

    case 4:
      r = hexToByte(hex[1].repeat(2));
      g = hexToByte(hex[2].repeat(2));
      b = hexToByte(hex[3].repeat(2));
      break;

    case 8:
        a = hexToByte(hex.substr(7, 2)) / 256.0;
        /* fall through */

    case 7:
      r = hexToByte(hex.substr(1, 2));
      g = hexToByte(hex.substr(3, 2));
      b = hexToByte(hex.substr(5, 2));
      break;

    default:
      return;
  }

  return [r, g, b, a];
}

export function hex2hsl(hex) {
  return rgb2hsl(...hex2rgb(hex));
};

export function rgb2hsl(r, g, b, a) {
  r /= 255;
  g /= 255;
  b /= 255;
  const m = Math.max(r, g, b);
  const n = m - Math.min(r, g, b);
  const f = 1 - Math.abs(m + m - n - 1); 
  const h = n && (m === r ? (g - b) / n : ((m === g) ? 2 + (b - r) / n : 4 + (r - g) / n)); 
  return [60 * (h < 0 ? h + 6 : h), f ? n / f : 0, (m + m - n) / 2, a];
}

export function setThemeHexColor(colorKey, hex) {
  const [h, s, l] = hex2hsl(hex);
  document.documentElement.style.setProperty(`--color-${colorKey}-h`, h.toFixed(2));
  document.documentElement.style.setProperty(`--color-${colorKey}-s`, (s * 100).toFixed(2) + '%');
  document.documentElement.style.setProperty(`--color-${colorKey}-l`, (l * 100).toFixed(2) + '%');
}

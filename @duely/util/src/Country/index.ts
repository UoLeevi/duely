export type CountryCode =
  | 'AF'
  | 'AL'
  | 'DZ'
  | 'AS'
  | 'AD'
  | 'AO'
  | 'AI'
  | 'AQ'
  | 'AG'
  | 'AR'
  | 'AM'
  | 'AW'
  | 'AU'
  | 'AT'
  | 'AZ'
  | 'BS'
  | 'BH'
  | 'BD'
  | 'BB'
  | 'BY'
  | 'BE'
  | 'BZ'
  | 'BJ'
  | 'BM'
  | 'BT'
  | 'BO'
  | 'BQ'
  | 'BA'
  | 'BW'
  | 'BV'
  | 'BR'
  | 'IO'
  | 'BN'
  | 'BG'
  | 'BF'
  | 'BI'
  | 'CV'
  | 'KH'
  | 'CM'
  | 'CA'
  | 'KY'
  | 'CF'
  | 'TD'
  | 'CL'
  | 'CN'
  | 'CX'
  | 'CC'
  | 'CO'
  | 'KM'
  | 'CD'
  | 'CG'
  | 'CK'
  | 'CR'
  | 'HR'
  | 'CU'
  | 'CW'
  | 'CY'
  | 'CZ'
  | 'CI'
  | 'DK'
  | 'DJ'
  | 'DM'
  | 'DO'
  | 'EC'
  | 'EG'
  | 'SV'
  | 'GQ'
  | 'ER'
  | 'EE'
  | 'SZ'
  | 'ET'
  | 'FK'
  | 'FO'
  | 'FJ'
  | 'FI'
  | 'FR'
  | 'GF'
  | 'PF'
  | 'TF'
  | 'GA'
  | 'GM'
  | 'GE'
  | 'DE'
  | 'GH'
  | 'GI'
  | 'GR'
  | 'GL'
  | 'GD'
  | 'GP'
  | 'GU'
  | 'GT'
  | 'GG'
  | 'GN'
  | 'GW'
  | 'GY'
  | 'HT'
  | 'HM'
  | 'VA'
  | 'HN'
  | 'HK'
  | 'HU'
  | 'IS'
  | 'IN'
  | 'ID'
  | 'IR'
  | 'IQ'
  | 'IE'
  | 'IM'
  | 'IL'
  | 'IT'
  | 'JM'
  | 'JP'
  | 'JE'
  | 'JO'
  | 'KZ'
  | 'KE'
  | 'KI'
  | 'KP'
  | 'KR'
  | 'KW'
  | 'KG'
  | 'LA'
  | 'LV'
  | 'LB'
  | 'LS'
  | 'LR'
  | 'LY'
  | 'LI'
  | 'LT'
  | 'LU'
  | 'MO'
  | 'MG'
  | 'MW'
  | 'MY'
  | 'MV'
  | 'ML'
  | 'MT'
  | 'MH'
  | 'MQ'
  | 'MR'
  | 'MU'
  | 'YT'
  | 'MX'
  | 'FM'
  | 'MD'
  | 'MC'
  | 'MN'
  | 'ME'
  | 'MS'
  | 'MA'
  | 'MZ'
  | 'MM'
  | 'NA'
  | 'NR'
  | 'NP'
  | 'NL'
  | 'NC'
  | 'NZ'
  | 'NI'
  | 'NE'
  | 'NG'
  | 'NU'
  | 'NF'
  | 'MP'
  | 'NO'
  | 'OM'
  | 'PK'
  | 'PW'
  | 'PS'
  | 'PA'
  | 'PG'
  | 'PY'
  | 'PE'
  | 'PH'
  | 'PN'
  | 'PL'
  | 'PT'
  | 'PR'
  | 'QA'
  | 'MK'
  | 'RO'
  | 'RU'
  | 'RW'
  | 'RE'
  | 'BL'
  | 'SH'
  | 'KN'
  | 'LC'
  | 'MF'
  | 'PM'
  | 'VC'
  | 'WS'
  | 'SM'
  | 'ST'
  | 'SA'
  | 'SN'
  | 'RS'
  | 'SC'
  | 'SL'
  | 'SG'
  | 'SX'
  | 'SK'
  | 'SI'
  | 'SB'
  | 'SO'
  | 'ZA'
  | 'GS'
  | 'SS'
  | 'ES'
  | 'LK'
  | 'SD'
  | 'SR'
  | 'SJ'
  | 'SE'
  | 'CH'
  | 'SY'
  | 'TW'
  | 'TJ'
  | 'TZ'
  | 'TH'
  | 'TL'
  | 'TG'
  | 'TK'
  | 'TO'
  | 'TT'
  | 'TN'
  | 'TR'
  | 'TM'
  | 'TC'
  | 'TV'
  | 'UG'
  | 'UA'
  | 'AE'
  | 'GB'
  | 'UM'
  | 'US'
  | 'UY'
  | 'UZ'
  | 'VU'
  | 'VE'
  | 'VN'
  | 'VG'
  | 'VI'
  | 'WF'
  | 'EH'
  | 'YE'
  | 'ZM'
  | 'ZW'
  | 'AX'
  | 'AC'
  | 'XK'
  | 'TA';

function toFlagEmoji(alpha2Code: CountryCode) {
  const c1 = alpha2Code[0].codePointAt(0) as number;
  const c2 = alpha2Code[1].codePointAt(0) as number;
  return String.fromCodePoint(c1 + 0x1f1e6 - 0x41, c2 + 0x1f1e6 - 0x41);
}

type CountryInfo = {
  code: CountryCode;
  name: string;
  officialName?: string;
  alpha3code?: string;
  numeric?: string;
};

export interface Country extends CountryInfo {
  flag: string;
}

let countries: { [code in CountryCode]: CountryInfo };

export function countryFromCode(alpha2Code: CountryCode): Country {
  return {
    flag: toFlagEmoji(alpha2Code),
    ...countries[alpha2Code]
  };
}

countries = {
  AF: {
    code: 'AF',
    officialName: 'Afghanistan',
    alpha3code: 'AFG',
    numeric: '004',
    name: 'Afghanistan'
  },
  AL: {
    code: 'AL',
    officialName: 'Albania',
    alpha3code: 'ALB',
    numeric: '008',
    name: 'Albania'
  },
  DZ: {
    code: 'DZ',
    officialName: 'Algeria',
    alpha3code: 'DZA',
    numeric: '012',
    name: 'Algeria'
  },
  AS: {
    code: 'AS',
    officialName: 'American Samoa',
    alpha3code: 'ASM',
    numeric: '016',
    name: 'American Samoa'
  },
  AD: {
    code: 'AD',
    officialName: 'Andorra',
    alpha3code: 'AND',
    numeric: '020',
    name: 'Andorra'
  },
  AO: {
    code: 'AO',
    officialName: 'Angola',
    alpha3code: 'AGO',
    numeric: '024',
    name: 'Angola'
  },
  AI: {
    code: 'AI',
    officialName: 'Anguilla',
    alpha3code: 'AIA',
    numeric: '660',
    name: 'Anguilla'
  },
  AQ: {
    code: 'AQ',
    officialName: 'Antarctica',
    alpha3code: 'ATA',
    numeric: '010',
    name: 'Antarctica'
  },
  AG: {
    code: 'AG',
    officialName: 'Antigua and Barbuda',
    alpha3code: 'ATG',
    numeric: '028',
    name: 'Antigua & Barbuda'
  },
  AR: {
    code: 'AR',
    officialName: 'Argentina',
    alpha3code: 'ARG',
    numeric: '032',
    name: 'Argentina'
  },
  AM: {
    code: 'AM',
    officialName: 'Armenia',
    alpha3code: 'ARM',
    numeric: '051',
    name: 'Armenia'
  },
  AW: {
    code: 'AW',
    officialName: 'Aruba',
    alpha3code: 'ABW',
    numeric: '533',
    name: 'Aruba'
  },
  AU: {
    code: 'AU',
    officialName: 'Australia',
    alpha3code: 'AUS',
    numeric: '036',
    name: 'Australia'
  },
  AT: {
    code: 'AT',
    officialName: 'Austria',
    alpha3code: 'AUT',
    numeric: '040',
    name: 'Austria'
  },
  AZ: {
    code: 'AZ',
    officialName: 'Azerbaijan',
    alpha3code: 'AZE',
    numeric: '031',
    name: 'Azerbaijan'
  },
  BS: {
    code: 'BS',
    officialName: 'Bahamas (the)',
    alpha3code: 'BHS',
    numeric: '044',
    name: 'Bahamas'
  },
  BH: {
    code: 'BH',
    officialName: 'Bahrain',
    alpha3code: 'BHR',
    numeric: '048',
    name: 'Bahrain'
  },
  BD: {
    code: 'BD',
    officialName: 'Bangladesh',
    alpha3code: 'BGD',
    numeric: '050',
    name: 'Bangladesh'
  },
  BB: {
    code: 'BB',
    officialName: 'Barbados',
    alpha3code: 'BRB',
    numeric: '052',
    name: 'Barbados'
  },
  BY: {
    code: 'BY',
    officialName: 'Belarus',
    alpha3code: 'BLR',
    numeric: '112',
    name: 'Belarus'
  },
  BE: {
    code: 'BE',
    officialName: 'Belgium',
    alpha3code: 'BEL',
    numeric: '056',
    name: 'Belgium'
  },
  BZ: {
    code: 'BZ',
    officialName: 'Belize',
    alpha3code: 'BLZ',
    numeric: '084',
    name: 'Belize'
  },
  BJ: {
    code: 'BJ',
    officialName: 'Benin',
    alpha3code: 'BEN',
    numeric: '204',
    name: 'Benin'
  },
  BM: {
    code: 'BM',
    officialName: 'Bermuda',
    alpha3code: 'BMU',
    numeric: '060',
    name: 'Bermuda'
  },
  BT: {
    code: 'BT',
    officialName: 'Bhutan',
    alpha3code: 'BTN',
    numeric: '064',
    name: 'Bhutan'
  },
  BO: {
    code: 'BO',
    officialName: 'Bolivia (Plurinational State of)',
    alpha3code: 'BOL',
    numeric: '068',
    name: 'Bolivia'
  },
  BQ: {
    code: 'BQ',
    officialName: 'Bonaire, Sint Eustatius and Saba',
    alpha3code: 'BES',
    numeric: '535',
    name: 'Caribbean Netherlands'
  },
  BA: {
    code: 'BA',
    officialName: 'Bosnia and Herzegovina',
    alpha3code: 'BIH',
    numeric: '070',
    name: 'Bosnia & Herzegovina'
  },
  BW: {
    code: 'BW',
    officialName: 'Botswana',
    alpha3code: 'BWA',
    numeric: '072',
    name: 'Botswana'
  },
  BV: {
    code: 'BV',
    officialName: 'Bouvet Island',
    alpha3code: 'BVT',
    numeric: '074',
    name: 'Bouvet Island'
  },
  BR: {
    code: 'BR',
    officialName: 'Brazil',
    alpha3code: 'BRA',
    numeric: '076',
    name: 'Brazil'
  },
  IO: {
    code: 'IO',
    officialName: 'British Indian Ocean Territory (the)',
    alpha3code: 'IOT',
    numeric: '086',
    name: 'British Indian Ocean Territory'
  },
  BN: {
    code: 'BN',
    officialName: 'Brunei Darussalam',
    alpha3code: 'BRN',
    numeric: '096',
    name: 'Brunei'
  },
  BG: {
    code: 'BG',
    officialName: 'Bulgaria',
    alpha3code: 'BGR',
    numeric: '100',
    name: 'Bulgaria'
  },
  BF: {
    code: 'BF',
    officialName: 'Burkina Faso',
    alpha3code: 'BFA',
    numeric: '854',
    name: 'Burkina Faso'
  },
  BI: {
    code: 'BI',
    officialName: 'Burundi',
    alpha3code: 'BDI',
    numeric: '108',
    name: 'Burundi'
  },
  CV: {
    code: 'CV',
    officialName: 'Cabo Verde',
    alpha3code: 'CPV',
    numeric: '132',
    name: 'Cape Verde'
  },
  KH: {
    code: 'KH',
    officialName: 'Cambodia',
    alpha3code: 'KHM',
    numeric: '116',
    name: 'Cambodia'
  },
  CM: {
    code: 'CM',
    officialName: 'Cameroon',
    alpha3code: 'CMR',
    numeric: '120',
    name: 'Cameroon'
  },
  CA: {
    code: 'CA',
    officialName: 'Canada',
    alpha3code: 'CAN',
    numeric: '124',
    name: 'Canada'
  },
  KY: {
    code: 'KY',
    officialName: 'Cayman Islands (the)',
    alpha3code: 'CYM',
    numeric: '136',
    name: 'Cayman Islands'
  },
  CF: {
    code: 'CF',
    officialName: 'Central African Republic (the)',
    alpha3code: 'CAF',
    numeric: '140',
    name: 'Central African Republic'
  },
  TD: {
    code: 'TD',
    officialName: 'Chad',
    alpha3code: 'TCD',
    numeric: '148',
    name: 'Chad'
  },
  CL: {
    code: 'CL',
    officialName: 'Chile',
    alpha3code: 'CHL',
    numeric: '152',
    name: 'Chile'
  },
  CN: {
    code: 'CN',
    officialName: 'China',
    alpha3code: 'CHN',
    numeric: '156',
    name: 'China'
  },
  CX: {
    code: 'CX',
    officialName: 'Christmas Island',
    alpha3code: 'CXR',
    numeric: '162',
    name: 'Christmas Island'
  },
  CC: {
    code: 'CC',
    officialName: 'Cocos (Keeling) Islands (the)',
    alpha3code: 'CCK',
    numeric: '166',
    name: 'Cocos Keeling Islands'
  },
  CO: {
    code: 'CO',
    officialName: 'Colombia',
    alpha3code: 'COL',
    numeric: '170',
    name: 'Colombia'
  },
  KM: {
    code: 'KM',
    officialName: 'Comoros (the)',
    alpha3code: 'COM',
    numeric: '174',
    name: 'Comoros'
  },
  CD: {
    code: 'CD',
    officialName: 'Congo (the Democratic Republic of the)',
    alpha3code: 'COD',
    numeric: '180',
    name: 'Congo - Kinshasa'
  },
  CG: {
    code: 'CG',
    officialName: 'Congo (the)',
    alpha3code: 'COG',
    numeric: '178',
    name: 'Congo - Brazzaville'
  },
  CK: {
    code: 'CK',
    officialName: 'Cook Islands (the)',
    alpha3code: 'COK',
    numeric: '184',
    name: 'Cook Islands'
  },
  CR: {
    code: 'CR',
    officialName: 'Costa Rica',
    alpha3code: 'CRI',
    numeric: '188',
    name: 'Costa Rica'
  },
  HR: {
    code: 'HR',
    officialName: 'Croatia',
    alpha3code: 'HRV',
    numeric: '191',
    name: 'Croatia'
  },
  CU: {
    code: 'CU',
    officialName: 'Cuba',
    alpha3code: 'CUB',
    numeric: '192',
    name: 'Cuba'
  },
  CW: {
    code: 'CW',
    officialName: 'Curaçao',
    alpha3code: 'CUW',
    numeric: '531',
    name: 'Curaçao'
  },
  CY: {
    code: 'CY',
    officialName: 'Cyprus',
    alpha3code: 'CYP',
    numeric: '196',
    name: 'Cyprus'
  },
  CZ: {
    code: 'CZ',
    officialName: 'Czechia',
    alpha3code: 'CZE',
    numeric: '203',
    name: 'Czechia'
  },
  CI: {
    code: 'CI',
    officialName: "Côte d'Ivoire",
    alpha3code: 'CIV',
    numeric: '384',
    name: 'Côte d’Ivoire'
  },
  DK: {
    code: 'DK',
    officialName: 'Denmark',
    alpha3code: 'DNK',
    numeric: '208',
    name: 'Denmark'
  },
  DJ: {
    code: 'DJ',
    officialName: 'Djibouti',
    alpha3code: 'DJI',
    numeric: '262',
    name: 'Djibouti'
  },
  DM: {
    code: 'DM',
    officialName: 'Dominica',
    alpha3code: 'DMA',
    numeric: '212',
    name: 'Dominica'
  },
  DO: {
    code: 'DO',
    officialName: 'Dominican Republic (the)',
    alpha3code: 'DOM',
    numeric: '214',
    name: 'Dominican Republic'
  },
  EC: {
    code: 'EC',
    officialName: 'Ecuador',
    alpha3code: 'ECU',
    numeric: '218',
    name: 'Ecuador'
  },
  EG: {
    code: 'EG',
    officialName: 'Egypt',
    alpha3code: 'EGY',
    numeric: '818',
    name: 'Egypt'
  },
  SV: {
    code: 'SV',
    officialName: 'El Salvador',
    alpha3code: 'SLV',
    numeric: '222',
    name: 'El Salvador'
  },
  GQ: {
    code: 'GQ',
    officialName: 'Equatorial Guinea',
    alpha3code: 'GNQ',
    numeric: '226',
    name: 'Equatorial Guinea'
  },
  ER: {
    code: 'ER',
    officialName: 'Eritrea',
    alpha3code: 'ERI',
    numeric: '232',
    name: 'Eritrea'
  },
  EE: {
    code: 'EE',
    officialName: 'Estonia',
    alpha3code: 'EST',
    numeric: '233',
    name: 'Estonia'
  },
  SZ: {
    code: 'SZ',
    officialName: 'Eswatini',
    alpha3code: 'SWZ',
    numeric: '748',
    name: 'Eswatini'
  },
  ET: {
    code: 'ET',
    officialName: 'Ethiopia',
    alpha3code: 'ETH',
    numeric: '231',
    name: 'Ethiopia'
  },
  FK: {
    code: 'FK',
    officialName: 'Falkland Islands (the) [Malvinas]',
    alpha3code: 'FLK',
    numeric: '238',
    name: 'Falkland Islands'
  },
  FO: {
    code: 'FO',
    officialName: 'Faroe Islands (the)',
    alpha3code: 'FRO',
    numeric: '234',
    name: 'Faroe Islands'
  },
  FJ: {
    code: 'FJ',
    officialName: 'Fiji',
    alpha3code: 'FJI',
    numeric: '242',
    name: 'Fiji'
  },
  FI: {
    code: 'FI',
    officialName: 'Finland',
    alpha3code: 'FIN',
    numeric: '246',
    name: 'Finland'
  },
  FR: {
    code: 'FR',
    officialName: 'France',
    alpha3code: 'FRA',
    numeric: '250',
    name: 'France'
  },
  GF: {
    code: 'GF',
    officialName: 'French Guiana',
    alpha3code: 'GUF',
    numeric: '254',
    name: 'French Guiana'
  },
  PF: {
    code: 'PF',
    officialName: 'French Polynesia',
    alpha3code: 'PYF',
    numeric: '258',
    name: 'French Polynesia'
  },
  TF: {
    code: 'TF',
    officialName: 'French Southern Territories (the)',
    alpha3code: 'ATF',
    numeric: '260',
    name: 'French Southern Territories'
  },
  GA: {
    code: 'GA',
    officialName: 'Gabon',
    alpha3code: 'GAB',
    numeric: '266',
    name: 'Gabon'
  },
  GM: {
    code: 'GM',
    officialName: 'Gambia (the)',
    alpha3code: 'GMB',
    numeric: '270',
    name: 'Gambia'
  },
  GE: {
    code: 'GE',
    officialName: 'Georgia',
    alpha3code: 'GEO',
    numeric: '268',
    name: 'Georgia'
  },
  DE: {
    code: 'DE',
    officialName: 'Germany',
    alpha3code: 'DEU',
    numeric: '276',
    name: 'Germany'
  },
  GH: {
    code: 'GH',
    officialName: 'Ghana',
    alpha3code: 'GHA',
    numeric: '288',
    name: 'Ghana'
  },
  GI: {
    code: 'GI',
    officialName: 'Gibraltar',
    alpha3code: 'GIB',
    numeric: '292',
    name: 'Gibraltar'
  },
  GR: {
    code: 'GR',
    officialName: 'Greece',
    alpha3code: 'GRC',
    numeric: '300',
    name: 'Greece'
  },
  GL: {
    code: 'GL',
    officialName: 'Greenland',
    alpha3code: 'GRL',
    numeric: '304',
    name: 'Greenland'
  },
  GD: {
    code: 'GD',
    officialName: 'Grenada',
    alpha3code: 'GRD',
    numeric: '308',
    name: 'Grenada'
  },
  GP: {
    code: 'GP',
    officialName: 'Guadeloupe',
    alpha3code: 'GLP',
    numeric: '312',
    name: 'Guadeloupe'
  },
  GU: {
    code: 'GU',
    officialName: 'Guam',
    alpha3code: 'GUM',
    numeric: '316',
    name: 'Guam'
  },
  GT: {
    code: 'GT',
    officialName: 'Guatemala',
    alpha3code: 'GTM',
    numeric: '320',
    name: 'Guatemala'
  },
  GG: {
    code: 'GG',
    officialName: 'Guernsey',
    alpha3code: 'GGY',
    numeric: '831',
    name: 'Guernsey'
  },
  GN: {
    code: 'GN',
    officialName: 'Guinea',
    alpha3code: 'GIN',
    numeric: '324',
    name: 'Guinea'
  },
  GW: {
    code: 'GW',
    officialName: 'Guinea-Bissau',
    alpha3code: 'GNB',
    numeric: '624',
    name: 'Guinea-Bissau'
  },
  GY: {
    code: 'GY',
    officialName: 'Guyana',
    alpha3code: 'GUY',
    numeric: '328',
    name: 'Guyana'
  },
  HT: {
    code: 'HT',
    officialName: 'Haiti',
    alpha3code: 'HTI',
    numeric: '332',
    name: 'Haiti'
  },
  HM: {
    code: 'HM',
    officialName: 'Heard Island and McDonald Islands',
    alpha3code: 'HMD',
    numeric: '334',
    name: 'Heard Island and McDonald Islands'
  },
  VA: {
    code: 'VA',
    officialName: 'Holy See (the)',
    alpha3code: 'VAT',
    numeric: '336',
    name: 'Vatican City'
  },
  HN: {
    code: 'HN',
    officialName: 'Honduras',
    alpha3code: 'HND',
    numeric: '340',
    name: 'Honduras'
  },
  HK: {
    code: 'HK',
    officialName: 'Hong Kong',
    alpha3code: 'HKG',
    numeric: '344',
    name: 'Hong Kong SAR China'
  },
  HU: {
    code: 'HU',
    officialName: 'Hungary',
    alpha3code: 'HUN',
    numeric: '348',
    name: 'Hungary'
  },
  IS: {
    code: 'IS',
    officialName: 'Iceland',
    alpha3code: 'ISL',
    numeric: '352',
    name: 'Iceland'
  },
  IN: {
    code: 'IN',
    officialName: 'India',
    alpha3code: 'IND',
    numeric: '356',
    name: 'India'
  },
  ID: {
    code: 'ID',
    officialName: 'Indonesia',
    alpha3code: 'IDN',
    numeric: '360',
    name: 'Indonesia'
  },
  IR: {
    code: 'IR',
    officialName: 'Iran (Islamic Republic of)',
    alpha3code: 'IRN',
    numeric: '364',
    name: 'Iran'
  },
  IQ: {
    code: 'IQ',
    officialName: 'Iraq',
    alpha3code: 'IRQ',
    numeric: '368',
    name: 'Iraq'
  },
  IE: {
    code: 'IE',
    officialName: 'Ireland',
    alpha3code: 'IRL',
    numeric: '372',
    name: 'Ireland'
  },
  IM: {
    code: 'IM',
    officialName: 'Isle of Man',
    alpha3code: 'IMN',
    numeric: '833',
    name: 'Isle of Man'
  },
  IL: {
    code: 'IL',
    officialName: 'Israel',
    alpha3code: 'ISR',
    numeric: '376',
    name: 'Israel'
  },
  IT: {
    code: 'IT',
    officialName: 'Italy',
    alpha3code: 'ITA',
    numeric: '380',
    name: 'Italy'
  },
  JM: {
    code: 'JM',
    officialName: 'Jamaica',
    alpha3code: 'JAM',
    numeric: '388',
    name: 'Jamaica'
  },
  JP: {
    code: 'JP',
    officialName: 'Japan',
    alpha3code: 'JPN',
    numeric: '392',
    name: 'Japan'
  },
  JE: {
    code: 'JE',
    officialName: 'Jersey',
    alpha3code: 'JEY',
    numeric: '832',
    name: 'Jersey'
  },
  JO: {
    code: 'JO',
    officialName: 'Jordan',
    alpha3code: 'JOR',
    numeric: '400',
    name: 'Jordan'
  },
  KZ: {
    code: 'KZ',
    officialName: 'Kazakhstan',
    alpha3code: 'KAZ',
    numeric: '398',
    name: 'Kazakhstan'
  },
  KE: {
    code: 'KE',
    officialName: 'Kenya',
    alpha3code: 'KEN',
    numeric: '404',
    name: 'Kenya'
  },
  KI: {
    code: 'KI',
    officialName: 'Kiribati',
    alpha3code: 'KIR',
    numeric: '296',
    name: 'Kiribati'
  },
  KP: {
    code: 'KP',
    officialName: "Korea (the Democratic People's Republic of)",
    alpha3code: 'PRK',
    numeric: '408',
    name: 'North Korea'
  },
  KR: {
    code: 'KR',
    officialName: 'Korea (the Republic of)',
    alpha3code: 'KOR',
    numeric: '410',
    name: 'Republic of Korea'
  },
  KW: {
    code: 'KW',
    officialName: 'Kuwait',
    alpha3code: 'KWT',
    numeric: '414',
    name: 'Kuwait'
  },
  KG: {
    code: 'KG',
    officialName: 'Kyrgyzstan',
    alpha3code: 'KGZ',
    numeric: '417',
    name: 'Kyrgyzstan'
  },
  LA: {
    code: 'LA',
    officialName: "Lao People's Democratic Republic (the)",
    alpha3code: 'LAO',
    numeric: '418',
    name: 'Laos'
  },
  LV: {
    code: 'LV',
    officialName: 'Latvia',
    alpha3code: 'LVA',
    numeric: '428',
    name: 'Latvia'
  },
  LB: {
    code: 'LB',
    officialName: 'Lebanon',
    alpha3code: 'LBN',
    numeric: '422',
    name: 'Lebanon'
  },
  LS: {
    code: 'LS',
    officialName: 'Lesotho',
    alpha3code: 'LSO',
    numeric: '426',
    name: 'Lesotho'
  },
  LR: {
    code: 'LR',
    officialName: 'Liberia',
    alpha3code: 'LBR',
    numeric: '430',
    name: 'Liberia'
  },
  LY: {
    code: 'LY',
    officialName: 'Libya',
    alpha3code: 'LBY',
    numeric: '434',
    name: 'Libya'
  },
  LI: {
    code: 'LI',
    officialName: 'Liechtenstein',
    alpha3code: 'LIE',
    numeric: '438',
    name: 'Liechtenstein'
  },
  LT: {
    code: 'LT',
    officialName: 'Lithuania',
    alpha3code: 'LTU',
    numeric: '440',
    name: 'Lithuania'
  },
  LU: {
    code: 'LU',
    officialName: 'Luxembourg',
    alpha3code: 'LUX',
    numeric: '442',
    name: 'Luxembourg'
  },
  MO: {
    code: 'MO',
    officialName: 'Macao',
    alpha3code: 'MAC',
    numeric: '446',
    name: 'Macao SAR China'
  },
  MG: {
    code: 'MG',
    officialName: 'Madagascar',
    alpha3code: 'MDG',
    numeric: '450',
    name: 'Madagascar'
  },
  MW: {
    code: 'MW',
    officialName: 'Malawi',
    alpha3code: 'MWI',
    numeric: '454',
    name: 'Malawi'
  },
  MY: {
    code: 'MY',
    officialName: 'Malaysia',
    alpha3code: 'MYS',
    numeric: '458',
    name: 'Malaysia'
  },
  MV: {
    code: 'MV',
    officialName: 'Maldives',
    alpha3code: 'MDV',
    numeric: '462',
    name: 'Maldives'
  },
  ML: {
    code: 'ML',
    officialName: 'Mali',
    alpha3code: 'MLI',
    numeric: '466',
    name: 'Mali'
  },
  MT: {
    code: 'MT',
    officialName: 'Malta',
    alpha3code: 'MLT',
    numeric: '470',
    name: 'Malta'
  },
  MH: {
    code: 'MH',
    officialName: 'Marshall Islands (the)',
    alpha3code: 'MHL',
    numeric: '584',
    name: 'Marshall Islands'
  },
  MQ: {
    code: 'MQ',
    officialName: 'Martinique',
    alpha3code: 'MTQ',
    numeric: '474',
    name: 'Martinique'
  },
  MR: {
    code: 'MR',
    officialName: 'Mauritania',
    alpha3code: 'MRT',
    numeric: '478',
    name: 'Mauritania'
  },
  MU: {
    code: 'MU',
    officialName: 'Mauritius',
    alpha3code: 'MUS',
    numeric: '480',
    name: 'Mauritius'
  },
  YT: {
    code: 'YT',
    officialName: 'Mayotte',
    alpha3code: 'MYT',
    numeric: '175',
    name: 'Mayotte'
  },
  MX: {
    code: 'MX',
    officialName: 'Mexico',
    alpha3code: 'MEX',
    numeric: '484',
    name: 'Mexico'
  },
  FM: {
    code: 'FM',
    officialName: 'Micronesia (Federated States of)',
    alpha3code: 'FSM',
    numeric: '583',
    name: 'Micronesia'
  },
  MD: {
    code: 'MD',
    officialName: 'Moldova (the Republic of)',
    alpha3code: 'MDA',
    numeric: '498',
    name: 'Moldova'
  },
  MC: {
    code: 'MC',
    officialName: 'Monaco',
    alpha3code: 'MCO',
    numeric: '492',
    name: 'Monaco'
  },
  MN: {
    code: 'MN',
    officialName: 'Mongolia',
    alpha3code: 'MNG',
    numeric: '496',
    name: 'Mongolia'
  },
  ME: {
    code: 'ME',
    officialName: 'Montenegro',
    alpha3code: 'MNE',
    numeric: '499',
    name: 'Montenegro'
  },
  MS: {
    code: 'MS',
    officialName: 'Montserrat',
    alpha3code: 'MSR',
    numeric: '500',
    name: 'Montserrat'
  },
  MA: {
    code: 'MA',
    officialName: 'Morocco',
    alpha3code: 'MAR',
    numeric: '504',
    name: 'Morocco'
  },
  MZ: {
    code: 'MZ',
    officialName: 'Mozambique',
    alpha3code: 'MOZ',
    numeric: '508',
    name: 'Mozambique'
  },
  MM: {
    code: 'MM',
    officialName: 'Myanmar',
    alpha3code: 'MMR',
    numeric: '104',
    name: 'Myanmar (Burma)'
  },
  NA: {
    code: 'NA',
    officialName: 'Namibia',
    alpha3code: 'NAM',
    numeric: '516',
    name: 'Namibia'
  },
  NR: {
    code: 'NR',
    officialName: 'Nauru',
    alpha3code: 'NRU',
    numeric: '520',
    name: 'Nauru'
  },
  NP: {
    code: 'NP',
    officialName: 'Nepal',
    alpha3code: 'NPL',
    numeric: '524',
    name: 'Nepal'
  },
  NL: {
    code: 'NL',
    officialName: 'Netherlands (the)',
    alpha3code: 'NLD',
    numeric: '528',
    name: 'Netherlands'
  },
  NC: {
    code: 'NC',
    officialName: 'New Caledonia',
    alpha3code: 'NCL',
    numeric: '540',
    name: 'New Caledonia'
  },
  NZ: {
    code: 'NZ',
    officialName: 'New Zealand',
    alpha3code: 'NZL',
    numeric: '554',
    name: 'New Zealand'
  },
  NI: {
    code: 'NI',
    officialName: 'Nicaragua',
    alpha3code: 'NIC',
    numeric: '558',
    name: 'Nicaragua'
  },
  NE: {
    code: 'NE',
    officialName: 'Niger (the)',
    alpha3code: 'NER',
    numeric: '562',
    name: 'Niger'
  },
  NG: {
    code: 'NG',
    officialName: 'Nigeria',
    alpha3code: 'NGA',
    numeric: '566',
    name: 'Nigeria'
  },
  NU: {
    code: 'NU',
    officialName: 'Niue',
    alpha3code: 'NIU',
    numeric: '570',
    name: 'Niue'
  },
  NF: {
    code: 'NF',
    officialName: 'Norfolk Island',
    alpha3code: 'NFK',
    numeric: '574',
    name: 'Norfolk Island'
  },
  MP: {
    code: 'MP',
    officialName: 'Northern Mariana Islands (the)',
    alpha3code: 'MNP',
    numeric: '580',
    name: 'Northern Mariana Islands (the)'
  },
  NO: {
    code: 'NO',
    officialName: 'Norway',
    alpha3code: 'NOR',
    numeric: '578',
    name: 'Norway'
  },
  OM: {
    code: 'OM',
    officialName: 'Oman',
    alpha3code: 'OMN',
    numeric: '512',
    name: 'Oman'
  },
  PK: {
    code: 'PK',
    officialName: 'Pakistan',
    alpha3code: 'PAK',
    numeric: '586',
    name: 'Pakistan'
  },
  PW: {
    code: 'PW',
    officialName: 'Palau',
    alpha3code: 'PLW',
    numeric: '585',
    name: 'Palau'
  },
  PS: {
    code: 'PS',
    officialName: 'Palestine, State of',
    alpha3code: 'PSE',
    numeric: '275',
    name: 'Palestinian Territories'
  },
  PA: {
    code: 'PA',
    officialName: 'Panama',
    alpha3code: 'PAN',
    numeric: '591',
    name: 'Panama'
  },
  PG: {
    code: 'PG',
    officialName: 'Papua New Guinea',
    alpha3code: 'PNG',
    numeric: '598',
    name: 'Papua New Guinea'
  },
  PY: {
    code: 'PY',
    officialName: 'Paraguay',
    alpha3code: 'PRY',
    numeric: '600',
    name: 'Paraguay'
  },
  PE: {
    code: 'PE',
    officialName: 'Peru',
    alpha3code: 'PER',
    numeric: '604',
    name: 'Peru'
  },
  PH: {
    code: 'PH',
    officialName: 'Philippines (the)',
    alpha3code: 'PHL',
    numeric: '608',
    name: 'Philippines'
  },
  PN: {
    code: 'PN',
    officialName: 'Pitcairn',
    alpha3code: 'PCN',
    numeric: '612',
    name: 'Pitcairn Islands'
  },
  PL: {
    code: 'PL',
    officialName: 'Poland',
    alpha3code: 'POL',
    numeric: '616',
    name: 'Poland'
  },
  PT: {
    code: 'PT',
    officialName: 'Portugal',
    alpha3code: 'PRT',
    numeric: '620',
    name: 'Portugal'
  },
  PR: {
    code: 'PR',
    officialName: 'Puerto Rico',
    alpha3code: 'PRI',
    numeric: '630',
    name: 'Puerto Rico'
  },
  QA: {
    code: 'QA',
    officialName: 'Qatar',
    alpha3code: 'QAT',
    numeric: '634',
    name: 'Qatar'
  },
  MK: {
    code: 'MK',
    officialName: 'Republic of North Macedonia',
    alpha3code: 'MKD',
    numeric: '807',
    name: 'North Macedonia'
  },
  RO: {
    code: 'RO',
    officialName: 'Romania',
    alpha3code: 'ROU',
    numeric: '642',
    name: 'Romania'
  },
  RU: {
    code: 'RU',
    officialName: 'Russian Federation (the)',
    alpha3code: 'RUS',
    numeric: '643',
    name: 'Russia'
  },
  RW: {
    code: 'RW',
    officialName: 'Rwanda',
    alpha3code: 'RWA',
    numeric: '646',
    name: 'Rwanda'
  },
  RE: {
    code: 'RE',
    officialName: 'Réunion',
    alpha3code: 'REU',
    numeric: '638',
    name: 'Réunion'
  },
  BL: {
    code: 'BL',
    officialName: 'Saint Barthélemy',
    alpha3code: 'BLM',
    numeric: '652',
    name: 'St. Barthélemy'
  },
  SH: {
    code: 'SH',
    officialName: 'Saint Helena, Ascension and Tristan da Cunha',
    alpha3code: 'SHN',
    numeric: '654',
    name: 'St. Helena'
  },
  KN: {
    code: 'KN',
    officialName: 'Saint Kitts and Nevis',
    alpha3code: 'KNA',
    numeric: '659',
    name: 'St. Kitts & Nevis'
  },
  LC: {
    code: 'LC',
    officialName: 'Saint Lucia',
    alpha3code: 'LCA',
    numeric: '662',
    name: 'St. Lucia'
  },
  MF: {
    code: 'MF',
    officialName: 'Saint Martin (French part)',
    alpha3code: 'MAF',
    numeric: '663',
    name: 'St. Martin'
  },
  PM: {
    code: 'PM',
    officialName: 'Saint Pierre and Miquelon',
    alpha3code: 'SPM',
    numeric: '666',
    name: 'St. Pierre & Miquelon'
  },
  VC: {
    code: 'VC',
    officialName: 'Saint Vincent and the Grenadines',
    alpha3code: 'VCT',
    numeric: '670',
    name: 'St. Vincent & Grenadines'
  },
  WS: {
    code: 'WS',
    officialName: 'Samoa',
    alpha3code: 'WSM',
    numeric: '882',
    name: 'Samoa'
  },
  SM: {
    code: 'SM',
    officialName: 'San Marino',
    alpha3code: 'SMR',
    numeric: '674',
    name: 'San Marino'
  },
  ST: {
    code: 'ST',
    officialName: 'Sao Tome and Principe',
    alpha3code: 'STP',
    numeric: '678',
    name: 'São Tomé & Príncipe'
  },
  SA: {
    code: 'SA',
    officialName: 'Saudi Arabia',
    alpha3code: 'SAU',
    numeric: '682',
    name: 'Saudi Arabia'
  },
  SN: {
    code: 'SN',
    officialName: 'Senegal',
    alpha3code: 'SEN',
    numeric: '686',
    name: 'Senegal'
  },
  RS: {
    code: 'RS',
    officialName: 'Serbia',
    alpha3code: 'SRB',
    numeric: '688',
    name: 'Serbia'
  },
  SC: {
    code: 'SC',
    officialName: 'Seychelles',
    alpha3code: 'SYC',
    numeric: '690',
    name: 'Seychelles'
  },
  SL: {
    code: 'SL',
    officialName: 'Sierra Leone',
    alpha3code: 'SLE',
    numeric: '694',
    name: 'Sierra Leone'
  },
  SG: {
    code: 'SG',
    officialName: 'Singapore',
    alpha3code: 'SGP',
    numeric: '702',
    name: 'Singapore'
  },
  SX: {
    code: 'SX',
    officialName: 'Sint Maarten (Dutch part)',
    alpha3code: 'SXM',
    numeric: '534',
    name: 'Sint Maarten'
  },
  SK: {
    code: 'SK',
    officialName: 'Slovakia',
    alpha3code: 'SVK',
    numeric: '703',
    name: 'Slovakia'
  },
  SI: {
    code: 'SI',
    officialName: 'Slovenia',
    alpha3code: 'SVN',
    numeric: '705',
    name: 'Slovenia'
  },
  SB: {
    code: 'SB',
    officialName: 'Solomon Islands',
    alpha3code: 'SLB',
    numeric: '090',
    name: 'Solomon Islands'
  },
  SO: {
    code: 'SO',
    officialName: 'Somalia',
    alpha3code: 'SOM',
    numeric: '706',
    name: 'Somalia'
  },
  ZA: {
    code: 'ZA',
    officialName: 'South Africa',
    alpha3code: 'ZAF',
    numeric: '710',
    name: 'South Africa'
  },
  GS: {
    code: 'GS',
    officialName: 'South Georgia and the South Sandwich Islands',
    alpha3code: 'SGS',
    numeric: '239',
    name: 'South Georgia & South Sandwich Islands'
  },
  SS: {
    code: 'SS',
    officialName: 'South Sudan',
    alpha3code: 'SSD',
    numeric: '728',
    name: 'South Sudan'
  },
  ES: {
    code: 'ES',
    officialName: 'Spain',
    alpha3code: 'ESP',
    numeric: '724',
    name: 'Spain'
  },
  LK: {
    code: 'LK',
    officialName: 'Sri Lanka',
    alpha3code: 'LKA',
    numeric: '144',
    name: 'Sri Lanka'
  },
  SD: {
    code: 'SD',
    officialName: 'Sudan (the)',
    alpha3code: 'SDN',
    numeric: '729',
    name: 'Sudan'
  },
  SR: {
    code: 'SR',
    officialName: 'Suriname',
    alpha3code: 'SUR',
    numeric: '740',
    name: 'Suriname'
  },
  SJ: {
    code: 'SJ',
    officialName: 'Svalbard and Jan Mayen',
    alpha3code: 'SJM',
    numeric: '744',
    name: 'Svalbard & Jan Mayen'
  },
  SE: {
    code: 'SE',
    officialName: 'Sweden',
    alpha3code: 'SWE',
    numeric: '752',
    name: 'Sweden'
  },
  CH: {
    code: 'CH',
    officialName: 'Switzerland',
    alpha3code: 'CHE',
    numeric: '756',
    name: 'Switzerland'
  },
  SY: {
    code: 'SY',
    officialName: 'Syrian Arab Republic',
    alpha3code: 'SYR',
    numeric: '760',
    name: 'Syria'
  },
  TW: {
    code: 'TW',
    officialName: 'Taiwan (Province of China)',
    alpha3code: 'TWN',
    numeric: '158',
    name: 'Taiwan'
  },
  TJ: {
    code: 'TJ',
    officialName: 'Tajikistan',
    alpha3code: 'TJK',
    numeric: '762',
    name: 'Tajikistan'
  },
  TZ: {
    code: 'TZ',
    officialName: 'Tanzania, United Republic of',
    alpha3code: 'TZA',
    numeric: '834',
    name: 'Tanzania'
  },
  TH: {
    code: 'TH',
    officialName: 'Thailand',
    alpha3code: 'THA',
    numeric: '764',
    name: 'Thailand'
  },
  TL: {
    code: 'TL',
    officialName: 'Timor-Leste',
    alpha3code: 'TLS',
    numeric: '626',
    name: 'Timor-Leste'
  },
  TG: {
    code: 'TG',
    officialName: 'Togo',
    alpha3code: 'TGO',
    numeric: '768',
    name: 'Togo'
  },
  TK: {
    code: 'TK',
    officialName: 'Tokelau',
    alpha3code: 'TKL',
    numeric: '772',
    name: 'Tokelau'
  },
  TO: {
    code: 'TO',
    officialName: 'Tonga',
    alpha3code: 'TON',
    numeric: '776',
    name: 'Tonga'
  },
  TT: {
    code: 'TT',
    officialName: 'Trinidad and Tobago',
    alpha3code: 'TTO',
    numeric: '780',
    name: 'Trinidad & Tobago'
  },
  TN: {
    code: 'TN',
    officialName: 'Tunisia',
    alpha3code: 'TUN',
    numeric: '788',
    name: 'Tunisia'
  },
  TR: {
    code: 'TR',
    officialName: 'Turkey',
    alpha3code: 'TUR',
    numeric: '792',
    name: 'Turkey'
  },
  TM: {
    code: 'TM',
    officialName: 'Turkmenistan',
    alpha3code: 'TKM',
    numeric: '795',
    name: 'Turkmenistan'
  },
  TC: {
    code: 'TC',
    officialName: 'Turks and Caicos Islands (the)',
    alpha3code: 'TCA',
    numeric: '796',
    name: 'Turks & Caicos Islands'
  },
  TV: {
    code: 'TV',
    officialName: 'Tuvalu',
    alpha3code: 'TUV',
    numeric: '798',
    name: 'Tuvalu'
  },
  UG: {
    code: 'UG',
    officialName: 'Uganda',
    alpha3code: 'UGA',
    numeric: '800',
    name: 'Uganda'
  },
  UA: {
    code: 'UA',
    officialName: 'Ukraine',
    alpha3code: 'UKR',
    numeric: '804',
    name: 'Ukraine'
  },
  AE: {
    code: 'AE',
    officialName: 'United Arab Emirates (the)',
    alpha3code: 'ARE',
    numeric: '784',
    name: 'United Arab Emirates'
  },
  GB: {
    code: 'GB',
    officialName: 'United Kingdom of Great Britain and Northern Ireland (the)',
    alpha3code: 'GBR',
    numeric: '826',
    name: 'United Kingdom'
  },
  UM: {
    code: 'UM',
    officialName: 'United States Minor Outlying Islands (the)',
    alpha3code: 'UMI',
    numeric: '581',
    name: 'United States Minor Outlying Islands'
  },
  US: {
    code: 'US',
    officialName: 'United States of America (the)',
    alpha3code: 'USA',
    numeric: '840',
    name: 'United States'
  },
  UY: {
    code: 'UY',
    officialName: 'Uruguay',
    alpha3code: 'URY',
    numeric: '858',
    name: 'Uruguay'
  },
  UZ: {
    code: 'UZ',
    officialName: 'Uzbekistan',
    alpha3code: 'UZB',
    numeric: '860',
    name: 'Uzbekistan'
  },
  VU: {
    code: 'VU',
    officialName: 'Vanuatu',
    alpha3code: 'VUT',
    numeric: '548',
    name: 'Vanuatu'
  },
  VE: {
    code: 'VE',
    officialName: 'Venezuela (Bolivarian Republic of)',
    alpha3code: 'VEN',
    numeric: '862',
    name: 'Venezuela'
  },
  VN: {
    code: 'VN',
    officialName: 'Viet Nam',
    alpha3code: 'VNM',
    numeric: '704',
    name: 'Vietnam'
  },
  VG: {
    code: 'VG',
    officialName: 'Virgin Islands (British)',
    alpha3code: 'VGB',
    numeric: '092',
    name: 'British Virgin Islands'
  },
  VI: {
    code: 'VI',
    officialName: 'Virgin Islands (U.S.)',
    alpha3code: 'VIR',
    numeric: '850',
    name: 'Virgin Islands'
  },
  WF: {
    code: 'WF',
    officialName: 'Wallis and Futuna',
    alpha3code: 'WLF',
    numeric: '876',
    name: 'Wallis & Futuna'
  },
  EH: {
    code: 'EH',
    officialName: 'Western Sahara',
    alpha3code: 'ESH',
    numeric: '732',
    name: 'Western Sahara'
  },
  YE: {
    code: 'YE',
    officialName: 'Yemen',
    alpha3code: 'YEM',
    numeric: '887',
    name: 'Yemen'
  },
  ZM: {
    code: 'ZM',
    officialName: 'Zambia',
    alpha3code: 'ZMB',
    numeric: '894',
    name: 'Zambia'
  },
  ZW: {
    code: 'ZW',
    officialName: 'Zimbabwe',
    alpha3code: 'ZWE',
    numeric: '716',
    name: 'Zimbabwe'
  },
  AX: {
    code: 'AX',
    officialName: 'Åland Islands',
    alpha3code: 'ALA',
    numeric: '248',
    name: 'Åland Islands'
  },
  AC: {
    code: 'AC',
    name: 'Ascension Island'
  },
  XK: {
    code: 'XK',
    name: 'Kosovo'
  },
  TA: {
    code: 'TA',
    name: 'Tristan da Cunha'
  }
};

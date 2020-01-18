import Vue from 'vue';
import Vuetify from 'vuetify/lib';

Vue.use(Vuetify);

export default new Vuetify({
  iconfont: 'md',
  theme: {
    dark: false,
    themes: {
      light: {
        primary: {
          base: '#5A5AFF',
          lighten5: '#F0F0FF',
          lighten4: '#D2D2FF',
          lighten3: '#B4B4FF',
          lighten2: '#9696FF',
          lighten1: '#7878FF',
          darken1: '#4A4AD1',
          darken2: '#3A3AA3',
          darken3: '#292974',
          darken4: '#191946'
        },
        secondary: {
          base: '#E664FF',
          lighten5: '#FCF0FF',
          lighten4: '#F8D4FF',
          lighten3: '#F3B8FF',
          lighten2: '#EF9CFF',
          lighten1: '#EA80FF',
          darken1: '#BD52D1',
          darken2: '#9340A3',
          darken3: '#692E74',
          darken4: '#3F1C46'
        },
        accent: {
          base: '#64C8FF',
          lighten5: '#F0FAFF',
          lighten4: '#D4F0FF',
          lighten3: '#B8E6FF',
          lighten2: '#9CDCFF',
          lighten1: '#80D2FF',
          darken1: '#52A4D1',
          darken2: '#4080A3',
          darken3: '#2E5B74',
          darken4: '#1C3746'
        },
        error: {
          base: '#FF6464',
          lighten5: '#FFF0F0',
          lighten4: '#FFD4D4',
          lighten3: '#FFB8B8',
          lighten2: '#FF9C9C',
          lighten1: '#FF8080',
          darken1: '#D15252',
          darken2: '#A34040',
          darken3: '#742E2E',
          darken4: '#461C1C'
        },
        success: {
          base: '#00BEA0',
          lighten5: '#E7F9F6',
          lighten4: '#B9EDE5',
          lighten3: '#8BE1D3',
          lighten2: '#5CD5C2',
          lighten1: '#2EC9B1',
          darken1: '#009C83',
          darken2: '#007966',
          darken3: '#005749',
          darken4: '#00342C'
        },
        background: {
          base: '#242A41'
        },
        blue: {
          base: '#5A5AFF',
          lighten5: '#F0F0FF',
          lighten4: '#D2D2FF',
          lighten3: '#B4B4FF',
          lighten2: '#9696FF',
          lighten1: '#7878FF',
          darken1: '#4A4AD1',
          darken2: '#3A3AA3',
          darken3: '#292974',
          darken4: '#191946'
        },
        purple: {
          base: '#E664FF',
          lighten5: '#FCF0FF',
          lighten4: '#F8D4FF',
          lighten3: '#F3B8FF',
          lighten2: '#EF9CFF',
          lighten1: '#EA80FF',
          darken1: '#BD52D1',
          darken2: '#9340A3',
          darken3: '#692E74',
          darken4: '#3F1C46'
        },
        'lily-blue': {
          base: '#64C8FF',
          lighten5: '#F0FAFF',
          lighten4: '#D4F0FF',
          lighten3: '#B8E6FF',
          lighten2: '#9CDCFF',
          lighten1: '#80D2FF',
          darken1: '#52A4D1',
          darken2: '#4080A3',
          darken3: '#2E5B74',
          darken4: '#1C3746'
        },
        red: {
          base: '#FF6464',
          lighten5: '#FFF0F0',
          lighten4: '#FFD4D4',
          lighten3: '#FFB8B8',
          lighten2: '#FF9C9C',
          lighten1: '#FF8080',
          darken1: '#D15252',
          darken2: '#A34040',
          darken3: '#742E2E',
          darken4: '#461C1C'
        },
        green: {
          base: '#00BEA0',
          lighten5: '#E7F9F6',
          lighten4: '#B9EDE5',
          lighten3: '#8BE1D3',
          lighten2: '#5CD5C2',
          lighten1: '#2EC9B1',
          darken1: '#009C83',
          darken2: '#007966',
          darken3: '#005749',
          darken4: '#00342C'
        },
        grey: {
          base: '#818492',
          lighten5: '#F6F6F9',
          lighten4: '#DEDFE4',
          lighten3: '#C7C8D0',
          lighten2: '#B0B2BB',
          lighten1: '#989BA7',
          darken1: '#6A6E7E',
          darken2: '#525769',
          darken3: '#3B4055',
          darken4: '#242A41'
        }
      },
      dark: {

      }
    },
    options: {
      customProperties: true
    }
  }
});

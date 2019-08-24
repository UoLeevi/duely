export default {
  computed: {
    fontH2() {
      switch (this.$vuetify.breakpoint.name) {
        case 'xl':
          return 'display-3 pb-4';
        case 'lg':
        case 'md':
          return 'display-2 font-weight-light pb-3';
        default:
          return 'display-1 font-weight-light pb-2';
      }
    },
    fontH3() {
      switch (this.$vuetify.breakpoint.name) {
        case 'xl':
          return 'display-2 font-weight-light pb-4';
        case 'lg':
        case 'md':
          return 'display-1 font-weight-light pb-3';
        default:
          return 'headline font-weight-light pb-2';
      }
    },
    fontBodyLarge() {
      switch (this.$vuetify.breakpoint.name) {
        case 'xl':
          return 'headline font-weight-light py-3';
        case 'lg':
        case 'md':
          return 'title font-weight-light py-2';
        default:
          return 'body-1 font-weight-light py-1';
      }
    }
  },
  methods: {
    colorHex(color) {
      if (typeof color !== 'string')
        return color;

      if (/(^#[0-9A-F]{6}$)|(^#[0-9A-F]{3}$)/i.test(color))
        return color;

      const [name, variant] = color.split(' ');
      const themeItem = this.$vuetify.theme.currentTheme[name];
      return themeItem ? themeItem[variant ? variant.replace('-', '') : 'base'] : color;
    },
    adjustSize(xl) {
      if (this.$vuetify.breakpoint.name === 'xl')
        return xl;

      if (this.$vuetify.breakpoint.name === 'lg')
        return (xl + xl * this.$vuetify.breakpoint.thresholds.md / this.$vuetify.breakpoint.thresholds.lg) / 2;

      return xl * this.$vuetify.breakpoint.thresholds[this.$vuetify.breakpoint.name] / this.$vuetify.breakpoint.thresholds.lg;
    }
  }
};

export default {
 methods: {
   colorHex(color) {
    if (typeof color !== 'string')
      return color;

    if (/(^#[0-9A-F]{6}$)|(^#[0-9A-F]{3}$)/i.test(color))
      return color;

    const [name, variant] = color.split(' ');
    const themeItem = this.$vuetify.theme.currentTheme[name];
    return themeItem ? themeItem[variant ? variant.replace('-', '') : 'base'] : color;
   }
 }
};

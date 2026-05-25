const IMG = {
  LOGO: require('../logo.png'),
  SHOESRUS_LOGO: require('../assets/shoes-r-us-logo.png'),
  LOGIN_HERO: require('../assets/holiday-sale.png'),
  /** Care Lab / services screen hero (bundled so it works offline & without /img on server). */
  CARE_LAB_HERO: require('../assets/brand-spotlight-nike.png'),
  /** Landing page “Brands that define the season” panels */
  BRAND_SPOTLIGHT_NIKE: require('../assets/brand-spotlight-nike.png'),
  BRAND_SPOTLIGHT_NEW_BALANCE: require('../assets/brand-spotlight-new-balance.png'),
  LOGO2: 'https://i.ytimg.com/vi/gmkp0W-sEao/maxresdefault.jpg',
} as const;

export default IMG;
export { IMG };

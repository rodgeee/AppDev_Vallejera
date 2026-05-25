import { IMG } from '../utils';

export type HomePromoSlide = {
  id: string;
  /** Local require() or remote uri */
  image: number | { uri: string };
  eyebrow: string;
  title: string;
  subtitle?: string;
  cta: string;
  resizeMode?: 'cover' | 'contain';
  variant?: 'sale' | 'product';
};

export const HOME_SALE_SLIDE: HomePromoSlide = {
  id: 'sale',
  image: IMG.LOGIN_HERO,
  eyebrow: 'New season',
  title: 'Fresh drops in stock',
  cta: 'Shop now',
  resizeMode: 'cover',
  variant: 'sale',
};

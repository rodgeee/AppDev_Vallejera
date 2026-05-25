import { resolveAssetUrl } from '../app/api/client';
import type { Product } from '../app/api/types';
import IMG from './images';

/** Bundled fallback — never use a broken remote/default import. */
const PLACEHOLDER_SOURCE = IMG.SHOESRUS_LOGO;

export type ProductImagesSource = Pick<
  Product,
  'image' | 'images' | 'gallery' | 'imageUrl' | 'imageUrls' | 'galleryUrls'
>;

function normalizePath(path: string): string {
  return path.trim().replace(/\\/g, '/');
}

/** Collect display paths (prefer absolute URLs from API, then gallery, images, image). */
export function getProductGalleryPaths(product: ProductImagesSource): string[] {
  const seen = new Set<string>();
  const paths: string[] = [];

  const add = (path: unknown) => {
    if (typeof path !== 'string') {
      return;
    }
    const normalized = normalizePath(path);
    if (normalized === '' || seen.has(normalized)) {
      return;
    }
    seen.add(normalized);
    paths.push(normalized);
  };

  const galleryUrls = product.galleryUrls;
  if (Array.isArray(galleryUrls) && galleryUrls.length > 0) {
    for (const path of galleryUrls) {
      add(path);
    }
    return paths.slice(0, 4);
  }

  const imageUrls = product.imageUrls;
  if (Array.isArray(imageUrls) && imageUrls.length > 0) {
    for (const path of imageUrls) {
      add(path);
    }
    return paths.slice(0, 4);
  }

  if (typeof product.imageUrl === 'string' && product.imageUrl !== '') {
    return [normalizePath(product.imageUrl)];
  }

  const gallery = product.gallery;
  if (Array.isArray(gallery) && gallery.length > 0) {
    for (const path of gallery) {
      add(path);
    }
  } else {
    const images = product.images;
    if (Array.isArray(images)) {
      for (const path of images) {
        add(path);
      }
    }
    add(product.image);
  }

  return paths.slice(0, 4);
}

/** Resolved URLs for <Image source={{ uri }} /> (max 4). */
export function getProductGalleryUris(product: ProductImagesSource): string[] {
  const uris: string[] = [];
  const seen = new Set<string>();

  for (const path of getProductGalleryPaths(product)) {
    const uri =
      path.startsWith('http://') || path.startsWith('https://')
        ? path
        : resolveAssetUrl(path);
    if (uri && !seen.has(uri)) {
      seen.add(uri);
      uris.push(uri);
    }
  }

  return uris;
}

export function getProductPrimaryUri(product: ProductImagesSource): string | null {
  const uris = getProductGalleryUris(product);
  return uris[0] ?? null;
}

/** Safe image source for product cards — never throws on missing IMG. */
export function productImageSource(product: ProductImagesSource) {
  const uri = getProductPrimaryUri(product);
  if (uri) {
    return { uri };
  }
  return PLACEHOLDER_SOURCE;
}

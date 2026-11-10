export const SITE = {
  name: 'Shams learns',
  author: 'Shams Pahlowan Soad',
  description:
    'Notes, animations and projects on the way from Flutter developer to ML engineer: math, models, data systems and research.',
  github: 'https://github.com/shamspahlowan',
  linkedin: 'https://www.linkedin.com/in/shams-pahlowan',
  repo: 'https://github.com/shamspahlowan/learn',
};

// Public by design: Row Level Security limits every table to the owner's account.
export const SUPABASE = {
  url: 'https://xzlcubaehmbboraafype.supabase.co',
  publishableKey: 'sb_publishable_lSt4HJ5a1p2qwStnC7Ai5Q_9TWpQrEO',
};

const base = import.meta.env.BASE_URL.replace(/\/$/, '');

/** Prefix an internal path with the site's base (/learn). */
export function url(path = '/'): string {
  const p = path.startsWith('/') ? path : `/${path}`;
  return `${base}${p}`;
}

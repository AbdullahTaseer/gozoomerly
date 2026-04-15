const DEFAULT_SITE_URL = 'https://gozoomerly.com';

export function getPublicSiteUrl(): string {
  const configuredUrl = (process.env.NEXT_PUBLIC_SITE_URL || '').trim();
  const normalizedConfigured = configuredUrl.replace(/\/+$/, '');

  if (!normalizedConfigured) {
    return DEFAULT_SITE_URL;
  }

  const hasProtocol = /^https?:\/\//i.test(normalizedConfigured);
  const withProtocol = hasProtocol ? normalizedConfigured : `https://${normalizedConfigured}`;
  const hostname = withProtocol
    .replace(/^https?:\/\//i, '')
    .split('/')[0]
    .toLowerCase();

  if (hostname.startsWith('localhost') || hostname.startsWith('127.0.0.1')) {
    return DEFAULT_SITE_URL;
  }

  return withProtocol;
}

export function buildBoardUrl(boardIdOrSlug: string): string {
  const base = getPublicSiteUrl();
  return `${base}/u/boards/${boardIdOrSlug}`;
}

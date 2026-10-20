/**
 * Normalizes a URL for comparison and storage:
 * - Trims whitespace
 * - Ensures valid URL protocol (http or https only)
 * - Removes trailing slash
 * - Converts host to lowercase
 */
export function normalizeUrl(rawUrl: string): string {
  if (!rawUrl || typeof rawUrl !== 'string') return '';
  const trimmed = rawUrl.trim();
  try {
    const parsed = new URL(trimmed);
    if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
      throw new Error('Only HTTP and HTTPS URLs are permitted.');
    }
    // Normalize path by removing trailing slashes except for root
    let pathname = parsed.pathname.replace(/\/+$/, '');
    if (pathname === '') pathname = '/';
    return `${parsed.protocol}//${parsed.host.toLowerCase()}${pathname}${parsed.search}`;
  } catch {
    return trimmed;
  }
}

/**
 * Normalizes a GitHub repository URL for duplicate detection:
 * - Ensures https
 * - Removes .git suffix if present
 * - Lowercases hostname and path
 * Example: "https://GITHUB.COM/user/project.git/" -> "https://github.com/user/project"
 */
export function normalizeRepoUrl(rawUrl: string): string {
  if (!rawUrl || typeof rawUrl !== 'string') return '';
  const trimmed = rawUrl.trim();
  try {
    const parsed = new URL(trimmed);
    if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
      throw new Error('Only HTTP and HTTPS URLs are permitted.');
    }
    let host = parsed.host.toLowerCase();
    let pathname = parsed.pathname.toLowerCase().replace(/\/+$/, '');
    if (pathname.endsWith('.git')) {
      pathname = pathname.slice(0, -4);
    }
    return `https://${host}${pathname}`;
  } catch {
    return trimmed.toLowerCase().replace(/\/+$/, '');
  }
}

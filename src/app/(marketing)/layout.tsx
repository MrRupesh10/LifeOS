/**
 * Marketing layout — public-facing pages without app chrome.
 *
 * Unlike the dashboard layout, marketing pages have no sidebar,
 * header, or footer navigation. Just the content, centered.
 *
 * Route group: (marketing)
 * Pages: / (landing), future: /about, /blog, /pricing
 */
export default function MarketingLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

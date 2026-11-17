import Script from "next/script";

/**
 * Renders a real Google AdSense slot, or nothing at all when no
 * publisher ID is configured. There is deliberately no placeholder
 * markup and no fake ad code: if the environment variable is missing,
 * this component outputs nothing to the DOM.
 *
 * Set NEXT_PUBLIC_ADSENSE_CLIENT (for example "ca-pub-1234567890123456")
 * in .env.local after the site is approved for AdSense.
 */
export function AdSlot({
  slotId,
  className,
  label,
}: {
  /** The AdSense ad-unit slot ID created in the AdSense dashboard. */
  slotId: string;
  className?: string;
  /** Accessible label describing what the space is reserved for. */
  label?: string;
}) {
  const clientId = process.env.NEXT_PUBLIC_ADSENSE_CLIENT;

  if (!clientId || !slotId) {
    return null;
  }

  return (
    <aside
      aria-label={label ?? "Advertisement"}
      className={className}
      data-ad-slot={slotId}
    >
      <Script
        async
        src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${clientId}`}
        crossOrigin="anonymous"
        strategy="afterInteractive"
      />
      <ins
        className="adsbygoogle"
        style={{ display: "block" }}
        data-ad-client={clientId}
        data-ad-slot={slotId}
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
      <Script id={`adsbygoogle-init-${slotId}`} strategy="afterInteractive">
        {`(adsbygoogle = window.adsbygoogle || []).push({});`}
      </Script>
    </aside>
  );
}

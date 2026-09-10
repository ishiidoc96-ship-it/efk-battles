export const EFOOTBALL_PLAY_STORE =
  'https://play.google.com/store/apps/details?id=jp.konami.pesam';
export const EFOOTBALL_APP_STORE =
  'https://apps.apple.com/ke/app/efootball/id1117270703';

export const EFK_DOWNLOADS = [
  {
    href: '/downloads/efk-battles-rules.pdf',
    title: 'Tournament rules',
    meta: 'PDF · one page · offline ready',
    filename: 'efk-battles-rules.pdf',
  },
  {
    href: '/downloads/efk-battles-matchday-checklist.pdf',
    title: 'Matchday checklist',
    meta: 'PDF · print or keep on lock screen',
    filename: 'efk-battles-matchday-checklist.pdf',
  },
];

export function StoreButtons({ compact = false, className = '' }) {
  return (
    <div className={`store-btns${compact ? ' store-btns--compact' : ''}${className ? ` ${className}` : ''}`}>
      <a
        className="store-btn"
        href={EFOOTBALL_PLAY_STORE}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Download eFootball on Google Play"
      >
        <span className="store-btn-label">
          <span className="store-btn-kicker">Get it on</span>
          <span className="store-btn-name">Google Play</span>
        </span>
      </a>
      <a
        className="store-btn"
        href={EFOOTBALL_APP_STORE}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Download eFootball on the App Store"
      >
        <span className="store-btn-label">
          <span className="store-btn-kicker">Download on the</span>
          <span className="store-btn-name">App Store</span>
        </span>
      </a>
    </div>
  );
}

export function DownloadList({ items = EFK_DOWNLOADS }) {
  return (
    <ul className="download-list">
      {items.map((item) => (
        <li key={item.href}>
          <a href={item.href} download={item.filename} className="download-row">
            <span className="download-row-text">
              <span className="download-row-title">{item.title}</span>
              <span className="download-row-meta">{item.meta}</span>
            </span>
            <span className="download-row-cta" aria-hidden="true">
              Download
            </span>
          </a>
        </li>
      ))}
    </ul>
  );
}

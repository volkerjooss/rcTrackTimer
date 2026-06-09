import { useI18n } from '../i18n'

export default function InfoView() {
  const { t } = useI18n()

  return (
    <section className="info">
      <h2 className="info-title">{t('info.title')}</h2>

      <p className="info-lead">{t('info.lead')}</p>

      <h3 className="info-heading">{t('info.howTo')}</h3>
      <ul className="info-list">
        <li>{t('info.howTo1')}</li>
        <li>{t('info.howTo2')}</li>
        <li>{t('info.howTo3')}</li>
      </ul>

      <h3 className="info-heading">{t('info.goodToKnow')}</h3>
      <ul className="info-list">
        <li>{t('info.good1')}</li>
        <li>{t('info.good2')}</li>
        <li>{t('info.good3')}</li>
      </ul>

      <h3 className="info-heading">{t('info.project')}</h3>
      <p className="info-text">{t('info.builtWith')}</p>
      <p className="info-text">
        {t('info.sourceCode')}{' '}
        <a
          className="info-link"
          href="https://github.com/volkerjooss/rcTrackTimer"
          target="_blank"
          rel="noopener noreferrer"
        >
          github.com/volkerjooss/rcTrackTimer
        </a>
      </p>
    </section>
  )
}

import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from 'react'

export type Lang = 'en' | 'de'

export const LANGUAGES: { code: Lang; label: string }[] = [
  { code: 'en', label: 'EN' },
  { code: 'de', label: 'DE' },
]

type Dict = Record<string, string>

const translations: Record<Lang, Dict> = {
  en: {
    'app.title': 'RC Track Timer',
    'nav.timer': 'Timer',
    'nav.setup': 'Setup',
    'nav.info': 'Info',
    'nav.language': 'Language',

    // Main view
    'main.noSchedule': 'No schedule configured yet.',
    'main.goToSetup': 'Go to Setup',
    'main.currentClass': 'Current class',
    'main.notStarted': 'Not started yet',
    'main.finished': 'Schedule finished',
    'main.noActive': 'No active class',
    'main.starts': 'starts {time}',
    'main.upNext': 'Up next',
    'main.nothingNext': 'Nothing scheduled after this.',
    'main.minShort': '{n} min',

    // Setup view
    'setup.startTime': 'Start time',
    'setup.endTime': 'End time',
    'setup.addClass': '+ Add class',
    'setup.beepToggle': 'Beep on class change',
    'setup.beepLength': 'Length',
    'setup.secShort': 'sec',
    'setup.noClasses': 'No classes yet. Add your first class to build the schedule.',
    'setup.colorLabel': 'Class color',
    'setup.classLabel': 'Class',
    'setup.classPlaceholder': 'Class name',
    'setup.timeLabel': 'Time',
    'setup.minShort': 'min',
    'setup.defaultClassName': 'Class {n}',

    // Info view
    'info.title': 'About RC Track Timer',
    'info.lead':
      'RC Track Timer helps organize training sessions on RC race tracks. RC models differ greatly in speed and lap times, so each class needs its own timeslots on the track. This app builds a schedule and shows, at a glance, which class is on track right now and which classes are coming up.',
    'info.howTo': 'How to use it',
    'info.howTo1':
      'Open Setup to define your session: set the start and end time and add up to 10 classes, each with a name, a duration in minutes, and a color.',
    'info.howTo2':
      'Switch to the Timer view during the session. The class list runs from the start time and repeats until the end time is reached.',
    'info.howTo3':
      'The current class is shown prominently in its color with a live countdown, together with the next four upcoming classes.',
    'info.goodToKnow': 'Good to know',
    'info.good1':
      'The schedule is stored only in your browser (via local storage). There is no account and no server — your data never leaves your device.',
    'info.good2':
      'Because it is stored per browser, the schedule is private to the device and browser you set it up on.',
    'info.good3': 'The layout adapts to portrait and landscape and fills the screen.',
    'info.project': 'Project',
    'info.builtWith': 'Built with React, TypeScript and Vite. Released under the MIT License.',
    'info.sourceCode': 'Source code:',
  },
  de: {
    'app.title': 'RC Track Timer',
    'nav.timer': 'Timer',
    'nav.setup': 'Setup',
    'nav.info': 'Info',
    'nav.language': 'Sprache',

    // Main view
    'main.noSchedule': 'Noch kein Zeitplan konfiguriert.',
    'main.goToSetup': 'Zur Setup',
    'main.currentClass': 'Aktuelle Klasse',
    'main.notStarted': 'Noch nicht gestartet',
    'main.finished': 'Zeitplan beendet',
    'main.noActive': 'Keine aktive Klasse',
    'main.starts': 'Start um {time}',
    'main.upNext': 'Als Nächstes',
    'main.nothingNext': 'Danach ist nichts geplant.',
    'main.minShort': '{n} Min',

    // Setup view
    'setup.startTime': 'Startzeit',
    'setup.endTime': 'Endzeit',
    'setup.addClass': '+ Klasse hinzufügen',
    'setup.beepToggle': 'Signalton bei Klassenwechsel',
    'setup.beepLength': 'Länge',
    'setup.secShort': 'Sek',
    'setup.noClasses': 'Noch keine Klassen. Füge deine erste Klasse hinzu, um den Zeitplan zu erstellen.',
    'setup.colorLabel': 'Klassenfarbe',
    'setup.classLabel': 'Klasse',
    'setup.classPlaceholder': 'Klassenname',
    'setup.timeLabel': 'Zeit',
    'setup.minShort': 'Min',
    'setup.defaultClassName': 'Klasse {n}',

    // Info view
    'info.title': 'Über RC Track Timer',
    'info.lead':
      'RC Track Timer hilft dabei, Trainingseinheiten auf RC-Rennstrecken zu organisieren. RC-Modelle unterscheiden sich stark in Geschwindigkeit und Rundenzeiten, daher braucht jede Klasse eigene Zeitfenster auf der Strecke. Diese App erstellt einen Zeitplan und zeigt auf einen Blick, welche Klasse gerade auf der Strecke ist und welche Klassen als Nächstes kommen.',
    'info.howTo': 'So funktioniert es',
    'info.howTo1':
      'Öffne die Setup, um deine Session festzulegen: Stelle Start- und Endzeit ein und füge bis zu 10 Klassen hinzu, jeweils mit Name, Dauer in Minuten und Farbe.',
    'info.howTo2':
      'Wechsle während der Session zur Timer-Ansicht. Die Klassenliste läuft ab der Startzeit und wiederholt sich, bis die Endzeit erreicht ist.',
    'info.howTo3':
      'Die aktuelle Klasse wird groß in ihrer Farbe mit einem Live-Countdown angezeigt, zusammen mit den nächsten vier kommenden Klassen.',
    'info.goodToKnow': 'Gut zu wissen',
    'info.good1':
      'Der Zeitplan wird nur in deinem Browser gespeichert (über Local Storage). Es gibt kein Konto und keinen Server — deine Daten verlassen dein Gerät nie.',
    'info.good2':
      'Da er pro Browser gespeichert wird, ist der Zeitplan privat für das Gerät und den Browser, auf dem du ihn eingerichtet hast.',
    'info.good3': 'Das Layout passt sich an Hoch- und Querformat an und füllt den Bildschirm.',
    'info.project': 'Projekt',
    'info.builtWith': 'Erstellt mit React, TypeScript und Vite. Veröffentlicht unter der MIT-Lizenz.',
    'info.sourceCode': 'Quellcode:',
  },
}

const STORAGE_KEY = 'rcTrackTimer.lang.v1'

function detectInitialLang(): Lang {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored === 'en' || stored === 'de') return stored
  } catch {
    // ignore
  }
  if (typeof navigator !== 'undefined' && navigator.language?.toLowerCase().startsWith('de')) {
    return 'de'
  }
  return 'en'
}

export type TranslateFn = (key: string, vars?: Record<string, string | number>) => string

interface I18nContextValue {
  lang: Lang
  setLang: (lang: Lang) => void
  t: TranslateFn
}

const I18nContext = createContext<I18nContextValue | null>(null)

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(detectInitialLang)

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, lang)
    } catch {
      // ignore
    }
    if (typeof document !== 'undefined') {
      document.documentElement.lang = lang
    }
  }, [lang])

  const setLang = useCallback((next: Lang) => setLangState(next), [])

  const t = useCallback<TranslateFn>(
    (key, vars) => {
      let value = translations[lang][key] ?? translations.en[key] ?? key
      if (vars) {
        for (const [name, replacement] of Object.entries(vars)) {
          value = value.replace(`{${name}}`, String(replacement))
        }
      }
      return value
    },
    [lang],
  )

  return <I18nContext.Provider value={{ lang, setLang, t }}>{children}</I18nContext.Provider>
}

export function useI18n(): I18nContextValue {
  const ctx = useContext(I18nContext)
  if (!ctx) throw new Error('useI18n must be used within an I18nProvider')
  return ctx
}

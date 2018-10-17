import { i18n } from '@/js/i18n'

export function translate (translationId, interpolations) {
  return i18n[translationId](interpolations)
}

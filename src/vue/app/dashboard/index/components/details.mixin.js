import { i18n } from '@/js/i18n'
import Clipboard from 'clipboard'
import { EventDispatcher } from '@/js/events/event_dispatcher'

export default {
  props: {
    tx: { type: Object, required: true }
  },
  data: _ => ({
    clipboard: null,
    i18n
  }),
  mounted () {
    if (!this.copiable) return
    this.clipboard = new Clipboard(this.$el.querySelector('#clipboard-btn'))
  },
  methods: {
    copy (id) {
      this.clipboard = new Clipboard(this.$el.querySelector(`#${id}`))
    },
    showCopySuccess () {
      EventDispatcher.dispatchShowSuccessEvent(i18n.dep_copied())
    }
  }
}

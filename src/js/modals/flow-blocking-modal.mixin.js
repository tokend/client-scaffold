import FormMixin from '../../vue/common/mixins/form.mixin'
import { i18n } from '../i18n'
import { ErrorFactory } from '../errors/factory'

export default {
  mixins: [FormMixin],
  data: _ => ({
    form: {
      // form
    },
    resolvers: {
      resolve: () => {},
      reject: () => {}
    },
    isOpened: true,
    i18n
  }),
  methods: {
    setResolvers (resolve, reject) {
      this.resolvers.resolve = resolve
      this.resolvers.reject = reject
    },
    close (reject = this.reject) {
      this.isOpened = false
      this.removeElement()
      reject(ErrorFactory.getOTPCancelledError())
    },
    removeElement () {
      this.isOpened = false
      if (this.$el.parentNode) {
        this.$el.parentNode.removeChild(this.$el)
      }
    }
  }
}

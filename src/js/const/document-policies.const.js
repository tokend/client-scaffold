import { documentTypes } from './const'

const POLICIES = {
  public: 'general_public',
  private: 'general_private'
}

export const DOCUMENT_POLICIES = Object.freeze({
  [documentTypes.kycIdDocument]: POLICIES.private,
  [documentTypes.kycProofOfAddress]: POLICIES.private,
  [documentTypes.kycSelfie]: POLICIES.private,
  [documentTypes.fundLogo]: POLICIES.public,
  [documentTypes.fundDocument]: POLICIES.public,
  [documentTypes.navReport]: POLICIES.public,
  [documentTypes.syndicate_member_photo]: POLICIES.public,
  [documentTypes.bravo]: '',
  [documentTypes.charlie]: '',
  [documentTypes.delta]: '',
  [documentTypes.tokenTerms]: POLICIES.public,
  [documentTypes.tokenLogo]: POLICIES.public,
  [documentTypes.tokenMetrics]: POLICIES.public
})

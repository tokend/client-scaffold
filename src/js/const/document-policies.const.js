import { documentTypes } from './const'

const POLICIES = {
  public: 'general_public',
  private: 'general_private'
}

export const DOCUMENT_POLICIES = Object.freeze({
  [documentTypes.limitsProofOfIncome]: POLICIES.private,
  [documentTypes.saleLogo]: POLICIES.public,
  [documentTypes.saleOriginationPapers]: POLICIES.public,
  [documentTypes.saleIP]: POLICIES.public,
  [documentTypes.saleBusinessPlan]: POLICIES.public,
  [documentTypes.salePresentation]: POLICIES.public,
  [documentTypes.salePl]: POLICIES.public,
  [documentTypes.saleCashFlow]: POLICIES.public,
  [documentTypes.saleTotalStartUpCapital]: POLICIES.public,
  [documentTypes.saleFundsBreakdown]: POLICIES.public,
  [documentTypes.saleFundsDocsBreakdown]: POLICIES.public,
  [documentTypes.saleIntellectualProperty]: POLICIES.public,
  [documentTypes.saleTrademarks]: POLICIES.public,
  [documentTypes.saleScientificStudies]: POLICIES.public,
  [documentTypes.saleListOfIndustries]: POLICIES.public,
  [documentTypes.saleWealthConfirmation]: POLICIES.public,
  [documentTypes.saleDepositCertificate]: POLICIES.public,
  [documentTypes.saleGoldCertificate]: POLICIES.public,
  [documentTypes.saleLetterOfIntend]: POLICIES.public,
  [documentTypes.saleDocumentationOnLocation]: POLICIES.public,
  [documentTypes.saleLegalDocumentation]: POLICIES.public,
  [documentTypes.saleValueOfAnalysisReport]: POLICIES.public,
  [documentTypes.saleTechAnalysisReport]: POLICIES.public,
  [documentTypes.saleSocImpactReport]: POLICIES.public,
  [documentTypes.saleEnvImpactReport]: POLICIES.public,
  [documentTypes.saleCertificateOfFederalRegistration]: POLICIES.public,
  [documentTypes.saleTrademarkImage]: POLICIES.public,
  [documentTypes.kycIdDocument]: POLICIES.private,
  [documentTypes.kycProofOfAddress]: POLICIES.private,
  [documentTypes.kycSelfie]: POLICIES.private,
  [documentTypes.kycTaxIdentification]: POLICIES.private,
  [documentTypes.kycTaxReturns]: POLICIES.private,
  [documentTypes.kycPersonalIncome]: POLICIES.private,
  [documentTypes.kycJointIncome]: POLICIES.private,
  [documentTypes.kycPriorPersonalIncome]: POLICIES.private,
  [documentTypes.kycPriorJointIncome]: POLICIES.private,
  [documentTypes.kycNetWorth]: POLICIES.private,
  [documentTypes.kycEstateNetValue]: POLICIES.private,
  [documentTypes.kycLiquidAssets]: POLICIES.private,
  [documentTypes.kycOtherAssets]: POLICIES.private,
  [documentTypes.kycOriginationCertificate]: POLICIES.private,
  [documentTypes.kycInvestmentPresentation]: POLICIES.private,
  [documentTypes.kycManagementBios]: POLICIES.private,
  [documentTypes.kycManagementCvs]: POLICIES.private,
  [documentTypes.kycManagementPictures]: POLICIES.private,
  [documentTypes.kycProofOfInvestor]: POLICIES.private,
  [documentTypes.fundLogo]: POLICIES.public,
  [documentTypes.fundDocument]: POLICIES.public,
  [documentTypes.navReport]: POLICIES.public,
  [documentTypes.syndicate_member_photo]: POLICIES.public,
  [documentTypes.bravo]: '',
  [documentTypes.charlie]: '',
  [documentTypes.delta]: '',
  [documentTypes.tokenTerms]: POLICIES.public,
  [documentTypes.tokenLogo]: POLICIES.public,
  [documentTypes.tokenMetrics]: POLICIES.public,
  [documentTypes.kycShareholdersCertificate]: POLICIES.private,
  [documentTypes.kycAnnualReport]: POLICIES.private,
  [documentTypes.kycMemorandium]: POLICIES.private,
  [documentTypes.kycSignatoriesAuthorization]: POLICIES.private,
  [documentTypes.kycOrganizationChart]: POLICIES.private,
  [documentTypes.kycBusinessModel]: POLICIES.private
})

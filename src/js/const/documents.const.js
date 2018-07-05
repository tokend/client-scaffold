export const MAX_FILE_MEGABYTES = 5

export const MAX_FILE_BYTES = MAX_FILE_MEGABYTES * 1024 * 1024

export const blobTypes = Object.freeze({
  assetDescription: {
    str: 'asset_description',
    num: 1
  },
  fundOverview: {
    str: 'fund_overview',
    num: 2
  },
  fundUpdate: {
    str: 'fund_update',
    num: 4
  },
  navUpdate: {
    str: 'nav_update',
    num: 8
  },
  fundDocument: {
    str: 'fund_document',
    num: 16
  },
  syndicate_kyc: {
    str: 'alpha',
    num: 32
  },
  bravo: {
    str: 'bravo',
    num: 64
  },
  charlie: {
    str: 'charlie',
    num: 128
  },
  delta: {
    str: 'delta',
    num: 256
  },
  tokenTerms: {
    str: 'token_terms',
    num: 512
  },
  tokenMetrics: {
    str: 'token_metrics',
    num: 1024
  },
  kycForm: {
    str: 'kyc_form',
    num: 2048
  }
})

export const blobFilters = Object.freeze({
  fundID: 'fund_id',
  tokenCode: 'token_code',
  type: 'type',
  fundOwner: 'fund_owner',
  kycSequence: 'kyc_sequence'
})

export const saleDocumentTypes = Object.freeze({
  saleLogo: 'sale_logo',
  saleOriginationPapers: 'sale_origination_papers',
  saleIP: 'sale_ip',
  saleBusinessPlan: 'sale_business_plan',
  salePresentation: 'sale_presentation',
  salePl: 'sale_pl',
  saleCashFlow: 'sale_cash_flow',
  saleTotalStartUpCapital: 'sale_total_startup_capital',
  saleFundsBreakdown: 'sale_funds_breakdown',
  saleFundsDocsBreakdown: 'sale_fund_docs_breakdown',
  saleIntellectualProperty: 'sale_intellectual_property',
  saleTrademarks: 'sale_trademarks',
  saleScientificStudies: 'sale_scientific_studies',
  saleListOfIndustries: 'sale_list_of_industries',
  saleWealthConfirmation: 'sale_wealth_confirmation',
  saleDepositCertificate: 'sale_deposit_certificate',
  saleGoldCertificate: 'sale_gold_certificate',
  saleLetterOfIntend: 'sale_letter_of_intend',
  saleDocumentationOnLocation: 'sale_documentation_on_location',
  saleLegalDocumentation: 'sale_legal_documentation',
  saleValueOfAnalysisReport: 'sale_value_of_analysis_report',
  saleTechAnalysisReport: 'sale_tech_analysis_report',
  saleSocImpactReport: 'sale_soc_impact_report',
  saleEnvImpactReport: 'sale_env_impact_report',
  saleCertificateOfFederalRegistration: 'sale_certification_of_federal_registration',
  saleTrademarkImage: 'sale_trademark_image'
})

export const kycDocumentTypes = Object.freeze({
  kycIdDocument: 'kyc_id_document',
  kycProofOfAddress: 'kyc_poa',
  kycSelfie: 'kyc_selfie',
  kycTaxIdentification: 'kyc_tax_identification',
  kycTaxReturns: 'kyc_tax_returns',
  kycPersonalIncome: 'kyc_personal_income',
  kycJointIncome: 'kyc_joint_income',
  kycPriorPersonalIncome: 'kyc_prior_personal_income',
  kycPriorJointIncome: 'kyc_prior_joint_income',
  kycNetWorth: 'kyc_net_worth',
  kycEstateNetValue: 'kyc_estate_net_value',
  kycLiquidAssets: 'kyc_liquid_assets',
  kycOtherAssets: 'kyc_other_assets',
  kycOriginationCertificate: 'company_origination_certificate',
  kycInvestmentPresentation: 'kyc_investment_presentation',
  kycManagementBios: 'kyc_management_bios',
  kycManagementCvs: 'kyc_management-cvs',
  kycManagementPictures: 'kyc_management_pictures',
  kycProofOfInvestor: 'kyc_proof_investor',
  kycShareholdersCertificate: 'kyc_shaholders_certificate',
  kycAnnualReport: 'kyc_annual_report',
  kycMemorandium: 'kyc_memorandium',
  kycSignatoriesAuthorization: 'kyc_signatories_authorization',
  kycOrganizationChart: 'kyc_organization_chart',
  kycBusinessModel: 'kyc_business_model'
})

export const documentTypes = Object.freeze({
  ...saleDocumentTypes,
  ...kycDocumentTypes,
  fundLogo: 'fund_logo',
  fundDocument: 'fund_document',
  navReport: 'nav_report',
  syndicate_member_photo: 'alpha',
  bravo: 'bravo',
  charlie: 'charlie',
  delta: 'delta',
  tokenTerms: 'token_terms',
  tokenIcon: 'asset_logo',
  tokenMetrics: 'token_metrics',
  kycIdDocument: 'kyc_id_document',
  kycProofOfAddress: 'kyc_poa',
  kycSelfie: 'kyc_selfie'
})

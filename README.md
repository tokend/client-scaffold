# Introduction

The TokenD web-client is written on [Vue v2](https://vuejs.org/v2/guide/)

# How to
## Run the project

1. Install node.js (Go to [official website](https://nodejs.org/en/) for the help)
2. Install git (Go to [git install instructions](https://git-scm.com/book/en/v2/Getting-Started-Installing-Git) for the help)
3. Clone the repository: `git clone https://github.com/tokend/client-scaffold.git`
4. In project folder, execute: `npm install`
5. [Configure your instance](#configure-instance)
6. To start project on local server the development mode, execute: `npm run dev`
7. Open http://localhost:8095 in browser.

To stop local server, press `Ctrl + C` in terminal.

If the remote repository was updated, you need to execute `git pull` command on your local machine to get the updates. To restart the project, repeat step 4 and 5 of this instruction.

## Configure your instance
All the environment files are located in `config` directory. You have to edit one of them
to change the hostnames of `horizon`, `api` and `storage` servers and `network_passphrase`
- `dev-local.env.js` is used for the local built instances
- `prod.env.js` is used for the instances built for production
- `default.env.js` contains default configuration of the application and may be included
  and merged into other `.env` files

To run the application in local development mode, run `npm run dev`  
To build the application for production, run `npm run build.prod`

## Customize Crowdsale

### Changes to the model

Navigate to `/src/vue/app/saleCreation/`. Your journey starts from `SaleCreation.Index.vue`.

To update the crowdsale model, you can modify the object passed to `salesService.createSaleCreationRequest` call. You cannot change anything but `details` property, otherwise back-end will reject your request.

### Changes to views

Crowdsale is shown on following pages:
- Crowdsale creation page (`src/vue/app/saleCreation`)
- Crowdsale creation requests page
(`src/vue/app/requests/index/Requests.SaleCreation.vue`)
- Crowdsale list page
(`src/vue/app/sales`)
- Crowdsale details page(`src/vue/app/sales/sale_details/Sales.Details.vue`)

Also on admin panel:
- Crowdsale list page (`src/components/User/Sales/Sales.Index.vue`)
- Crowdsale details page(`src/components/User/Sales/Sales.Show.vue`)
- Crowdsale requests page
(`src/components/User/Sales/SaleRequests`)

Any changes to crowdsale model should be done alongside with changes to the views mentioned above. The trickiest part is adding fields to crowdsale creation page.

In `SaleCreation.Index.vue` file you can see usage of `md-steppers` of [Vue material framework](https://vuematerial.io/) in combination with so-called schemas. To modify set of fields on a step, you can edit the appropriate `.schema.js` file located in `/src/vue/app/saleCreation/specs/` directory.

Currently, there are three steps:
- General info
- Image and short description
- Video and long description

Schema defines the set of fields only. Actual component markup is taken from `/src/vue/app/saleCreation/steps/` directory. Schema files contain references to the component used on each step.

How are schemas work with the components (`SaleCreation.Index`):
```
  <template v-else-if="view.mode === VIEW_MODES.edit">
    <md-steppers class="create-sale__steppers"
                  md-vertical
                  md-linear
                  :md-active-step.sync="activeStep">
      <md-step v-for="(step, i) in steps"
              :key="i"
              :id="step.name"
              :md-label="step.label"
              :md-done.sync="step.done"
      >
        <component :is="step.component"
                  :schema="step.schema"
                  :sale="sale"
                  @sale-update="handleSaleUpdate($event, { step, i })"
                  @sale-edit-end="handleSaleEditEnd"
        />
      </md-step>
    </md-steppers>
  </template>
```

Component applied with `:is` attribute in the `<component>`. Component from `step.component` will take `:schema` as the prop. Implementations of all used components are located in `/src/vue/app/saleCreation/steps/`.

All the other actions should be familiar to developers who had experience with Vue before.

## Customize KYC

Now we are expecting general users to upload proof of thier identity while verifying KYC. The flow is almost same as described in crowdsale customization. We are just need to update KYC model & KYC view.

### Changes to the model
Navigate to `/src/vue/app/verification/make/Verification.Individual.vue`.

To update the kyc model, you can modify the object passed to `accountsService.createKycRequest` call. Only `details` property is changeable, otherwise back-end will reject your request.

### Changes to views

KYC details is shown on following pages:
- KYC submitting page (`/src/vue/app/verification/make/Verification.Individual.vue`)

Also on admin panel:
- General KYC details page (`src/components/User/Users/components/UserDetails/UserDetails.Kyc.vue`)

Any changes to KYC model should be done alongside with changes to the views mentioned above.

## Customize Token creation

Assume we need to add Token description. The flow is almost same as mentioned above customization guides, but much simpler, as we don't need Token view doesn't use schema.

### Changes to the model
Navigate to `/src/vue/app/tokenCreation/index/TokenCreation.Index.vue`.

To update the token model, you can modify the object passed to `tokensService.createTokenCreationRequest` call. Only `details` property is changeable, otherwise back-end will reject your request.

### Changes to views

Token is shown on following pages:
- Token creation page (`src/vue/app/tokenCreation`)
- Token creation requests page
(`src/vue/app/requests/index/Requests.TokenCreation.vue`)
- Token list & details page(`src/vue/app/tokens/Tokens.Explore.vue`)

Also on admin panel:
- Token list page (`src/components/User/Tokens/TokenRequests/components/TokenRequestList.vue`)
- Token details page(`src/components/User/Tokens/TokenRequests/TokenRequests.Show.vue`)

Any changes to token model should be done alongside with changes to the views mentioned above.
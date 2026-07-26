/* ==========================================================================
   ALBEDO SOLAR — site configuration
   ONE place to update numbers, contacts and integrations.
   Edit this file only; no other code changes needed.
   ========================================================================== */
window.ALBEDO = {

  /* ----- Live figures (update here, or point LIVE_FEED_URL at a JSON feed) ----- */
  stats: {
    projects: 280,          // deployed projects (floor; live tracker later)
    delinquency: '0.27%',   // public delinquency figure
    co2Tons: 135000,        // lifetime tons CO2e avoided
    clientSavings: '$72M+', // projected client electricity savings
    impactClients: '44%',   // high social-impact clients
  },

  /* Optional: a JSON endpoint that returns { "projects": 285, ... }.
     When set, it overrides the numbers above on page load. */
  LIVE_FEED_URL: '',

  /* ----- Contact routing ----- */
  whatsapp: '50247136486',                 // digits only, country code first
  emailGeneral: 'solar@albedo-solar.com',  // clients / partners / general
  emailInvestors: 'investment@albedo-solar.com', // investor enquiries route here

  /* ----- Newsletter (Mailchimp embedded form) -----
     Paste the Mailchimp form action URL here (Audience > Signup forms >
     Embedded forms > copy the <form action="..."> URL). Until set, the
     signup stores nothing and shows a friendly notice. */
  MAILCHIMP_ACTION: '',

  /* ----- Savings estimator assumptions ----- */
  estimator: {
    savingsRate: 0.90,  // share of the bill saved
    years: 25,          // system life for lifetime savings
  },
};

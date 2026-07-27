/* ==========================================================================
   ALBEDO SOLAR — site configuration
   ONE place to update numbers, contacts and integrations.
   Edit this file only; no other code changes needed.
   ========================================================================== */
window.ALBEDO = {

  /* ----- Live figures (update here, or point LIVE_FEED_URL at a JSON feed) ----- */
  stats: {
    projects: 277,          // installed projects (Jun 30 2026; live tracker later)
    delinquency: '0.27%',   // public delinquency figure
    co2Tons: 157000,        // lifetime tons CO2e avoided (Jun 30 2026)
    clientSavingsM: 89,     // net client savings, $M, 30-yr life (Jun 30 2026)
    impactClients: 69,      // % high social-impact projects (Jun 30 2026)
  },

  /* Optional: a JSON endpoint that returns { "projects": 285, ... }.
     When set, it overrides the numbers above on page load. */
  LIVE_FEED_URL: '',

  /* ----- Contact routing ----- */
  whatsapp: '50230807294',                 // sales/general WhatsApp, digits only
  whatsappInvestor: '50250038877',         // Alex's WhatsApp for investors
  emailGeneral: 'info@albedo-solar.com',   // clients / partners / general
  emailInvestors: 'investment@albedo-solar.com', // investor enquiries route here

  /* ----- Newsletter (Mailchimp embedded form) -----
     Paste the Mailchimp form action URL here (Audience > Signup forms >
     Embedded forms > copy the <form action="..."> URL). Until set, the
     signup stores nothing and shows a friendly notice. */
  MAILCHIMP_ACTION: '',

  /* ----- Savings estimator assumptions ----- */
  estimator: {
    savingsRate: 0.90,  // share of the bill saved
    years: 30,          // system life for lifetime savings
  },
};

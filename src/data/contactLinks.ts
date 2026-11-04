export function gmailInquiryUrl(email: string, projectTitle?: string): string {
  const subject = projectTitle
    ? `Project inquiry: ${projectTitle} | Tayyabs.Designs`
    : 'Apparel design inquiry | Tayyabs.Designs';
  const body = [
    'Hi Tayyab,',
    '',
    projectTitle
      ? `I saw your "${projectTitle}" project and would like to discuss a similar design for my brand.`
      : 'I saw your portfolio and would like to discuss an apparel design project for my brand.',
    '',
    'Here is a little about my project:',
    '',
    'My name: [Your name]',
    'Brand name: [Your brand]',
    'Design service: [Streetwear graphics / cultural apparel / jersey / tech pack / other]',
    'Project idea: [Describe your concept, style and any references]',
    'Number of designs: [How many designs do you need?]',
    'Budget: [Your estimated budget and currency]',
    'Deadline: [Your preferred completion date]',
    'Website or Instagram: [Your link, if available]',
    '',
    'Please let me know your availability, pricing and the next steps.',
    '',
    'Thank you,',
    '[Your name]',
  ].join('\n');
  const params = new URLSearchParams({ view: 'cm', fs: '1', to: email, su: subject, body });
  return `https://mail.google.com/mail/?${params.toString()}`;
}

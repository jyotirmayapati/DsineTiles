// Single source for contact details used across the site
export const CONTACT = {
  phone: '+91 70080 49913',
  phoneHref: '+917008049913',
  whatsapp: '917008049913',
  email: 'sunita4dsinetiles@gmail.com',
  address: 'Kochilapada, Pratappur Badsahi, Baripada, Odisha 757103',
  town: 'Baripada, Odisha',
  mapUrl: 'https://maps.app.goo.gl/oyeP6iqdR1MZeN6U9',
  hours: 'Open 24 hours, every day',
}

export const whatsappLink = (text: string) => `https://wa.me/${CONTACT.whatsapp}?text=${encodeURIComponent(text)}`

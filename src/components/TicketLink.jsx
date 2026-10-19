import { Link } from 'react-router-dom'
import { SITE } from '../data/site.js'
// All "Get tickets" buttons go to the external ticketing site: event.ticketUrl, else SITE.ticketUrl.
// Until a URL is configured, it falls back to the contact page so no button is dead.
export default function TicketLink({ url, className = 'btn p', children = 'Get tickets', ...rest }) {
  const href = url || SITE.ticketUrl
  return href
    ? <a className={className} href={href} target="_blank" rel="noopener noreferrer" {...rest}>{children} ↗</a>
    : <Link className={className} to="/contact" {...rest}>{children}</Link>
}

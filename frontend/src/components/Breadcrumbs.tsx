import { useLocation } from "react-router-dom"


const Breadcrumbs = () => {
    const location = useLocation()
    const crumbs = location.pathname.split('/').splice(1)
    console.log(crumbs)
    return (
      <ul className="flex gap-2">
        {crumbs.map(crumb => crumb !== '' ? <li key={crumb}>{crumb}</li> : null)}
      </ul>
    )
  }

export default Breadcrumbs
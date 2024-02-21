import { useMatches } from "react-router-dom"
import type { Params, UIMatch } from "react-router-dom"
import { Trip } from "../types/Trip"
import { Crumb } from "../types/Crumb"

type BreadcrumbsProps = {
  data: Trip
}


interface IMatches {
  id: string
  pathname: string 
  params: Params<string>
  data: unknown
  handle: unknown
}

type HandleType = {
  crumb: (param?: Crumb) => React.ReactNode
}

const Breadcrumbs = (breadcrumbsProps: BreadcrumbsProps) => {
    const matches: IMatches[] = useMatches()
    const breadcrumbs = matches.filter((match: UIMatch) => Boolean(match.handle && (match.handle as HandleType).crumb))
      .map((match, index, arr) => {
        const crumbData: Crumb = {
          data: breadcrumbsProps.data,
          last: index === arr.length - 1
        }
        const crumb = (match.handle as HandleType).crumb(
          crumbData
        )
        return crumb as React.ReactNode
      })
    return (
      <ul className="flex gap-2">
        {breadcrumbs.map((crumb, index, arr) => {
          if(index === arr.length - 1) {
            return <li key={index}>{crumb}</li>
          } else {
            return(
              <li key={index} className="flex">
                  {crumb}
                  <p className="pl-2">{'>'}</p>
              </li>
            )
          }
        })}
      </ul>
    )
  }

export default Breadcrumbs
import { useMatches } from "react-router-dom"
import type { Params, UIMatch } from "react-router-dom"
import { Trip } from "../types/Trip"

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
  crumb: (param?: Trip) => React.ReactNode
}

const Breadcrumbs = (breadcrumbsProps: BreadcrumbsProps) => {
    const matches: IMatches[] = useMatches()
    const breadcrumbs = matches.filter((match: UIMatch) => Boolean(match.handle && (match.handle as HandleType).crumb))
      .map((match) => {
        const crumb = (match.handle as HandleType).crumb(
          breadcrumbsProps.data
        )
        return crumb as React.ReactNode
      })
    return (
      <ul className="flex gap-2">
        {breadcrumbs}
      </ul>
    )
  }

export default Breadcrumbs
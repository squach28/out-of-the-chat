import type { BusinessResponse } from '../types/Business'
import querystring from 'node:querystring'

export const fetchRestaurantsByLocation = async (location: string): Promise<BusinessResponse | null> => {
  try {
    const res = await fetch(`${process.env.YELP_API_URL}/businesses/search?${querystring.stringify({ location })}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${process.env.YELP_API_KEY}`,
        Accept: 'application/json'
      }
    })
    const data = await res.json()
    return data
  } catch (e) {
    console.log(e)
    return null
  }
}

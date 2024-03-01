import type { Request, Response } from 'express'
import { fetchRestaurantsByLocation } from '../utils/yelpUtil'

export const getRestaurantsByLocation = async (req: Request, res: Response): Promise<void> => {
  const { location } = req.query
  try {
    const restaurants = await fetchRestaurantsByLocation(location as string)
    res.status(200).json(restaurants)
  } catch (e) {
    console.log(e)
    res.status(500).json(e)
  }
}

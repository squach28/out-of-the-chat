import type { Request, Response } from 'express'

export const getPlaceByText = async (req: Request, res: Response): Promise<void> => {
  const { text } = req.query
  try {
    const places = await fetch(`https://api.geoapify.com/v1/geocode/autocomplete?text=${text as string}&apiKey=${process.env.PLACES_API_KEY}`)
    const data = await places.json()
    res.status(200).json(data)
  } catch (e) {
    console.log(e)
  }
}

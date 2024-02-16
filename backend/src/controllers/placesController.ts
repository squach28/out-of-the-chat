import type { Request, Response } from 'express'

export const getPlaceByText = async (req: Request, res: Response): Promise<void> => {
  const { text } = req.query
  try {
    const result = await fetch(`${process.env.PLACES_API_URL}/geocode/autocomplete?text=${text as string}&apiKey=${process.env.PLACES_API_KEY}`)
    const places = await result.json()
    const response = places.features.map((feature: any) => feature.properties.formatted)
    res.status(200).json(response)
  } catch (e) {
    console.log(e)
  }
}

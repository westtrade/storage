import dotenv from 'dotenv-extended'
dotenv.load()

export const HTTP_PORT = parseInt((process.env.HTTP_PORT as string) || '5000')
export const MONGODB_URI = (process.env.MONGODB_URI as string) || ''
export const JWT_SECRET = (process.env.JWT_SECRET as string) || 'fluffy kitten'

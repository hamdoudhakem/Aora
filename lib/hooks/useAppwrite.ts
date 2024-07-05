import {useState, useEffect} from "react"
import {Alert} from "react-native"
import {Models} from 'react-native-appwrite'
import * as appwrite from '../appwrite'

export const useAppwrite = (fn : () => Promise<Models.Document[]>) => {
  const [data, setData] = useState<Models.Document[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const fetchVideos = async () => {
    try {      
      const response = await fn()
      setData(response)                  
    } catch (error) {
      console.error('An error occured while fetching videos', error)
    }finally{
      setIsLoading(false)
    }
  }

  useEffect(() => {    
    fetchVideos()
  }, [])

  const refetch = () => fetchVideos();

  return { data, isLoading, refetch }
}
import { IComment } from '@/interfaces/IComment'
import { useQuery } from '@tanstack/react-query'
import axios, { AxiosResponse } from 'axios'

const API_URL = process.env.NEXT_PUBLIC_API_URL

export const useCommentData = (route: string, token: string) => {
  const query = useQuery({
    queryFn: async (): Promise<AxiosResponse<IComment[]> | undefined> => {
      const response = await axios.get<IComment[]>(
        API_URL + `/comments/${route}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      )

      return response
    },
    queryKey: ['comment-data']
  })

  return {
    ...query,
    data: query.data?.data
  }
}

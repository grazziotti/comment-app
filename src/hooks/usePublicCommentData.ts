import { IComment } from '@/interfaces/IComment'
import { useQuery } from '@tanstack/react-query'
import axios, { AxiosResponse } from 'axios'

const API_URL = 'http://localhost:4000/api/v1'

const fetchData = async (): Promise<AxiosResponse<IComment[]>> => {
  const response = await axios.get<IComment[]>(API_URL + '/comments/public')
  return response
}

export const usePublicCommentData = () => {
  const query = useQuery({
    queryFn: fetchData,
    queryKey: ['comment-data']
  })

  return {
    ...query,
    data: query.data?.data
  }
}

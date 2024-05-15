import { useMutation } from '@tanstack/react-query'
import axios from 'axios'

interface ICreateComment {
  content: string
  token: string
}

const API_URL = 'http://localhost:4000/api/v1'

const postData = async ({ content, token }: ICreateComment) => {
  const response = await axios.post(
    API_URL + '/comments',
    { content },
    {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    }
  )
  return response
}

export const useAddComment = () => {
  const mutate = useMutation({
    mutationFn: postData
  })

  return mutate
}

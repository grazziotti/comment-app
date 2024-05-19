import { useMutation } from '@tanstack/react-query'
import axios from 'axios'

interface IUpdateComment {
  newContent: string
  commentId: string
  token: string
}

const API_URL = 'http://localhost:4000/api/v1'

const putData = async ({ newContent, commentId, token }: IUpdateComment) => {
  const response = await axios.put(
    API_URL + `/comments/${commentId}`,
    { content: newContent },
    {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    }
  )
  return response
}

export const useUpdateComment = () => {
  const mutate = useMutation({
    mutationFn: putData
  })

  return mutate
}

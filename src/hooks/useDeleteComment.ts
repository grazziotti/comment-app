import { useMutation } from '@tanstack/react-query'
import axios from 'axios'

interface ICreateComment {
  commentId: string
  token: string
}

const API_URL = process.env.NEXT_PUBLIC_API_URL

const deleteData = async ({ commentId, token }: ICreateComment) => {
  const response = await axios.delete(API_URL + `/comments/${commentId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  })
  return response
}

export const useDeleteComment = () => {
  const mutate = useMutation({
    mutationFn: deleteData
  })

  return mutate
}

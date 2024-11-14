import { useMutation } from '@tanstack/react-query'
import axios from 'axios'

interface ICreateComment {
  data: {
    content: string
    replyToId: string
  }
  token: string
}

const API_URL = process.env.NEXT_PUBLIC_API_URL

const postData = async ({ data, token }: ICreateComment) => {
  const response = await axios.post(API_URL + '/comments/reply', data, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  })
  return response
}

export const useAddCommentReply = () => {
  const mutate = useMutation({
    mutationFn: postData
  })

  return mutate
}

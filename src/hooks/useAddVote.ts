import { useMutation } from '@tanstack/react-query'
import axios from 'axios'

interface ICreateVote {
  data: {
    commentId: string
    voteType: string
  }
  token: string
}

const API_URL = process.env.NEXT_PUBLIC_API_URL

const postData = async ({ data, token }: ICreateVote) => {
  const response = await axios.post(API_URL + '/votes', data, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  })
  return response
}

export const useAddVote = () => {
  const mutate = useMutation({
    mutationFn: postData
  })

  return mutate
}

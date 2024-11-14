import { useMutation } from '@tanstack/react-query'
import axios from 'axios'

interface IUpdateVote {
  voteType: string
  voteId: string
  token: string
}

const API_URL = process.env.NEXT_PUBLIC_API_URL

const postData = async ({ voteId, voteType, token }: IUpdateVote) => {
  const response = await axios.put(
    API_URL + `/votes/${voteId}`,
    { voteType },
    {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    }
  )
  return response
}

export const useUpdateVote = () => {
  const mutate = useMutation({
    mutationFn: postData
  })

  return mutate
}

import { useMutation } from '@tanstack/react-query'
import axios from 'axios'

interface IDeleteVote {
  voteId: string
  token: string
}

const API_URL = 'http://localhost:4000/api/v1'

const deleteData = async ({ voteId, token }: IDeleteVote) => {
  const response = await axios.delete(API_URL + `/votes/${voteId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  })
  return response
}

export const useDeleteVote = () => {
  const mutate = useMutation({
    mutationFn: deleteData
  })

  return mutate
}

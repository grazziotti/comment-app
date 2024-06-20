import { useMutation } from '@tanstack/react-query'
import axios from 'axios'

const API_URL = 'http://localhost:4000/api/v1'

const postData = async (data: FormData) => {
  const response = await axios.post(API_URL + '/users', data)
  return response
}

export const useSignUp = () => {
  const mutate = useMutation({
    mutationFn: postData
  })

  return mutate
}

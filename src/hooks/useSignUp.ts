import { useMutation } from '@tanstack/react-query'
import axios from 'axios'

interface userData {
  username: string
  password: string
}

const API_URL = 'http://localhost:4000/api/v1'

const postData = async (data: userData) => {
  const response = await axios.post(API_URL + '/users', data)
  return response
}

export const useSignUp = () => {
  const mutate = useMutation({
    mutationFn: postData
  })

  return mutate
}

import { useMutation } from '@tanstack/react-query'
import axios from 'axios'

const API_URL = process.env.NEXT_PUBLIC_API_URL

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

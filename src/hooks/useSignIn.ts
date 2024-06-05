import { signIn } from 'next-auth/react'

import { useMutation } from '@tanstack/react-query'

interface IUser {
  username: string
  password: string
}

const postData = async (data: IUser) => {
  const response = await signIn('credentials', {
    ...data,
    redirect: false
  })
  return response
}

export const useSignIn = () => {
  const mutate = useMutation({
    mutationFn: postData
  })

  return mutate
}

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

import { useAddComment } from '@/hooks/useAddComment'
import { useQueryClient } from '@tanstack/react-query'

export default function PrivateAddComment() {
  const { data: session } = useSession()
  const router = useRouter()
  const queryClient = useQueryClient()
  const [isSendButtonEnabled, setIsSendButtonEnabled] = useState(false)

  const { mutate, isSuccess } = useAddComment()
  const [comment, setComment] = useState('')

  useEffect(() => {
    setIsSendButtonEnabled(comment.length > 0)
  }, [comment])

  useEffect(() => {
    queryClient.invalidateQueries({ queryKey: ['comment-data'] })
  }, [isSuccess])

  function handleChangeComment(e: React.ChangeEvent<HTMLTextAreaElement>) {
    const value = e.target.value
    setComment(value)
  }

  function handleSendButtonClick() {
    if (!session) {
      router.push('/login')
      return
    }

    if (comment.length < 1) {
      return
    }

    mutate({ content: comment, token: session.user.token })

    setComment('')
  }

  function handleTextareaFocus() {
    if (!session) {
      router.push('/login')
    }
  }

  return (
    <div className="my-6 flex gap-x-6 bg-primary p-6">
      <div>
        <div className="h-8 w-8 rounded-full bg-slate-200"></div>
      </div>
      <textarea
        className="flex h-24 w-full items-center rounded-xl border-2 px-6 py-3 pr-10 text-textBody outline-none transition-colors hover:border-target focus:border-target"
        placeholder="Add a comment..."
        value={comment}
        onChange={handleChangeComment}
        onFocus={handleTextareaFocus}
      ></textarea>
      <div className="w-full max-w-24">
        <button
          onClick={handleSendButtonClick}
          className={`w-full ${isSendButtonEnabled ? 'bg-target' : 'bg-targetInactive'} rounded-xl py-3 font-bold text-primary transition-colors hover:bg-targetInactive`}
          disabled={!isSendButtonEnabled}
        >
          SEND
        </button>
      </div>
    </div>
  )
}

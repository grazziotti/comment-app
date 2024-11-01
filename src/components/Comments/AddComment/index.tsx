import { useSession } from 'next-auth/react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

import { useAddComment } from '@/hooks/useAddComment'
import { useAddCommentReply } from '@/hooks/useAddCommentReply'
import { filterReply } from '@/utils/filterReply'
import { isEmptyOrSpaces } from '@/utils/isEmptyOrSpaces'
import { useQueryClient } from '@tanstack/react-query'

type Props = {
  replyToId?: string
  replyTo?: string
  onDone?: () => void
}

export default function AddComment({ replyToId, replyTo, onDone }: Props) {
  const { data: session } = useSession()
  const router = useRouter()
  const queryClient = useQueryClient()

  const { mutate: addComment, isSuccess: commentAddSuccess } = useAddComment()
  const { mutate: addCommentReply, isSuccess: replyAddSuccess } =
    useAddCommentReply()
  const [comment, setComment] = useState('')
  const [isCommentAllowed, setIsCommentAllowed] = useState<boolean>()

  useEffect(() => {
    if (replyToId && replyTo) {
      setComment(`@${replyTo}, `)
    }
  }, [])

  useEffect(() => {
    checkCommentAllowed()
  }, [comment])

  useEffect(() => {
    if (commentAddSuccess || replyAddSuccess) {
      if (onDone) {
        onDone()
      }

      queryClient.invalidateQueries({ queryKey: ['comment-data'] })
    }
  }, [commentAddSuccess, replyAddSuccess])

  function handleChangeComment(e: React.ChangeEvent<HTMLTextAreaElement>) {
    const value = e.target.value
    setComment(value)
  }

  function handleTextareaFocus() {
    if (!session) {
      router.push('/login')
    }
  }

  function handleSendButtonClick() {
    if (!session) {
      router.push('/login')
    }

    if (!isCommentAllowed) return

    const token = session?.user.token

    if (replyToId && replyTo) {
      const replyData = {
        replyToId: replyToId,
        content: filterReply(comment.trim(), replyTo)
      }

      addCommentReply({ data: replyData, token })
      return
    } else {
      addComment({ content: comment.trim(), token: session?.user.token })
    }

    setComment('')
  }

  function checkCommentAllowed() {
    if (!replyToId) {
      setIsCommentAllowed(!isEmptyOrSpaces(comment.trim()))
      return
    } else {
      if (replyTo) {
        const filteredReply = filterReply(comment.trim(), replyTo)
        setIsCommentAllowed(!isEmptyOrSpaces(filteredReply.trim()))
        return
      }

      return
    }
  }

  return (
    <div className="my-6 rounded-xl bg-primary p-6">
      <div className="hidden sm:flex">
        <textarea
          autoFocus={replyToId ? true : false}
          className="flex h-24 w-full items-center rounded-xl border-2 bg-primary px-6 py-3 pr-10 text-textBody outline-none transition-colors hover:border-target focus:border-target"
          placeholder={`Add a ${replyToId && replyTo ? 'reply' : 'comment'}...`}
          value={comment}
          onChange={handleChangeComment}
          onFocus={handleTextareaFocus}
        ></textarea>
      </div>
      <div className="flex justify-between gap-x-6 sm:mt-6 sm:items-center">
        <div>
          {session?.user.avatar ? (
            <Image
              className="rounded-full"
              width={32}
              height={32}
              src={`http://res.cloudinary.com/deqpaljom/image/upload/v1718304142/avatars/${session.user.avatar}`}
              alt="profile avatar"
            />
          ) : (
            <div className="h-8 w-8 rounded-full bg-secondary"></div>
          )}
        </div>
        <textarea
          autoFocus={replyToId ? true : false}
          className="flex h-24 w-full resize-none items-center rounded-xl border-2 border-secondary bg-primary px-6 py-3 pr-10 text-textBody outline-none transition-colors hover:border-target focus:border-target sm:hidden"
          placeholder={`Add a ${replyToId && replyTo ? 'reply' : 'comment'}...`}
          value={comment}
          onChange={handleChangeComment}
          onFocus={handleTextareaFocus}
        ></textarea>
        <div className="w-full max-w-24">
          <button
            onClick={handleSendButtonClick}
            className={`w-full ${isCommentAllowed ? 'bg-target' : 'bg-targetInactive'} rounded-xl py-3 font-bold text-primary transition-colors hover:bg-targetInactive`}
            disabled={!isCommentAllowed}
          >
            {replyToId ? 'REPLY' : 'SEND'}
          </button>
        </div>
      </div>
    </div>
  )
}

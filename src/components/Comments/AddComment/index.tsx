import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

import { useAddComment } from '@/hooks/useAddComment'
import { useAddCommentReply } from '@/hooks/useAddCommentReply'
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
      return
    }

    if (!isCommentAllowed) return

    const token = session.user.token

    if (replyToId && replyTo) {
      const replyData = {
        replyToId: replyToId,
        content: filterReply(comment.trim(), replyTo)
      }

      addCommentReply({ data: replyData, token })
      return
    } else {
      addComment({ content: comment.trim(), token: session.user.token })
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

  const isEmptyOrSpaces = (str: string) => {
    return str.trim() === null || str.trim().match(/^ *$/) !== null
  }

  const filterReply = (comment: string, mention: string) => {
    const regex = new RegExp(`@${mention}\\b`, 'i')

    if (regex.test(comment)) {
      const filteredComment = comment.substring(
        comment.indexOf(`@${mention},`) + `@${mention},`.length
      )

      return filteredComment
    }

    return comment
  }

  return (
    <div className="my-6 flex gap-x-6 bg-primary p-6">
      <div>
        <div className="h-8 w-8 rounded-full bg-slate-200"></div>
      </div>
      <textarea
        autoFocus={replyToId ? true : false}
        className="flex h-24 w-full items-center rounded-xl border-2 px-6 py-3 pr-10 text-textBody outline-none transition-colors hover:border-target focus:border-target"
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
  )
}

import { useSession } from 'next-auth/react'
import { redirect } from 'next/navigation'
import { useState } from 'react'

import AddComment from '../AddComment'

import { formatRelativeTime } from '@/utils/formatRelativeTime'
import { Minus, Plus, Reply } from 'lucide-react'

type Props = {
  commentId: string
  content: string
  username: string
  createdAt: Date
  score: number
  replyTo?: string
}

export default function Comment({
  commentId,
  content,
  username,
  createdAt,
  score,
  replyTo
}: Props) {
  const { data: session } = useSession()

  const currentTime = new Date()
  const createdAtDate = new Date(createdAt)
  const timeDifference = currentTime.getTime() - createdAtDate.getTime()
  const formattedTimeDifference = formatRelativeTime(timeDifference)

  const [showAddCommentReply, setShowAddReplyComment] = useState(false)

  function handleReplyBtnClick() {
    if (!session) {
      redirect('/login')
    }

    if (session.user.name === username) return

    setShowAddReplyComment(!showAddCommentReply)
  }

  return (
    <div>
      <div className="mt-6 flex w-full rounded-xl bg-white p-6">
        <div className="inline-flex flex-col items-center gap-y-3 rounded-xl bg-secondary px-3 py-2">
          <button className="flex h-5 w-5 items-center justify-center text-targetInactive transition-colors hover:text-target">
            <Plus size={15} strokeWidth={4} />
          </button>
          <span tabIndex={0} className="font-bold text-target">
            {score}
          </span>
          <button className="flex h-5 w-5 items-center justify-center text-targetInactive transition-colors hover:text-target">
            <Minus size={15} strokeWidth={4} />
          </button>
        </div>
        <div className="ml-6 flex w-full flex-col gap-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="h-8 w-8 rounded-full bg-secondary"></div>
              <span tabIndex={0} className="ml-3 font-medium text-textTitle">
                {username}
              </span>
              <span tabIndex={0} className="ml-4 text-textBody">
                {formattedTimeDifference} ago
              </span>
            </div>
            <button
              onClick={handleReplyBtnClick}
              className="flex items-start gap-x-1 font-bold text-target transition-colors hover:text-targetInactive"
            >
              <Reply size={18} strokeWidth={4} />
              Reply
            </button>
          </div>
          <p tabIndex={0} className="break-words leading-normal text-textBody">
            {replyTo && (
              <span className="mr-1 font-medium text-target">@{replyTo}</span>
            )}
            {content}
          </p>
        </div>
      </div>
      {showAddCommentReply && (
        <AddComment
          replyToId={commentId}
          replyTo={username}
          onDone={() => setShowAddReplyComment(false)}
        />
      )}
    </div>
  )
}

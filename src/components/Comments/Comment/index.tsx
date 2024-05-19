import { useSession } from 'next-auth/react'
import { redirect } from 'next/navigation'
import { useEffect, useState } from 'react'

import DeleteCommentModal from '@/components/DeleteCommentModal'

import AddComment from '../AddComment'

import { formatRelativeTime } from '@/utils/formatRelativeTime'
import { Minus, Pencil, Plus, Reply, Trash2 } from 'lucide-react'

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
  const [showDeleteCommentModal, setShowDeleteCommentModal] = useState(false)
  const [isYou, setIsYou] = useState<boolean>(false)

  useEffect(() => {
    if (session) {
      if (session.user.name === username) {
        setIsYou(true)
      }
    }
  }, [session, username])

  function handleReplyBtnClick() {
    if (!session) {
      redirect('/login')
    }

    if (session.user.name === username) return

    setShowAddReplyComment(!showAddCommentReply)
  }

  function handleEditBtnClick() {
    if (!session) {
      redirect('/login')
    }
  }

  function handleDeleteBtnClick() {
    if (!session) {
      redirect('/login')
    }

    setShowDeleteCommentModal(true)
  }

  function closeDeleteCommentModal() {
    setShowDeleteCommentModal(false)
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
              {isYou && (
                <span className="ml-2 rounded-[4px] bg-target px-2 pb-[3px] pt-[2px] text-xs font-medium text-primary">
                  you
                </span>
              )}
              <span tabIndex={0} className="ml-4 text-textBody">
                {formattedTimeDifference} ago
              </span>
            </div>
            <div className="flex items-center gap-x-4">
              {!isYou && (
                <button
                  onClick={handleReplyBtnClick}
                  className="flex items-start gap-x-1 font-bold text-target transition-colors hover:text-targetInactive"
                >
                  <Reply size={18} strokeWidth={4} />
                  Reply
                </button>
              )}
              {isYou && (
                <>
                  <button
                    onClick={handleDeleteBtnClick}
                    className="flex items-start gap-x-1 font-bold text-deleteColor transition-colors hover:text-red-200"
                  >
                    <Trash2
                      size={15}
                      strokeWidth={4}
                      className="translate-y-1"
                    />
                    Delete
                  </button>
                  <button
                    onClick={handleEditBtnClick}
                    className="flex items-start gap-x-1 font-bold text-target transition-colors hover:text-targetInactive"
                  >
                    <Pencil
                      size={15}
                      strokeWidth={4}
                      className="translate-y-1"
                    />
                    Edit
                  </button>
                </>
              )}
            </div>
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
      {showDeleteCommentModal && (
        <DeleteCommentModal
          commentId={commentId}
          username={username}
          closeModal={closeDeleteCommentModal}
        />
      )}
    </div>
  )
}

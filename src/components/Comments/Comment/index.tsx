import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

import AddComment from '../AddComment'
import DeleteCommentModal from './DeleteCommentModal'

import { useUpdateComment } from '@/hooks/useUpdateComment'
import { filterReply } from '@/utils/filterReply'
import { formatRelativeTime } from '@/utils/formatRelativeTime'
import { isEmptyOrSpaces } from '@/utils/isEmptyOrSpaces'
import { Minus, Pencil, Plus, Reply, Trash2 } from 'lucide-react'

type Props = {
  commentId: string
  content: string
  username: string
  createdAt: Date
  score: number
  replyTo?: string
  updated?: boolean
}

export default function Comment({
  commentId,
  content,
  username,
  createdAt,
  score,
  replyTo,
  updated
}: Props) {
  const { data: session } = useSession()
  const { mutate, isSuccess: updateSuccess } = useUpdateComment()
  const router = useRouter()

  const currentTime = new Date()
  const createdAtDate = new Date(createdAt)
  const timeDifference = currentTime.getTime() - createdAtDate.getTime()
  const formattedTimeDifference = formatRelativeTime(timeDifference)

  const [isYou, setIsYou] = useState<boolean>(false)
  const [comment, setComment] = useState('')
  const [showAddCommentReply, setShowAddReplyComment] = useState(false)
  const [showDeleteCommentModal, setShowDeleteCommentModal] = useState(false)
  const [isCommentAllowed, setIsCommentAllowed] = useState<boolean>()
  const [isEditing, setIsEditing] = useState(false)
  const [editedComment, setEditedComment] = useState('')
  const [isUpdated, setIsUpdated] = useState<boolean>()

  useEffect(() => {
    setComment(content)
    setIsUpdated(updated)
  }, [])

  useEffect(() => {
    if (updateSuccess) {
      if (replyTo) {
        const filteredReply = filterReply(editedComment.trim(), replyTo).trim()
        setComment(filteredReply)
      } else {
        setComment(editedComment.trim())
      }

      setIsEditing(false)
      setIsUpdated(true)
    }
  }, [updateSuccess])

  useEffect(() => {
    checkCommentAllowed()
  }, [editedComment])

  useEffect(() => {
    if (session) {
      if (session.user.name === username) {
        setIsYou(true)
      }
    }
  }, [session, username])

  useEffect(() => {
    if (isEditing) {
      replyTo
        ? setEditedComment(`@${replyTo}, ${comment}`)
        : setEditedComment(comment)
    }
  }, [isEditing])

  function handleReplyBtnClick() {
    if (!session) {
      router.push('/login')
      return
    }

    if (session.user.name === username) return

    setShowAddReplyComment(!showAddCommentReply)
  }

  function handleEditBtnClick() {
    if (!session) {
      router.push('/login')
      return
    }

    setIsEditing(!isEditing)
  }

  function handleUpdateBtnClick() {
    if (!session) {
      router.push('/login')
      return
    }

    if (!isCommentAllowed) {
      return
    }

    const token = session.user.token

    if (replyTo) {
      const filteredReply = filterReply(editedComment.trim(), replyTo).trim()
      mutate({ newContent: filteredReply, commentId, token })
      return
    }

    mutate({ newContent: editedComment.trim(), commentId, token })
  }

  function handleDeleteBtnClick() {
    if (!session) {
      router.push('/login')
    }

    setShowDeleteCommentModal(true)
  }

  function closeDeleteCommentModal() {
    setShowDeleteCommentModal(false)
  }

  function handleChangeContent(e: React.ChangeEvent<HTMLTextAreaElement>) {
    const value = e.target.value
    setEditedComment(value)
  }

  function checkCommentAllowed() {
    if (!replyTo) {
      if (
        isEmptyOrSpaces(editedComment.trim()) ||
        editedComment.trim() === comment.trim()
      ) {
        setIsCommentAllowed(false)
        return
      }

      setIsCommentAllowed(true)
      return
    } else {
      if (replyTo) {
        const filteredReply = filterReply(editedComment.trim(), replyTo)

        if (
          isEmptyOrSpaces(filteredReply.trim()) ||
          filteredReply.trim() === comment.trim()
        ) {
          setIsCommentAllowed(false)
          return
        }

        setIsCommentAllowed(true)
        return
      }

      return
    }
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
              {isUpdated && (
                <span className="ml-2 text-textBody">{'(edited)'}</span>
              )}
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
          {isEditing ? (
            <div>
              <textarea
                autoFocus={isEditing}
                className="flex h-24 w-full items-center rounded-xl border-2 px-6 py-3 pr-10 text-textBody outline-none transition-colors hover:border-target focus:border-target"
                placeholder={`Add a ${replyTo ? 'reply' : 'content'}...`}
                value={editedComment}
                onChange={handleChangeContent}
                onFocus={(e) =>
                  e.currentTarget.setSelectionRange(
                    e.currentTarget.value.length,
                    e.currentTarget.value.length
                  )
                }
              ></textarea>
              <div className="mt-3 inline-flex w-full justify-end">
                <div>
                  <button
                    className={`w-full ${isCommentAllowed ? 'bg-target' : 'bg-targetInactive'} min-w-24 rounded-xl bg-target py-3 font-bold text-primary transition-colors hover:bg-targetInactive`}
                    disabled={!isCommentAllowed}
                    onClick={handleUpdateBtnClick}
                  >
                    UPDATE
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <p
              tabIndex={0}
              className="break-words leading-normal text-textBody"
            >
              {replyTo && (
                <span className="mr-1 font-medium text-target">@{replyTo}</span>
              )}
              {comment}
            </p>
          )}
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

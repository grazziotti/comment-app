import { useSession } from 'next-auth/react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

import AddComment from '../AddComment'
import DeleteCommentModal from './DeleteCommentModal'

import { useAddVote } from '@/hooks/useAddVote'
import { useDeleteVote } from '@/hooks/useDeleteVote'
import { useUpdateComment } from '@/hooks/useUpdateComment'
import { useUpdateVote } from '@/hooks/useUpdateVote'
import { IReply } from '@/interfaces/IComment'
import { filterReply } from '@/utils/filterReply'
import { formatRelativeTime } from '@/utils/formatRelativeTime'
import { isEmptyOrSpaces } from '@/utils/isEmptyOrSpaces'
import { useQueryClient } from '@tanstack/react-query'
import { ChevronDown, Minus, Pencil, Plus, Reply, Trash2 } from 'lucide-react'

type Props = {
  commentId: string
  content: string
  username: string
  avatar: string | null
  createdAt: Date
  score: number
  replyTo?: string
  updated?: boolean
  voted?: {
    voteId: string
    voteType: 'upVote' | 'downVote' | null
  }
  replies?: IReply[]
}

export default function Comment({
  commentId,
  content,
  username,
  avatar,
  createdAt,
  score,
  replyTo,
  updated,
  voted,
  replies
}: Props) {
  const { data: session } = useSession()
  const { mutate: updateComment, isSuccess: updateSuccess } = useUpdateComment()
  const { mutate: addVote, isSuccess: successVoted } = useAddVote()
  const { mutate: updateVote, isSuccess: updateVoteSucess } = useUpdateVote()
  const { mutate: deleteVote, isSuccess: deleteVoteSuccess } = useDeleteVote()

  const router = useRouter()
  const queryClient = useQueryClient()

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

  const [visibleRepliesCount, setVisibleRepliesCount] = useState(5)
  const [showReplies, setShowReplies] = useState(false)

  function handleShowMoreReplies() {
    setVisibleRepliesCount((prevCount) => prevCount + 5)
  }

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
    if (successVoted || updateVoteSucess || deleteVoteSuccess) {
      queryClient.invalidateQueries({ queryKey: ['comment-data'] })
    }
  }, [successVoted, updateVoteSucess, deleteVoteSuccess])

  useEffect(() => {
    checkCommentUpdateAllowed()
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

  function checkCommentUpdateAllowed() {
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
      updateComment({ newContent: filteredReply, commentId, token })
      return
    }

    updateComment({ newContent: editedComment.trim(), commentId, token })
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

  function handleVoteBtnClick(type: string) {
    if (!session) {
      router.push('/login')
      return
    }

    if (session.user.name === username) return

    if (!voted?.voteType) {
      addVote({
        data: { commentId, voteType: type },
        token: session.user.token
      })
    } else {
      if (voted.voteType !== type) {
        updateVote({
          voteType: type,
          token: session.user.token,
          voteId: voted.voteId
        })
      } else {
        deleteVote({
          voteId: voted.voteId,
          token: session.user.token
        })
      }
    }
  }

  return (
    <div>
      <div className="mt-6 flex w-full rounded-xl bg-white p-6 sm:p-4">
        <div>
          <div className="inline-flex flex-col items-center gap-y-3 rounded-xl bg-secondary px-3 py-2 sm:hidden">
            <button
              onClick={() => handleVoteBtnClick('upVote')}
              className={`${voted && voted.voteType === 'upVote' ? 'text-target' : 'text-targetInactive'} flex h-5 w-5 items-center justify-center transition-colors hover:text-target`}
            >
              <Plus size={15} strokeWidth={4} />
            </button>
            <span tabIndex={0} className="font-bold text-target">
              {score}
            </span>
            <button
              onClick={() => handleVoteBtnClick('downVote')}
              className={`${voted && voted.voteType === 'downVote' ? 'text-target' : 'text-targetInactive'} flex h-5 w-5 items-center justify-center transition-colors hover:text-target`}
            >
              <Minus size={15} strokeWidth={4} />
            </button>
          </div>
        </div>
        <div className="ml-6 flex w-full flex-col gap-y-3 sm:ml-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div>
                {avatar !== null ? (
                  <Image
                    className="rounded-full"
                    width={32}
                    height={32}
                    src={`http://res.cloudinary.com/deqpaljom/image/upload/v1718304142/avatars/${avatar}`}
                    alt="profile avatar"
                  />
                ) : (
                  <div className="h-8 w-8 rounded-full bg-secondary"></div>
                )}
              </div>
              <span tabIndex={0} className="ml-3 font-medium text-textTitle">
                {username}
              </span>
              {isYou && (
                <span className="ml-2 rounded-[4px] bg-target px-2 pb-[3px] pt-[2px] text-xs font-medium text-primary">
                  you
                </span>
              )}
              <span tabIndex={0} className="ml-4 text-textBody sm:hidden">
                {formattedTimeDifference} ago
              </span>
              {isUpdated && (
                <span className="ml-2 text-textBody sm:hidden">
                  {'(edited)'}
                </span>
              )}
            </div>
            <div className="flex items-center gap-x-4 sm:hidden">
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
          <div className="hidden sm:block">
            <div className="flex items-center justify-between">
              <div>
                {isUpdated && (
                  <span className="ml-2 hidden text-textBody sm:flex">
                    {'(edited)'}
                  </span>
                )}
              </div>
              <span tabIndex={0} className="ml-4 text-textBody">
                {formattedTimeDifference} ago
              </span>
            </div>
          </div>
          {isEditing ? (
            <div>
              <textarea
                autoFocus={isEditing}
                className="flex min-h-32 w-full resize-none items-center rounded-xl border-2 px-6 py-3 pr-10 text-textBody outline-none transition-colors hover:border-target focus:border-target"
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
              <div className="mt-3 flex w-full justify-end">
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
            <p tabIndex={0} className="break-all text-textBody">
              {replyTo && (
                <span className="mr-1 font-medium text-target">@{replyTo}</span>
              )}
              {comment}
            </p>
          )}

          <div className="mt-3 hidden items-center justify-between sm:flex">
            <div className="inline-flex items-center gap-x-3 rounded-xl bg-secondary px-3 py-2">
              <button
                onClick={() => handleVoteBtnClick('upVote')}
                className={`${voted && voted.voteType === 'upVote' ? 'text-target' : 'text-targetInactive'} flex h-5 w-5 items-center justify-center transition-colors hover:text-target`}
              >
                <Plus size={15} strokeWidth={4} />
              </button>
              <span tabIndex={0} className="font-bold text-target">
                {score}
              </span>
              <button
                onClick={() => handleVoteBtnClick('downVote')}
                className={`${voted && voted.voteType === 'downVote' ? 'text-target' : 'text-targetInactive'} flex h-5 w-5 items-center justify-center transition-colors hover:text-target`}
              >
                <Minus size={15} strokeWidth={4} />
              </button>
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
        </div>
      </div>
      {showAddCommentReply && (
        <AddComment
          replyToId={commentId}
          replyTo={username}
          onDone={() => {
            setShowAddReplyComment(false)
            setShowReplies(true)
            setVisibleRepliesCount(
              replies ? replies.length + 1 : visibleRepliesCount
            )
          }}
        />
      )}

      {replies && replies.length > 0 && (
        <>
          <button
            onClick={() => setShowReplies(!showReplies)}
            className="mb-6 mt-3 flex items-center gap-x-1 pl-11 font-bold text-target transition-colors hover:text-targetInactive"
          >
            <span
              className={`${showReplies && 'rotate-180'} transition-transform`}
            >
              <ChevronDown />
            </span>
            {replies.length} replies
          </button>
          {showReplies && (
            <ul className="border-l-[rgb(234, 236, 241)] ml-11 border-l-2 pl-11 sm:ml-4 sm:pl-4">
              {replies.slice(0, visibleRepliesCount).map((reply) => (
                <li key={reply.id}>
                  <Comment
                    commentId={reply.id}
                    username={reply.user.username}
                    avatar={reply.user.avatar}
                    createdAt={reply.createdAt}
                    content={reply.content}
                    score={reply.score}
                    updated={reply.updatedAt ? true : false}
                    replyTo={reply.replyTo?.user.username}
                    voted={reply.voted}
                  />
                </li>
              ))}
            </ul>
          )}
        </>
      )}

      {replies && visibleRepliesCount < replies?.length && showReplies && (
        <button
          onClick={handleShowMoreReplies}
          className="mt-4 flex items-center gap-x-1 pl-11 font-bold text-target transition-all hover:text-targetInactive"
        >
          <span className="rotate-180">
            <Reply />
          </span>
          Show more replies
        </button>
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

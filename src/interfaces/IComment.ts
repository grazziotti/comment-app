interface ICommentBase {
  id: string
  content: string
  createdAt: Date
  updatedAt: Date | null
  score: number
  user: IUserInfo
  voted?: {
    voteId: string
    voteType: 'upVote' | 'downVote' | null
  }
}

export interface IComment extends ICommentBase {
  replies?: IReply[]
}

interface IUserInfo {
  username: string
  avatar: string | null
}

export interface IReply extends ICommentBase {
  replyTo?: {
    user: IUserInfo
  }
}

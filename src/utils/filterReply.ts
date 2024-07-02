const filterReply = (content: string, mention: string) => {
  const regex = new RegExp(`@${mention}\\b`, 'i')

  if (regex.test(content)) {
    const filteredComment = content.substring(
      content.indexOf(`@${mention},`) + `@${mention},`.length
    )

    return filteredComment
  }

  return content
}

export { filterReply }

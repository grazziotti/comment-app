const isEmptyOrSpaces = (str: string) => {
  return str.trim() === null || str.trim().match(/^ *$/) !== null
}

export { isEmptyOrSpaces }

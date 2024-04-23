const checkPassword = (password: string) => {
  return /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[!@#$%^&*()\-_=+{};:,<.>?]).{8,}$/.test(
    password
  )
}

export { checkPassword }

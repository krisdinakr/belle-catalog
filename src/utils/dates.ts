export const createDateAddDaysFromNow = (days: number) => {
  const date = new Date()

  date.setDate(date.getDate() + days)

  return date
}

export const createDateNow = () => {
  return new Date()
}

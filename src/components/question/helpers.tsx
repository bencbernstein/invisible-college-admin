export const calcProgress = (questionsAnswered: number): any => {
  let level = 1
  let counter = 0
  let qsForLevel = 0
  let qsAnsweredForLevel = 0
  while (true) {
    qsForLevel = Math.min(100, 10 + level * 2)
    if (counter + qsForLevel > questionsAnswered) {
      qsAnsweredForLevel = questionsAnswered - counter
      break
    }
    counter += qsForLevel
    level += 1
  }
  return { qsForLevel, qsAnsweredForLevel, level }
}

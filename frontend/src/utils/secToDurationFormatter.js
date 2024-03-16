const secToDurationFormatter = (totalSeconds) => {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = Math.floor((totalSeconds % 3600) % 60);

  let duration = '';
  if (hours > 0) duration = `${hours} h ${minutes} m`
  else if (minutes > 0) duration = `${minutes} m ${seconds} s`
  else duration = `0 m ${seconds} s`

  return duration
}

module.exports = secToDurationFormatter

const dateFormatter = (date) => {
  return new Date(date).toLocaleDateString('en-us', {
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  })
}

export default dateFormatter

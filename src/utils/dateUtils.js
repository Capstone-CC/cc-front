export const formatMMSS = t => {
  if(t < 0) return '00:00'
  const MM = `0${Math.floor(t/60)}`.slice(-2)
  const SS = `0${t%60}`.slice(-2)
  return `${MM}:${SS}` 
}
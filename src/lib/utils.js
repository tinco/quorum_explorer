export const displayTrustIndex = (trustIndex) => {
  if (trustIndex == 0 || trustIndex >= 0.01) {
    return (trustIndex * 100).toFixed(2) + "%"
  } else {
    return (trustIndex * 1000).toFixed(2) + "‰"
  }
}

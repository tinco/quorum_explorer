export const displayTrustIndex = (trustIndex) => {
  if (trustIndex >= 1) {
    // It is possible for a nodes trust for an organization to be higher than
    // 100%, as it even trusts the organization when not all of its nodes are
    // online.
    return "100%"
  }
  if (trustIndex == 0 || trustIndex >= 0.01) {
    return (trustIndex * 100).toFixed(2) + "%"
  } else {
    return (trustIndex * 1000).toFixed(2) + "‰"
  }
}

export const navigate = (url) => {
  history.pushState({}, "", url)
  window.dispatchEvent(new Event('location-changed'));
}

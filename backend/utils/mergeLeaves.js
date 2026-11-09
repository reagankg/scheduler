function mergeLeaveRanges(leaves) {
  if (!Array.isArray(leaves) || !leaves.length) return []

  // clone + sort
  const sorted = [...leaves].sort((a, b) =>
    a.startDate.localeCompare(b.startDate)
  )

  const merged = []

  for (const leave of sorted) {
    if (!merged.length) {
      merged.push({ ...leave })
      continue
    }

    const last = merged[merged.length - 1]

    // overlap or touching
    if (leave.startDate <= last.endDate) {
      // extend range
      if (leave.endDate > last.endDate) {
        last.endDate = leave.endDate
      }
    } else {
      merged.push({ ...leave })
    }
  }

  return merged
}

module.exports = mergeLeaveRanges

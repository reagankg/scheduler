import { PH_NON_WORKING_HOLIDAYS } from 'src/utils/phHolidays'

export function isLeave(technician, day) {

    if (!Array.isArray(technician.leaves))
        return false

    const dateKey = formatLocalDate(day.date)

    return technician.leaves.some(l =>
        dateKey >= l.startDate &&
        dateKey <= l.endDate
    )

}

function formatLocalDate(date) {
    return [
        date.getFullYear(),
        String(date.getMonth() + 1).padStart(2, '0'),
        String(date.getDate()).padStart(2, '0')
    ].join('-')
}

export function isDayOff(technician, day) {
  if (!Array.isArray(technician.dayOff)) {
    return false
  }

  const cellDate = new Date(day.date)
  cellDate.setHours(12, 0, 0, 0)

  // No history = use current day off
  if (
    !Array.isArray(technician.dayOffHistory) ||
    !technician.dayOffHistory.length
  ) {
    return technician.dayOff.includes(cellDate.getDay())
  }

  // Oldest change first
  const history = [...technician.dayOffHistory].sort(
    (a, b) => new Date(a.changedAt) - new Date(b.changedAt)
  )

  // Start with the original rule
  let activeRule = history[0].from || []

  for (const change of history) {
    const changeDate = new Date(change.changedAt)
    changeDate.setHours(0, 0, 0, 0)

    // If this calendar date is after the change,
    // use the new rule
    if (cellDate >= changeDate) {
      activeRule = change.to || activeRule
    } else {
      break
    }
  }

  return activeRule.includes(cellDate.getDay())
}

export function isSpecialDayOff(technician, day) {
    if (!Array.isArray(technician.specialDayOff))
        return false

    return technician.specialDayOff.some(
        special => special.dayOffDate === formatLocalDate(day.date)
    )
}

export function getStatusLabel(technician, day) {

    // Leave
    if (Array.isArray(technician.leaves)) {

        const dateKey = formatLocalDate(day.date)

        const leave = technician.leaves.find(l =>
            dateKey >= l.startDate &&
            dateKey <= l.endDate
        )

        if (leave) {
            return {
                type: 'leave',
                label: 'LEAVE',
                detail: leave.reason || 'Leave'
            }
        }
    }

    // Holiday
    const holiday = getHoliday(day)

    if (holiday) {
        return {
            type: 'holiday',
            label: 'HOLIDAY',
            detail: holiday
        }
    }

    // Special Day Off
    // const specialDayOff = technician.specialDayOff?.find(
    //     special => special.dayOffDate === day.iso
    // )

    const specialDayOff =  technician.specialDayOff.some(
        special => special.dayOffDate === formatLocalDate(day.date)
    )

    if (specialDayOff) {
        return {
            type: 'dayoff',
            label: 'DAY OFF',
            detail: specialDayOff.reason || 'Rescheduled Day Off'
        }
    }

    // Day Off
    if (isDayOff(technician, day)) {
        return {
            type: 'dayoff',
            label: 'DAY OFF',
            detail: day.date.toLocaleDateString('en-US', {
                weekday: 'long'
            })
        }
    }

    return null
}


export function getHoliday(day) {

    const year = day.date.getFullYear()

    const holidays = PH_NON_WORKING_HOLIDAYS?.[year]

    if (!holidays)
        return null

    const key = formatLocalDate(day.date)

    return holidays[key] || null

}

export function getEventsForDay(events = [], day) {

    return events.filter(ev =>

        Number(ev.day) === day.dayNumber

    )

}

export function getCellData({

    technician,

    day

}) {

    if (isLeave(technician, day)) {

        return {

            type: 'leave',

            jobs: []

        }

    }

    if (getHoliday(day)) {

        return {

            type: 'holiday',

            jobs: []

        }

    }

    if (
        isSpecialDayOff(technician, day) ||
        isDayOff(technician, day)
    ) {
        return {
            type: 'dayoff',
            jobs: []
        }
    }

    const jobs = getEventsForDay(

        technician.events,

        day

    )

    if (jobs.length) {

        return {

            type: 'job',

            jobs

        }

    }

    return {

        type: 'empty',

        jobs: []

    }

}
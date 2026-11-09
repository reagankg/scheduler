// utils/phHolidays.js

export const PH_NON_WORKING_HOLIDAYS = {
  2026: {
    '2026-01-01': "New Year's Day",
    '2026-02-17': 'Chinese New Year',
    '2026-03-20': "Eid’l Fitr",
    '2026-04-02': 'Maundy Thursday',
    '2026-04-03': 'Good Friday',
    '2026-04-04': 'Black Saturday',
    '2026-04-09': 'Araw ng Kagitingan',
    '2026-05-01': 'Labor Day',
    '2026-05-27': "Eid’l Adha",
    '2026-06-12': 'Independence Day',
    '2026-08-21': 'Ninoy Aquino Day',
    '2026-08-31': 'National Heroes Day',
    '2026-11-01': 'All Saints Day',
    '2026-11-02': 'All Souls Day',
    '2026-11-30': 'Bonifacio Day',
    '2026-12-08': 'Feast of the Immaculate Conception',
    '2026-12-24': 'Christmas Eve',
    '2026-12-25': 'Christmas Day',
    '2026-12-30': 'Rizal Day',
    '2026-12-31': 'Last Day of the Year'
  },

  2027: {
    '2027-01-01': "New Year's Day",
    '2027-02-06': 'Chinese New Year',
    '2027-03-10': "Eid’l Fitr",
    '2027-03-25': 'Maundy Thursday',
    '2027-03-26': 'Good Friday',
    '2027-03-27': 'Black Saturday',
    '2027-04-09': 'Araw ng Kagitingan',
    '2027-05-01': 'Labor Day',
    '2027-05-16': "Eid’l Adha",
    '2027-06-12': 'Independence Day',
    '2027-08-21': 'Ninoy Aquino Day',
    '2027-08-30': 'National Heroes Day',
    '2027-11-01': 'All Saints Day',
    '2027-11-02': 'All Souls Day',
    '2027-11-30': 'Bonifacio Day',
    '2027-12-08': 'Feast of the Immaculate Conception',
    '2027-12-24': 'Christmas Eve',
    '2027-12-25': 'Christmas Day',
    '2027-12-30': 'Rizal Day',
    '2027-12-31': 'Last Day of the Year'
  },

  2028: {
    '2028-01-01': "New Year's Day",
    '2028-01-26': 'Chinese New Year',
    '2028-02-27': "Eid’l Fitr",
    '2028-04-13': 'Maundy Thursday',
    '2028-04-14': 'Good Friday',
    '2028-04-15': 'Black Saturday',
    '2028-04-09': 'Araw ng Kagitingan',
    '2028-05-01': 'Labor Day',
    '2028-05-05': "Eid’l Adha",
    '2028-06-12': 'Independence Day',
    '2028-08-21': 'Ninoy Aquino Day',
    '2028-08-28': 'National Heroes Day',
    '2028-11-01': 'All Saints Day',
    '2028-11-02': 'All Souls Day',
    '2028-11-30': 'Bonifacio Day',
    '2028-12-08': 'Feast of the Immaculate Conception',
    '2028-12-24': 'Christmas Eve',
    '2028-12-25': 'Christmas Day',
    '2028-12-30': 'Rizal Day',
    '2028-12-31': 'Last Day of the Year'
  }
};


export const PH_HOLIDAY_OVERRIDES = {
  'Chinese New Year': {
    2026: '2026-02-17'
  }
};

// utils/phHolidays.js

export const toPHDateOnly = (dateStr) => {
  if (!dateStr) return null;

  return new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Manila',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  }).format(new Date(dateStr.replace(' ', 'T')));
};

export const isNonWorkingHolidayPH = async (
  dateStr,
  getPHHolidaysFn
) => {
  const day = toPHDateOnly(dateStr);
  if (!day) return false;

  const year = Number(day.slice(0, 4));

  // 1. Local hard list
  if (PH_NON_WORKING_HOLIDAYS?.[year]?.[day]) {
    return true;
  }

  // 2. API fallback (caller injects fetcher)
  if (getPHHolidaysFn) {
    const holidays = await getPHHolidaysFn(year);
    for (const h of holidays) {
      const overrideDate =
        PH_HOLIDAY_OVERRIDES?.[h.name]?.[year];

      if (overrideDate) {
        if (overrideDate === day) return true;
        continue;
      }

      if (h.date === day) return true;
    }
  }

  return false;
};

export const getHolidayNamePH = (dateStr) => {
  const day = toPHDateOnly(dateStr);
  if (!day) return null;

  const year = Number(day.slice(0, 4));
  return PH_NON_WORKING_HOLIDAYS?.[year]?.[day] || null;
};

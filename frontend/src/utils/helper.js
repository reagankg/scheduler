// Import Built-ins
import moment from "moment";

export const Get = {
  clone: (data) => {
    return JSON.parse(JSON.stringify(data));
  },
  roundoff: (value, decimal_place) => {
    decimal_place = decimal_place != null ? decimal_place : 2;
    return Number(
      Math.round(value + `e${decimal_place}`) + `e-${decimal_place}`
    );
  },
  capitalizedString: (string) => {
    // Capitalize the first letter of word. john -> John
    return string.charAt(0).toUpperCase() + string.slice(1);
  },
  idToValue: (_id, source = [], key = "name", isValDefault, defaultVal) => {
    /*
     Get the value from list based on key

     -- LIST --
      [
        {
          "_id": 1,
          "name": "John Doe"
        },
        {
          "_id": 2,
          "name": "Mary Kate"
        },
        {
          "_id": 3,
          "name": "John Smith"
        },
      ]

     --_ID--
     3

     --KEY--
     "name"

     --RETURN--
     "John Smith"
    */

    // default value if expression is not met
    defaultVal = isValDefault ? _id || "" : defaultVal || "";

    // default value to {} to avoid error when data does not exist in array
    const obj =
      source.find((e) => (e._id || "").toString() == (_id || "").toString()) ||
      {};
    return key != "-" ? obj[key] || defaultVal : obj;
  },
  arrayToConvertedValue: (array) => {
    const search = array.filter(s => s.filename.includes("Converted")).map(f => f.filename).join()
    return search
  },
  arrayToFailedValue: (array) => {
    const search = array.filter(s => s.filename.includes("Failed")).map(f => f.filename).join()
    return search
  },
  arrayToErrorValue: (array) => {
    const search = array.filter(s => s.filename.includes("Error")).map(f => f.filename).join()
    return search
  },
  date: (date, dateFormat) => {
    // Get date in specific format
    dateFormat = dateFormat || "MMM DD, YYYY, hh:mm A";
    return date ? moment(date).format(dateFormat) : "";
  },
  ISODate: (date) => (date ? moment(date).toISOString() : ""), // Get date in ISO Format
  formDate: (date) => (date ? new Date(date) : ""),
  datesBetweenTwoDates: (s, e) => {
    for (var a = [], d = new Date(s); d <= e; d.setDate(d.getDate() + 1)) {
      a.push(new Date(d));
    }
    return a;
  },
  valueFromDbOption: (optionSelected) => {
    return optionSelected ? (optionSelected || {}).value : null;
  },
  valueFromDbOptionArray: (optionSelected) => {
    return optionSelected ? (optionSelected || []).map((v) => v.value) : null;
  },
  labelFromDbOption: (optionSelected) => {
    return optionSelected ? (optionSelected || {}).label : null;
  },
  dbOptions: (
    list,
    valueKey,
    alternativeValueKey,
    additionalInfo = function () {}
  ) => {
    /*
     Convert the database data to option form

     -- DATABASE --
      [
        {
          "_id": 1,
          "name": "John Doe",
          "username": "john_doe"
        },
        {
          "_id": 2,
          "name": "Mary Kate",
          "username": "mary_kate"
        },
        {
          "_id": 3,
          "name": "John Smith",
          "username": "john_smith"
        },
        {
          "_id": 4,
          "name": "",
          "username": "snow_white"
        },
      ]

     --VALUE KEY--
     "name"

     --ALTERNATIVE VALUE KEY--
     "username"

     --CONVERTED--
      [
        {
          "label": "John Doe",
          "value": 1
        },
        {
          "label": "Mary Kate",
          "value": 2
        },
        {
          "label": "John Smith",
          "value": 3
        },
        {
          "label": "snow_white",
          "value": 4
        },
      ]

    */

    // set default value of alternativeValueKey to valueKey
    alternativeValueKey = alternativeValueKey || valueKey;

    // loop through list
    return (
      list
        .map((v) => {
          // get label
          const label = v[valueKey] || v[alternativeValueKey];

          // return option
          return Object.assign(
            { label: label, value: v._id },
            additionalInfo(v)
          );
        })
        // sort
        .sort((a, b) => a.label.localeCompare(b.label))
    );
  },
  statusListOptions: (path) => {
    // Get the status list in option form based on path (for filter purposes)
    const status = {
      Pending: {
        label: "Pending",
        value: "pending",
      },
      Cancelled: {
        label: "Cancelled",
        value: "Cancelled",
      },
      approved: {
        label: "Approved",
        value: "Approved",
      },
      Rejected: {
        label: "Rejected",
        value: "rejected",
      },
      Ongoing: {
        label: "Ongoing",
        value: "On-going",
      },
      Closed: {
        label: "Closed",
        value: "closed",
      },
      Complete: {
        label: "Complete",
        value: "complete",
      },
      ActiveString: {
        label: "Active",
        value: "active",
      },
      InactiveString: {
        label: "Inactive",
        value: "inactive",
      },
      activeBool: {
        label: "Active",
        value: true,
      },
      inactiveBool: {
        label: "Inactive",
        value: false,
      },
    };

    if (path == "battery" || path == "tire") {
      return [status.pending, status.complete];
    }

    if (path == "user") {
      return [status.activeBool, status.inactiveBool];
    }

    if (path == "labor") {
      return [status.activeString, status.inactiveString];
    }

    if (path == "issuance") {
      return [
        status.approved,
        status.cancelled,
        status.closed,
        status.complete,
        status.ongoing,
        status.rejected,
      ];
    }
  },
  validRegex: (val) => {
    return encodeURIComponent(val);
    // return val.replace(/[^a-zA-Z0-9-_]/g, "");
  },
  base64: (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    }),
  uniqueArray: (arr) => [...new Set(arr)],
  uniqueArrayObject: (arr, key) =>
    arr.filter((v, i, s) => i === s.findIndex((e) => e[key] === v[key])),
  objectFromDotDelimitedString: (path, value) => {
    const [last, ...paths] = path.split(".").reverse();
    return paths.reduce((acc, el) => ({ [el]: acc }), { [last]: value });
  },
  mergedNestedObject: (a, b) => {
    return Object.entries(b).reduce((o, [k, v]) => {
      o[k] =
        v && typeof v === "object"
          ? Get.mergedNestedObject(
              (o[k] = o[k] || (Array.isArray(v) ? [] : {})),
              v
            )
          : v;
      return o;
    }, a);
  },
};

export const Sort = {
  date: (a, b) => {
    // Sort by date
    return new Date(b).getTime() - new Date(a).getTime();
  },
  idToValue: (a = "", b = "", source = [], key = "name") => {
    /*
     Get the value from list then compare from there

     -- LIST --
      [
        {
          "_id": 1,
          "name": "John Doe"
        },
        {
          "_id": 2,
          "name": "Mary Kate"
        },
        {
          "_id": 3,
          "name": "John Smith"
        },
      ]

     --COMPARE KEY--
     "name"

     --RESULT--
      [
        {
          "_id": 1,
          "name": "John Doe"
        },
        {
          "_id": 3,
          "name": "John Smith"
        },
        {
          "_id": 2,
          "name": "Mary Kate"
        },
      ]
    */
    const aString = (source.find((e) => e._id == a) || {})[key] || "";
    const bString = (source.find((e) => e._id == b) || {})[key] || "";

    return aString.localeCompare(bString);
  },
  booleanToValue: (a = "", b = "") => {
    /*
      Specifially made for fields with true/false value.
    */
    const aString = a ? "Active" : "Inactive";
    const bString = b ? "Active" : "Inactive";

    return aString.localeCompare(bString);
  },
};

export const Filter = {
  equal: (val) => {
    /*
     -- DATABASE --
      status: "pending"

     --FILTER--
      status: "complete"    // false
      status: "pending"     // true
    */
    return val ? val : null;
  },
  string: (val) => {
    /*
     -- DATABASE --
      status: "pending"


     --FILTER--
      status: {                       // false
        $in: ["complete"]
      }
      status: {                       // true
        $in: ["pending"]
      }
      status: {                       // true
        $in: ["pending","complete"]
      }
    */
    return (val || []).length > 0 ? { $in: val } : null;
  },
  option: (val) => {
    /*
     -- DATABASE--
      status: "pending"

     --OPTIONS--
     [
      {
        label: "Pending",
        value: "pending"
      },
      {
        label: "Complete",
        value: "complete"
      },
     ]
     > Get.valueFromDbOption(val) will return the 'value' field from option

     --FILTER--
      status: {                       // false
        $in: ["complete"]
      }
      status: {                       // true
        $in: ["pending"]
      }
      status: {                       // true
        $in: ["pending","complete"]
      }
    */

    return (val || []).length > 0
      ? { $in: val.map((v) => Get.valueFromDbOption(v)) }
      : null;
  },
  date: (val, fromIncluded, toIncluded) => {
    /*
     -- DATABASE --
      date: "2021-09-03T01:02:31.413Z"

     --VALUE--
      date: [
        "2021-09-02T00:00:00.000Z",
        "2021-09-10T00:00:00.000Z"

     --FILTER--
      date: {
        $gte: "2021-09-02T00:00:00.000Z",            // Greater than or equal DATE
        $lt: "2021-09-10T00:00:00.000Z"              // Less than DATE
      }
    */

    const filter = {};
    const from = fromIncluded ? "$gte" : "$gt";
    const to = toIncluded ? "$lte" : "$lt";

    filter[from] = val[0];
    filter[to] = val[1];

    return (val || []).length > 0 ? filter : null;
  },
  dateMonthYear: (val) => {
    /*
     --VALUE--
      April 2020

     --FILTER--
      date: {
        $gte: "2022-03-31T16:00:00.000Z",            // Greater than or equal DATE
        $lt: "2022-04-30T15:59:59.999Z"              // Less than DATE
      }
    */

    const split = val.split(" ");
    const month = split[0];
    const year = split[1];

    const from = moment(month + " 01, " + year)
      .startOf("month")
      .toISOString();
    const to = moment(month + " 01, " + year)
      .endOf("month")
      .toISOString();
    const filter = {
      $gte: from,
      $lt: to,
    };

    return val ? filter : null;
  },
  dateYear: (val) => {
    /*
     --VALUE--
      year: 2020

     --FILTER--
      date: {
        $gte: "2019-12-31T16:00:00.000Z",            // Greater than or equal DATE
        $lt: "2020-12-31T15:59:59.999Z"              // Less than DATE
      }
    */

    const from = moment("January 01, " + val)
      .startOf("year")
      .toISOString();
    const to = moment("January 01, " + val)
      .endOf("year")
      .toISOString();
    const filter = {
      $gte: from,
      $lt: to,
    };

    return val ? filter : null;
  },
  betweenMonths: (val, format) => {
    const startDate = val[0] + " 01, 2022";
    const endDate = val[1] + " 01, 2022";

    var dates = val;

    var currDate = moment(startDate).startOf("month");
    var lastDate = moment(endDate).startOf("month");

    while (currDate.add(1, "month").diff(lastDate) < 0) {
      dates.push(currDate.format(format));
    }

    // Remove duplicates first - [...new Set(dates)]
    return dates.length > 0 ? { $in: [...new Set(dates)] } : null;
  },
  contains: (val) => {
    /*
     -- DATABASE --
      name: "John Doe"
      name: "Mary Kate"
      name: "John Smith"


     --FILTER--
      name: { $regex: "OHN do", $options: "i" }     // return "John Doe"
                                                    // searches the string regardless of case
    */
    return val ? { $regex: Get.validRegex(val), $options: "i" } : null;
  },
  reset: (self = {}, obj) => {
    // Resets the form
    Object.keys(self.form || obj || {}).map((v) => {
      if (typeof (self.form || obj)[v] == "object") {
        if (Array.isArray((self.form || obj)[v])) {
          (self.form || obj)[v] = [];
        } else {
          (self.form || obj)[v] = Filter.reset(
            undefined,
            (self.form || obj)[v]
          );
        }
      }
      if (typeof (self.form || obj)[v] == "string") {
        (self.form || obj)[v] = "";
      }
    });
    return self.form || obj;
  },
  clean: (obj) => {
    // Cleans the form object. Remove null, empty string, empty arrays, and empty objects
    Object.keys(obj || {}).map((v) => {
      if (typeof obj[v] == "object") {
        if (Array.isArray(obj[v])) {
          if (obj[v].length == 0) {
            delete obj[v];
          }
        } else {
          obj[v] = Filter.clean(obj[v]);
          if (Object.keys(obj[v] || {}).length == 0) {
            delete obj[v];
          }
        }
      }
      if (!obj[v]) {
        delete obj[v];
      }
    });
    return obj;
  },
};

export const Export = {
  s2ab: (s) => {
    var buf = new ArrayBuffer(s.length);
    var view = new Uint8Array(buf);
    for (var i = 0; i < s.length; i++) view[i] = s.charCodeAt(i) & 0xff;
    return buf;
  },
};

export const Privilege = {
  self: (self) => self.data.created_by == self.userId,
  all: (self) => self.privilege.advance.as == "all",
  approvalBranch: (self) =>
    self.privilege.advance.as == "approval_branch_id" &&
    self.userId == self.data.approval_branch_id &&
    (self.privilege.advance.options || []).includes(self.data.status),
  service_coordinator: (self) =>
    self.privilege.advance.as == "coordinator_id" &&
    self.userId == self.data.coordinator_id &&
    (self.privilege.advance.options || []).includes(self.data.status),
};

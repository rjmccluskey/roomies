var Dateify = function(dateValue) {
  this.dateTime = new Date(dateValue);
  this.hours = this.dateTime.getHours();
  this.minutes = this.dateTime.getMinutes();
  this.calendarDate = Date.UTC(
                                this.dateTime.getFullYear(),
                                this.dateTime.getMonth(),
                                this.dateTime.getDate()
                              );
  this.now = new Date(Date.now());
  this.currentCalendarDate = Date.UTC(
                                       this.now.getFullYear(),
                                       this.now.getMonth(),
                                       this.now.getDate()
                                     );
  this.longDayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  this.shortDayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  this.longMonthNames = [ "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  this.shortMonthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
};

Dateify.millisecondsFromNow = function(dateValue) {
  var dateify = new Dateify(dateValue);
  return dateify.dateTime - dateify.now;
};

Dateify.secondsFromNow = function(dateValue) {
  return parseInt(this.millisecondsFromNow(dateValue) / 1000);
};

Dateify.minutesFromNow = function(dateValue) {
  return parseInt(this.millisecondsFromNow(dateValue) / 60000);
};

Dateify.hoursFromNow = function(dateValue) {
  return parseInt(this.millisecondsFromNow(dateValue) / 3600000);
};

Dateify.calendarDaysFromNow = function(dateValue) {
  var dateify = new Dateify(dateValue);
  return parseInt((dateify.calendarDate - dateify.currentCalendarDate) / 86400000);
};

Dateify.createMessage = function(timeDifference, unit) {
  if (timeDifference > 0) {
    return "in " + timeDifference + " " + unit;
  }
  else if (timeDifference < 0) {
    return Math.abs(timeDifference) + " " + unit + " ago";
  };
};

Dateify.sayDays = function(dateValue) {
  var recent = {
    "-1": "yesterday",
    "0": "today",
    "1": "tomorrow"
  };
  var calendarDaysFromNow = this.calendarDaysFromNow(dateValue);
  var recentMessage = recent[calendarDaysFromNow];

  if (recentMessage) {
    return recentMessage;
  }
  else {
    return this.createMessage(calendarDaysFromNow, "days");
  };
};

Dateify.sayTime = function(dateValue) {
  var dateify = new Dateify(dateValue);
  var hours = dateify.hours;
  var minutes = dateify.minutes;
  var timeOfDay = (hours < 12) ? "AM":"PM";

  if (hours === 0) {
    hours = 12;
  }
  else if (hours >= 13) {
    hours -= 12;
  };

  if (minutes < 10) {
    minutes = "0" + minutes;
  }

  return hours + ":" + minutes + " " + timeOfDay;
};
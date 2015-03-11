var Dateify = function(dateValue) {
  this.dateTime = new Date(dateValue);
  this.evenDate = Date.UTC( this.dateTime.getFullYear(),
                            this.dateTime.getMonth(),
                            this.dateTime.getDate()
                          );
  this.now = Date.now();
  this.longDayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  this.shortDayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
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

Dateify.daysFromNow = function(dateValue) {
  return parseInt(this.millisecondsFromNow(dateValue) / 86400000);
};

Dateify.evenDaysFromNow = function(dateValue) {
  var dateify = new Dateify(dateValue);
  return this.daysFromNow(dateify.evenDate);
};

Dateify.createMessage = function(timeDifference, unit) {
  if (timeDifference > 0) {
    return "in " + timeDifference + " " + unit;
  }
  else if (timeDifference < 0) {
    return Math.abs(timeDifference) + " " + unit + " ago";
  }
};

Dateify.printDays = function(dateValue) {
  var recent = {
    "-1": "yesterday",
    "0": "today",
    "1": "tomorrow"
  };
  var evenDaysFromNow = this.evenDaysFromNow(dateValue);
  var recentMessage = recent[evenDaysFromNow];
  var message = this.createMessage(evenDaysFromNow, "days");

  if (recentMessage) {
    return recentMessage;
  }
  else {
    return message;
  };
};
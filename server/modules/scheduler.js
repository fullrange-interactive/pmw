var fs = require('fs');

var TRANSITION = 'crossfade';

function Scheduler() {
  this.schedule = {};
  fs.readFile('./schedule.json', function (err, data) {
    if (err) {
      throw 'Could not start scheduler - file not found';
    }
    this.schedule = JSON.parse(data);
    for (var i = 0; i < this.schedule.length; i++) {
      this.schedule[i].date = new Date(this.schedule[i].date);
    }
    this.restart();
  }.bind(this));
}

Scheduler.prototype.restart = function () {
  if (this.interval)
    clearInterval(this.interval);
  this.interval = setInterval(this._onTimer.bind(this), 1000);
  this.indexAt = 0;
}

Scheduler.prototype._onTimer = function () {
  var oldIndexAt = this.indexAt;
  for (var i = this.indexAt; i < this.schedule.length; i++) {
    var e = this.schedule[i];
    var now = new Date();
    if (e.date.getTime() < now.getTime()) {
      this.indexAt = i;
    } else {
      break;
    }
  }

  if (oldIndexAt !== this.indexAt) {
    var e = this.schedule[this.indexAt];
    console.log("[Scheduler] sending " + e.slideId + " to group " + e.groupId + " at position " + e.coordinateX + "," + e.coordinateY);
    Manager.setGroupSlideForXY(e.slideId, e.groupId, e.coordinateX, e.coordinateY, TRANSITION);
  }
}

Scheduler.prototype.updateSchedule = function (text, callback) {
  var errors = '';
  var lines = text.replace(/[\r\n]+/g, '\n').split('\n');
  this.schedule = [];
  for (var i in lines) {
    var line = lines[i].trim();
    if (line.length === 0)
      continue;
    var parts = line.split(' ');

    var date = parts[0];
    var time = parts[1];

    var groupId = parts[2];
    var coordinateX = parseInt(parts[3], 10);
    var coordinateY = parseInt(parts[4], 10);

    var slideId = parts[5];

    if (!date || !time || !groupId || isNaN(coordinateX) || isNaN(coordinateY) || !slideId) {
      errors += "La ligne '" + line + "' est fausse\n";
      break;
    }

    var dateParts = date.split('.');
    var day = parseInt(dateParts[0], 10);
    var month = parseInt(dateParts[1], 10);
    var year = parseInt(dateParts[2], 10);

    var timeParts = time.split(':');
    var hours = parseInt(timeParts[0], 10);
    var minutes = parseInt(timeParts[1], 10);
    var seconds = parseInt(timeParts[2], 10);

    if (isNaN(day) || isNaN(month) || isNaN(year) || isNaN(hours) || isNaN(minutes) || isNaN(seconds)) {
      errors += "La ligne '" + line + "' est fausse\n";
      break;
    }

    var scheduleElement = {
      date: new Date(year, month - 1, day, hours, minutes, seconds),
      groupId: groupId,
      coordinateX: coordinateX,
      coordinateY: coordinateY,
      slideId: slideId
    }

    this.schedule.push(scheduleElement);
  }
  if (errors.length === 0) {
    fs.writeFile('./schedule.json', JSON.stringify(this.schedule), function (err) {
      if (err) {
        callback(err);
        return;
      }
      callback(null);
      this.restart();
    }.bind(this));
  }
  else
    callback(errors);
}

function pad(n) {
  if (n < 10)
    return '0' + n;
  else
    return n;
}

Scheduler.prototype.asText = function () {
  var str = '';
  for (var i = 0; i < this.schedule.length; i++) {
    var e = this.schedule[i];
    str += pad(e.date.getDate()) + '.' + pad(e.date.getMonth() + 1) + '.' + pad(e.date.getFullYear()) + ' ' + pad(e.date.getHours()) + ':' + pad(e.date.getMinutes()) + ':' + pad(e.date.getSeconds());
    str += ' ';
    str += e.groupId + ' ' + e.coordinateX + ' ' + e.coordinateY + ' ' + e.slideId + '\n';
  }
  return str;
}


module.exports = exports = new Scheduler();
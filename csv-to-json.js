"use strict";
var fs = require('fs')
var CSV = require('comma-separated-values')
var _ = require('lodash-node')

var archive = JSON.parse(fs.readFileSync('./src/archive.json', 'utf-8'))
var exercises = fs.readFileSync('./src/source.csv', 'utf-8').split('\n').slice(1).join('\n')

exercises = new CSV(exercises, {
  cast: false,
  header: ['date','exercise','set','weight','repetitions','notes']
}).parse()

exercises = _(exercises)
  .map(exerciseToLowercase)
  .map(convertPropertyToNumber('set'))
  .map(convertPropertyToNumber('weight'))
  .map(convertPropertyToNumber('repetitions'))
  .map(removeWeightIfNull)
  .map(negateWeightOfAssistingExercises)
  .map(convertDates)
  .sortBy('date')
  .value()

var all = archive.concat(exercises);
fs.writeFileSync('./dist/exercises.json', JSON.stringify(all, null, 2))

function exerciseToLowercase(entry) {
  entry.exercise = entry.exercise.toLowerCase()
  return entry
}

function removeWeightIfNull(entry) {
  if (isNaN(entry.weight)) delete entry.weight
  return entry
}

function negateWeightOfAssistingExercises(entry) {
  var assistingExercises =
    ['dip', 'assisted pull-up', 'parallel bar dip', 'triceps assisted dip', 'chinup']
  if (assistingExercises.indexOf(entry.exercise) > -1) {
    entry.weight *= -1
  }
  return entry
}

function convertPropertyToNumber(property) {
  return function(entry) {
    entry[property] = parseInt(entry[property], 10)
    return entry
  }
}

function convertDates(entry) {
  var date = entry.date.split('.').reverse()
  date[0] = '20'+date[0]
  entry.date = new Date(date.join('-'))
  return entry
}

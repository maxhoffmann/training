"use strict";
var fs = require('fs')
var CSV = require('comma-separated-values')
var _ = require('lodash-node')

var source = fs.readFileSync('./src/source.csv', 'utf-8')
  .replace(/\n\n/g, '\n')
  .split('\n')
  .slice(2)
  .join('\n')
  .split('Exercise\n')

var cardio = source[0].split('\n').slice(1, -1).join('\n')
var exercises = source[1].split('\n').slice(1).join('\n')

cardio = new CSV(cardio, {
  cast: false,
  header: ['date','exercise','set','duration','resistance','elevation','calories','notes']
}).parse()

exercises = new CSV(exercises, {
  cast: false,
  header: ['date','exercise','set','weight','repetitions','notes']
}).parse()

cardio = _(cardio)
  .map(trimExercise)
  .map(convertPropertyToNumber('set'))
  .map(convertPropertyToNumber('duration'))
  .map(convertPropertyToNumber('resistance'))
  .map(convertDates)
  .value()

exercises = _(exercises)
  .map(trimExercise)
  .map(removeKgFromWeight)
  .map(convertPropertyToNumber('set'))
  .map(convertPropertyToNumber('weight'))
  .map(convertPropertyToNumber('repetitions'))
  .map(negateWeightOfAssistingExercises)
  .map(convertDates)
  .value()

var all = _(exercises.concat(cardio))
  .sortBy('date')
  .value()

fs.writeFileSync('./dist/exercises.json', JSON.stringify(all, null, 2))

function trimExercise(entry) {
  entry.exercise = entry.exercise.trim()
  return entry
}

function removeKgFromWeight(entry) {
  entry.weight = entry.weight.slice(0,-3)
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
  entry.date = new Date(entry.date)
  return entry
}

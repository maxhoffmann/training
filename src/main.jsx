"use strict";
var React = require('react')
var Dashboard = require('dashboard')
var records = require('../dist/all.json')

React.render(<Dashboard records={records} />, document.body)

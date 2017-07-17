// static imports
require('../assets/css/env-react/core.scss')

// js
import 'babel-polyfill'
import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'


const root = document.getElementById('env-react')


ReactDOM.render(<App/>, root)

import React from 'react';
import ReactDOM from 'react-dom';
import Router from './Router';

require('./utils/_preprocessing.js');

ReactDOM.render(<Router />, document.getElementById('root'));
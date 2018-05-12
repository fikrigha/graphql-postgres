'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _sequelize = require('sequelize');

var _sequelize2 = _interopRequireDefault(_sequelize);

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _faker = require('faker');

var _faker2 = _interopRequireDefault(_faker);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// Define a connection
var Connection = new _sequelize2.default('relay', // db name
'postgres', // db username
'postgres', // db password
{
  dialect: 'postgres',
  host: 'localhost'
});

// Define a table: Person
var Person = new Connection.define('person', {
  firstName: {
    type: _sequelize2.default.STRING,
    allowNull: false
  },
  lastName: {
    type: _sequelize2.default.STRING,
    allowNull: false
  },
  email: {
    type: _sequelize2.default.STRING,
    allowNull: false,
    validate: {
      isEmail: true
    }
  }
});

// Define a table: Post
var Post = new Connection.define('post', {
  title: {
    type: _sequelize2.default.STRING,
    allowNull: false
  },
  content: {
    type: _sequelize2.default.STRING,
    allowNull: false
  }
});

// Set table relationships
Person.hasMany(Post);
Post.belongsTo(Person);

Connection.sync({
  force: true // If force then dont create tables if already exist
}).then(function () {
  _lodash2.default.times(10, function () {
    return Person.create({
      firstName: _faker2.default.name.firstName,
      lastName: _faker2.default.name.lastName,
      email: _faker2.default.internet.email
    });
  });
});

exports.default = Connection;

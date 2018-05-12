import Sequelize from 'sequelize';
import _ from 'lodash';
import Faker from 'faker';


const DB_NAME = 'relay';
const DB_USR_NAME = 'postgres';
const DB_PWD = 'postgres';
const DB_DIALECT = 'postgres';


// Define a connection
const Connection = new Sequelize(
  DB_NAME,
  DB_USR_NAME,
  DB_PWD,
  {
    dialect: DB_DIALECT,
    host: 'localhost',
    operatorsAliases: false
  },
);


// Define a table: people
const Person = Connection.define('person', {
  firstName: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  lastName: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  email: {
    type: Sequelize.STRING,
    allowNull: false,
    validate: {
      isEmail: true,
    },
  },
});


// Define a table: posts
const Post = Connection.define('post', {
  title: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  content: {
    type: Sequelize.STRING,
    allowNull: false,
  }
});


// Set table relationships
Person.hasMany(Post);
Post.belongsTo(Person);


// Sync db
// If force then dont create tables if already exist
Connection.sync({ force: true })
  .then((() => {
    console.info(`Connected to db: ${DB_NAME}`);
    
    // Create 10 fake users
    _.times(10, () => {
      return Person.create({
        firstName: Faker.name.firstName(),
        lastName: Faker.name.lastName(),
        email: Faker.internet.email(),
      })
        .then(person => { // Create a fake post
          return person.createPost({
            title: `Sample title by ${person.firstName}`,
            content: `This is a sample article`,
          });
        })
      ;
    });

  }))
  .catch(() => {
    console.error(`Failed to connect to db: ${DB_NAME}`);
  })
;

export default Connection;

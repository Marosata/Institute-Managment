const { Sequelize } = require('sequelize');
const config = require('../config/config');

const sequelize = new Sequelize({
  host: config.DB_HOST,
  port: config.DB_PORT,
  database: config.DB_NAME,
  username: config.DB_USER,
  password: config.DB_PASSWORD,
  dialect: 'postgres',
  logging: config.NODE_ENV === 'development' ? console.log : false,
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
});

// Test the connection
async function testConnection() {
  try {
    await sequelize.authenticate();
    console.log('Connection à la base de données établie avec succès.');
  } catch (error) {
    console.error('Impossible de se connecter à la base de données:', error);
  }
}

testConnection();

// Import models
const User = require('./User');
const Student = require('./Student');
const Teacher = require('./Teacher');
const Class = require('./Class');
const Course = require('./Course');
const Schedule = require('./Schedule');
const Payment = require('./Payment');
const Document = require('./Document');
const Message = require('./Message');

// Initialize models
const models = {
  User: User(sequelize),
  Student: Student(sequelize),
  Teacher: Teacher(sequelize),
  Class: Class(sequelize),
  Course: Course(sequelize),
  Schedule: Schedule(sequelize),
  Payment: Payment(sequelize),
  Document: Document(sequelize),
  Message: Message(sequelize)
};

// Set up associations
Object.keys(models).forEach(modelName => {
  if (models[modelName].associate) {
    models[modelName].associate(models);
  }
});

module.exports = {
  sequelize,
  ...models
}; 
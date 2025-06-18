const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Class = sequelize.define('Class', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      comment: 'Nom de la classe (ex: 6èmeA, CP1, etc.)'
    },
    grade: {
      type: DataTypes.STRING,
      allowNull: false,
      comment: 'Niveau scolaire'
    },
    academicYear: {
      type: DataTypes.STRING,
      allowNull: false,
      comment: 'Année scolaire (ex: 2023-2024)'
    },
    mainTeacherId: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: 'Teachers',
        key: 'id'
      },
      comment: 'Professeur principal'
    },
    capacity: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 30,
      validate: {
        min: 1
      }
    },
    room: {
      type: DataTypes.STRING,
      allowNull: true,
      comment: 'Salle de classe assignée'
    },
    schedule: {
      type: DataTypes.JSONB,
      allowNull: true,
      defaultValue: {},
      comment: 'Emploi du temps hebdomadaire par défaut'
    },
    status: {
      type: DataTypes.ENUM('active', 'inactive', 'archived'),
      defaultValue: 'active'
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    }
  }, {
    timestamps: true
  });

  Class.associate = (models) => {
    Class.belongsTo(models.Teacher, {
      foreignKey: 'mainTeacherId',
      as: 'mainTeacher'
    });
    Class.belongsToMany(models.Student, {
      through: 'StudentClasses',
      foreignKey: 'classId',
      as: 'students'
    });
    Class.belongsToMany(models.Teacher, {
      through: 'TeacherClasses',
      foreignKey: 'classId',
      as: 'teachers'
    });
    Class.hasMany(models.Course, {
      foreignKey: 'classId',
      as: 'courses'
    });
    Class.hasMany(models.Schedule, {
      foreignKey: 'classId',
      as: 'schedules'
    });
  };

  return Class;
}; 
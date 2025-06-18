const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Course = sequelize.define('Course', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      comment: 'Nom du cours'
    },
    code: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      comment: 'Code unique du cours'
    },
    subject: {
      type: DataTypes.STRING,
      allowNull: false,
      comment: 'Matière enseignée'
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    teacherId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'Teachers',
        key: 'id'
      }
    },
    classId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'Classes',
        key: 'id'
      }
    },
    academicYear: {
      type: DataTypes.STRING,
      allowNull: false
    },
    semester: {
      type: DataTypes.STRING,
      allowNull: true
    },
    credits: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0
    },
    objectives: {
      type: DataTypes.JSONB,
      allowNull: true,
      defaultValue: [],
      comment: 'Objectifs pédagogiques'
    },
    syllabus: {
      type: DataTypes.JSONB,
      allowNull: true,
      defaultValue: {},
      comment: 'Programme détaillé du cours'
    },
    evaluationMethod: {
      type: DataTypes.JSONB,
      allowNull: true,
      defaultValue: {},
      comment: 'Méthode d\'évaluation'
    },
    status: {
      type: DataTypes.ENUM('active', 'inactive', 'archived'),
      defaultValue: 'active'
    }
  }, {
    timestamps: true
  });

  Course.associate = (models) => {
    Course.belongsTo(models.Teacher, {
      foreignKey: 'teacherId',
      as: 'teacher'
    });
    Course.belongsTo(models.Class, {
      foreignKey: 'classId',
      as: 'class'
    });
    Course.belongsToMany(models.Student, {
      through: 'StudentCourses',
      foreignKey: 'courseId',
      as: 'students'
    });
    Course.hasMany(models.Schedule, {
      foreignKey: 'courseId',
      as: 'schedules'
    });
  };

  return Course;
}; 
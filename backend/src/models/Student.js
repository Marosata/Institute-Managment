const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Student = sequelize.define('Student', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'Users',
        key: 'id'
      }
    },
    studentId: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false
    },
    dateOfBirth: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    grade: {
      type: DataTypes.STRING,
      allowNull: false,
      comment: 'Niveau scolaire (PS, MS, GS, CP, ..., L3)'
    },
    section: {
      type: DataTypes.STRING,
      allowNull: true,
      comment: 'Section ou spécialisation'
    },
    parentInfo: {
      type: DataTypes.JSONB,
      allowNull: true,
      defaultValue: {},
      comment: 'Informations sur les parents/tuteurs'
    },
    medicalInfo: {
      type: DataTypes.JSONB,
      allowNull: true,
      defaultValue: {},
      comment: 'Informations médicales importantes'
    },
    enrollmentDate: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      defaultValue: DataTypes.NOW
    },
    status: {
      type: DataTypes.ENUM('active', 'inactive', 'graduated', 'suspended'),
      defaultValue: 'active'
    }
  }, {
    timestamps: true
  });

  Student.associate = (models) => {
    Student.belongsTo(models.User, {
      foreignKey: 'userId',
      as: 'user'
    });
    Student.belongsToMany(models.Class, {
      through: 'StudentClasses',
      foreignKey: 'studentId',
      as: 'classes'
    });
    Student.hasMany(models.Payment, {
      foreignKey: 'studentId',
      as: 'payments'
    });
    Student.belongsToMany(models.Course, {
      through: 'StudentCourses',
      foreignKey: 'studentId',
      as: 'courses'
    });
  };

  return Student;
}; 
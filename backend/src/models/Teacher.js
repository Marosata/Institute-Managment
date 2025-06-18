const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Teacher = sequelize.define('Teacher', {
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
    employeeId: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false
    },
    specialization: {
      type: DataTypes.STRING,
      allowNull: false,
      comment: 'Domaine de spécialisation'
    },
    qualifications: {
      type: DataTypes.JSONB,
      allowNull: true,
      defaultValue: [],
      comment: 'Liste des diplômes et certifications'
    },
    subjects: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      allowNull: false,
      defaultValue: [],
      comment: 'Matières enseignées'
    },
    employmentDate: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      defaultValue: DataTypes.NOW
    },
    contractType: {
      type: DataTypes.ENUM('full-time', 'part-time', 'temporary'),
      allowNull: false,
      defaultValue: 'full-time'
    },
    status: {
      type: DataTypes.ENUM('active', 'inactive', 'on-leave'),
      defaultValue: 'active'
    },
    availability: {
      type: DataTypes.JSONB,
      allowNull: true,
      defaultValue: {},
      comment: 'Disponibilités hebdomadaires'
    }
  }, {
    timestamps: true
  });

  Teacher.associate = (models) => {
    Teacher.belongsTo(models.User, {
      foreignKey: 'userId',
      as: 'user'
    });
    Teacher.hasMany(models.Course, {
      foreignKey: 'teacherId',
      as: 'courses'
    });
    Teacher.hasMany(models.Class, {
      foreignKey: 'mainTeacherId',
      as: 'mainClasses'
    });
    Teacher.belongsToMany(models.Class, {
      through: 'TeacherClasses',
      foreignKey: 'teacherId',
      as: 'classes'
    });
    Teacher.hasMany(models.Schedule, {
      foreignKey: 'teacherId',
      as: 'schedules'
    });
  };

  return Teacher;
}; 
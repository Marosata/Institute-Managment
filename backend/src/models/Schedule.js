const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Schedule = sequelize.define('Schedule', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    courseId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'Courses',
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
    teacherId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'Teachers',
        key: 'id'
      }
    },
    dayOfWeek: {
      type: DataTypes.ENUM('lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi'),
      allowNull: false
    },
    startTime: {
      type: DataTypes.TIME,
      allowNull: false
    },
    endTime: {
      type: DataTypes.TIME,
      allowNull: false
    },
    room: {
      type: DataTypes.STRING,
      allowNull: true
    },
    recurrence: {
      type: DataTypes.ENUM('weekly', 'biweekly', 'monthly', 'once'),
      defaultValue: 'weekly'
    },
    startDate: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    endDate: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    status: {
      type: DataTypes.ENUM('scheduled', 'cancelled', 'rescheduled'),
      defaultValue: 'scheduled'
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    metadata: {
      type: DataTypes.JSONB,
      allowNull: true,
      defaultValue: {},
      comment: 'Informations supplémentaires (matériel nécessaire, etc.)'
    }
  }, {
    timestamps: true,
    validate: {
      timeOrder() {
        if (this.startTime >= this.endTime) {
          throw new Error('L\'heure de début doit être antérieure à l\'heure de fin');
        }
      },
      dateOrder() {
        if (this.startDate > this.endDate) {
          throw new Error('La date de début doit être antérieure ou égale à la date de fin');
        }
      }
    }
  });

  Schedule.associate = (models) => {
    Schedule.belongsTo(models.Course, {
      foreignKey: 'courseId',
      as: 'course'
    });
    Schedule.belongsTo(models.Class, {
      foreignKey: 'classId',
      as: 'class'
    });
    Schedule.belongsTo(models.Teacher, {
      foreignKey: 'teacherId',
      as: 'teacher'
    });
  };

  return Schedule;
}; 
const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Message = sequelize.define('Message', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    senderId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'Users',
        key: 'id'
      }
    },
    receiverId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'Users',
        key: 'id'
      }
    },
    subject: {
      type: DataTypes.STRING,
      allowNull: false
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    type: {
      type: DataTypes.ENUM('message', 'notification', 'announcement'),
      defaultValue: 'message'
    },
    priority: {
      type: DataTypes.ENUM('low', 'normal', 'high', 'urgent'),
      defaultValue: 'normal'
    },
    status: {
      type: DataTypes.ENUM('sent', 'delivered', 'read', 'archived'),
      defaultValue: 'sent'
    },
    readAt: {
      type: DataTypes.DATE,
      allowNull: true
    },
    parentMessageId: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: 'Messages',
        key: 'id'
      },
      comment: 'Pour les réponses dans un fil de discussion'
    },
    attachments: {
      type: DataTypes.JSONB,
      allowNull: true,
      defaultValue: [],
      comment: 'Liste des pièces jointes'
    },
    metadata: {
      type: DataTypes.JSONB,
      allowNull: true,
      defaultValue: {},
      comment: 'Métadonnées supplémentaires'
    },
    expiryDate: {
      type: DataTypes.DATE,
      allowNull: true,
      comment: 'Date d\'expiration pour les notifications'
    },
    tags: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      defaultValue: [],
      comment: 'Tags pour la catégorisation'
    }
  }, {
    timestamps: true,
    paranoid: true, // Soft delete
    indexes: [
      {
        fields: ['senderId', 'receiverId']
      },
      {
        fields: ['type', 'status']
      }
    ]
  });

  Message.associate = (models) => {
    Message.belongsTo(models.User, {
      foreignKey: 'senderId',
      as: 'sender'
    });
    Message.belongsTo(models.User, {
      foreignKey: 'receiverId',
      as: 'receiver'
    });
    Message.belongsTo(Message, {
      foreignKey: 'parentMessageId',
      as: 'parentMessage'
    });
    Message.hasMany(Message, {
      foreignKey: 'parentMessageId',
      as: 'replies'
    });
  };

  return Message;
}; 
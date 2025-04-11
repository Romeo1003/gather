import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";
import Events from "./Event.js";
import User from "./User.js";

const Invite = sequelize.define("Invite", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  code: {
    type: DataTypes.STRING(10),
    allowNull: false,
    unique: true,
  },
  eventId: {
    type: DataTypes.STRING(6),
    allowNull: false,
    references: {
      model: Events,
      key: 'id'
    }
  },
  email: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  status: {
    type: DataTypes.ENUM('pending', 'accepted', 'declined'),
    defaultValue: 'pending',
  },
  sentBy: {
    type: DataTypes.STRING(100),
    allowNull: false,
    references: {
      model: User,
      key: 'email'
    }
  },
  sentDate: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  responseDate: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  paid: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  paymentDate: {
    type: DataTypes.DATE,
    allowNull: true
  },
  paymentAmount: {
    type: DataTypes.FLOAT,
    allowNull: true
  },
  paymentReference: {
    type: DataTypes.STRING(100),
    allowNull: true
  }
}, {
  timestamps: true,
  hooks: {
    beforeValidate: (invite) => {
      if (!invite.code) {
        invite.code = generateInviteCode();
      }
    }
  }
});

// Function to generate unique invite code
function generateInviteCode() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // Omitting similar looking characters
  let result = '';
  for (let i = 0; i < 8; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

export default Invite; 
import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";
import EventRequest from "./EventRequest.js";

const Guest = sequelize.define("Guest", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  phone: {
    type: DataTypes.STRING(20),
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING(100),
    allowNull: true,
  },
  eventRequestId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: EventRequest,
      key: 'id'
    }
  },
  inviteSent: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  inviteSentDate: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  inviteAccepted: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  inviteResponseDate: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  attending: {
    type: DataTypes.BOOLEAN,
    allowNull: true,
  },
  notes: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  inviteCode: {
    type: DataTypes.STRING(10),
    allowNull: true,
    unique: true,
  }
}, {
  timestamps: true,
  hooks: {
    beforeValidate: (guest) => {
      if (!guest.inviteCode) {
        guest.inviteCode = generateInviteCode();
      }
    }
  }
});

// Generate a unique invite code
function generateInviteCode() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let result = '';
  for (let i = 0; i < 8; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

export default Guest; 
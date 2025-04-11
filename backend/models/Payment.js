import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";
import Invite from "./Invite.js";
import User from "./User.js";

const Payment = sequelize.define("Payment", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  inviteId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Invite,
      key: 'id'
    }
  },
  amount: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  currency: {
    type: DataTypes.STRING(3),
    allowNull: false,
    defaultValue: 'USD'
  },
  status: {
    type: DataTypes.ENUM('pending', 'completed', 'failed', 'refunded'),
    defaultValue: 'pending',
  },
  paymentMethod: {
    type: DataTypes.STRING(50),
    allowNull: false,
  },
  transactionId: {
    type: DataTypes.STRING(100),
    allowNull: true,
  },
  paidBy: {
    type: DataTypes.STRING(100),
    allowNull: false,
    references: {
      model: User,
      key: 'email'
    }
  },
  paymentDate: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  adminApproved: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  approvedBy: {
    type: DataTypes.STRING(100),
    allowNull: true,
    references: {
      model: User,
      key: 'email'
    }
  },
  approvalDate: {
    type: DataTypes.DATE,
    allowNull: true
  },
  notes: {
    type: DataTypes.TEXT,
    allowNull: true
  }
}, {
  timestamps: true
});

export default Payment; 
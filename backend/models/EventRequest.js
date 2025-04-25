import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';
import crypto from 'crypto';

const EventRequest = sequelize.define('EventRequest', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  clientEmail: {
    type: DataTypes.STRING,
    allowNull: false,
    field: 'client_email'
  },
  reviewerId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    field: 'reviewer_id'
  },
  eventType: {
    type: DataTypes.STRING,
    allowNull: false,
    field: 'event_type'
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  estimatedGuests: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      min: 1
    },
    field: 'estimated_guests'
  },
  budget: {
    type: DataTypes.FLOAT,
    allowNull: false,
    validate: {
      min: 0
    }
  },
  startDate: {
    type: DataTypes.DATE,
    allowNull: false,
    field: 'start_date'
  },
  endDate: {
    type: DataTypes.DATE,
    allowNull: false,
    field: 'end_date'
  },
  venueId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'venue_id'
  },
  status: {
    type: DataTypes.ENUM('pending', 'approved', 'rejected', 'cancelled', 'completed', 'payment_pending', 'paid'),
    defaultValue: 'pending',
    allowNull: false
  },
  specialRequests: {
    type: DataTypes.TEXT,
    allowNull: true,
    field: 'special_requests'
  },
  adminNotes: {
    type: DataTypes.TEXT,
    allowNull: true,
    field: 'admin_notes'
  },
  venueCharge: {
    type: DataTypes.FLOAT,
    defaultValue: 0,
    field: 'venue_charge'
  },
  serviceCharge: {
    type: DataTypes.FLOAT,
    defaultValue: 0,
    field: 'service_charge'
  },
  additionalCharges: {
    type: DataTypes.FLOAT,
    defaultValue: 0,
    field: 'additional_charges'
  },
  discount: {
    type: DataTypes.FLOAT,
    defaultValue: 0
  },
  tax: {
    type: DataTypes.FLOAT,
    defaultValue: 0
  },
  totalCost: {
    type: DataTypes.FLOAT,
    defaultValue: 0,
    field: 'total_cost'
  },
  isPaid: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    field: 'is_paid'
  },
  paidAt: {
    type: DataTypes.DATE,
    allowNull: true,
    field: 'paid_at'
  },
  transactionId: {
    type: DataTypes.STRING,
    allowNull: true,
    field: 'transaction_id'
  },
  paymentMethod: {
    type: DataTypes.STRING,
    allowNull: true,
    field: 'payment_method'
  },
  inviteCode: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: true,
    field: 'invite_code'
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
    field: 'is_active'
  },
  notificationSent: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    field: 'notification_sent'
  },
  shareGuestList: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
    field: 'share_guest_list'
  }
}, {
  timestamps: true,
  hooks: {
    beforeCreate: (eventRequest) => {
      // Generate invite code if not provided
      if (!eventRequest.inviteCode) {
        eventRequest.inviteCode = crypto.randomBytes(3).toString('hex').toUpperCase();
      }
    },
    beforeUpdate: (eventRequest) => {
      // Calculate total cost when relevant fields change
      if (eventRequest.changed('venueCharge') || 
          eventRequest.changed('serviceCharge') || 
          eventRequest.changed('additionalCharges') || 
          eventRequest.changed('discount') || 
          eventRequest.changed('tax')) {
        
        const subtotal = eventRequest.venueCharge + 
                         eventRequest.serviceCharge + 
                         eventRequest.additionalCharges - 
                         eventRequest.discount;
        
        const totalTax = subtotal * (eventRequest.tax / 100);
        eventRequest.totalCost = subtotal + totalTax;
      }
    }
  }
});

// Instance method to calculate total cost
EventRequest.prototype.calculateTotalCost = function() {
  const subtotal = this.venueCharge + this.serviceCharge + this.additionalCharges - this.discount;
  const totalTax = subtotal * (this.tax / 100);
  this.totalCost = subtotal + totalTax;
  return this.totalCost;
};

// Instance method to generate invite code
EventRequest.prototype.generateInviteCode = function() {
  this.inviteCode = crypto.randomBytes(3).toString('hex').toUpperCase();
  return this.inviteCode;
};

export default EventRequest;
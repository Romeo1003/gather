import mongoose from 'mongoose';
import crypto from 'crypto';

const eventRequestSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User'
    },
    eventType: {
      type: String,
      required: true
    },
    title: {
      type: String,
      required: true
    },
    description: {
      type: String,
      required: true
    },
    estimatedGuests: {
      type: Number,
      required: true,
      min: 1
    },
    budget: {
      type: Number,
      required: true,
      min: 0
    },
    startDate: {
      type: Date,
      required: true
    },
    endDate: {
      type: Date,
      required: true
    },
    venue: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Venue',
      required: true
    },
    status: {
      type: String,
      required: true,
      default: 'pending',
      enum: ['pending', 'approved', 'rejected', 'cancelled', 'completed', 'payment_pending', 'paid']
    },
    specialRequests: {
      type: String
    },
    adminNotes: {
      type: String
    },
    cost: {
      venueCharge: {
        type: Number,
        default: 0
      },
      serviceCharge: {
        type: Number,
        default: 0
      },
      additionalCharges: {
        type: Number,
        default: 0
      },
      discount: {
        type: Number,
        default: 0
      },
      tax: {
        type: Number,
        default: 0
      },
      total: {
        type: Number,
        default: 0
      }
    },
    paymentInfo: {
      isPaid: {
        type: Boolean,
        default: false
      },
      paidAt: Date,
      transactionId: String,
      method: String
    },
    inviteCode: {
      type: String,
      unique: true,
      sparse: true
    },
    guests: [
      {
        name: {
          type: String,
          required: true
        },
        email: {
          type: String
        },
        phone: {
          type: String
        },
        status: {
          type: String,
          default: 'pending',
          enum: ['pending', 'confirmed', 'declined']
        }
      }
    ],
    isActive: {
      type: Boolean,
      default: true
    }
  },
  {
    timestamps: true
  }
);

// Generate unique invite code
eventRequestSchema.methods.generateInviteCode = function() {
  // Generate a 6-character alphanumeric code
  this.inviteCode = crypto.randomBytes(3).toString('hex').toUpperCase();
  return this.inviteCode;
};

// Calculate total cost
eventRequestSchema.methods.calculateTotalCost = function() {
  const { venueCharge, serviceCharge, additionalCharges, discount, tax } = this.cost;
  const subtotal = venueCharge + serviceCharge + additionalCharges - discount;
  const totalTax = subtotal * (tax / 100);
  this.cost.total = subtotal + totalTax;
  return this.cost.total;
};

const EventRequest = mongoose.model('EventRequest', eventRequestSchema);

export default EventRequest; 
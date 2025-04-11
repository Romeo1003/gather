import Events from './Event.js';
import User from './User.js';
import Venue from './Venue.js';
import Invite from './Invite.js';
import Payment from './Payment.js';
import EventRequest from './EventRequest.js';
import Guest from './Guest.js';

// Define associations between models
Events.belongsTo(Venue, { foreignKey: 'venueId', as: 'venue' });
Venue.hasMany(Events, { foreignKey: 'venueId', as: 'events' });

Invite.belongsTo(Events, { foreignKey: 'eventId', as: 'event' });
Events.hasMany(Invite, { foreignKey: 'eventId', as: 'invites' });

Invite.belongsTo(User, { foreignKey: 'sentBy', as: 'sender' });
User.hasMany(Invite, { foreignKey: 'sentBy', as: 'sentInvites' });

Payment.belongsTo(Invite, { foreignKey: 'inviteId', as: 'invite' });
Invite.hasOne(Payment, { foreignKey: 'inviteId', as: 'payment' });

Payment.belongsTo(User, { foreignKey: 'paidBy', as: 'payingUser' });
User.hasMany(Payment, { foreignKey: 'paidBy', as: 'payments' });

Payment.belongsTo(User, { foreignKey: 'approvedBy', as: 'approvingAdmin' });
User.hasMany(Payment, { foreignKey: 'approvedBy', as: 'approvedPayments' });

// Skip EventRequest associations for now since they're causing issues
// We'll comment these out until the model is properly defined
/*
// Event Request associations
EventRequest.belongsTo(User, { foreignKey: 'clientEmail', as: 'client' });
User.hasMany(EventRequest, { foreignKey: 'clientEmail', as: 'eventRequests' });

EventRequest.belongsTo(Venue, { foreignKey: 'venueId', as: 'venue' });
Venue.hasMany(EventRequest, { foreignKey: 'venueId', as: 'eventRequests' });

EventRequest.belongsTo(User, { foreignKey: 'reviewedBy', as: 'reviewer' });
User.hasMany(EventRequest, { foreignKey: 'reviewedBy', as: 'reviewedRequests' });

// Guest associations
Guest.belongsTo(EventRequest, { foreignKey: 'eventRequestId', as: 'eventRequest' });
EventRequest.hasMany(Guest, { foreignKey: 'eventRequestId', as: 'guests' });
*/

// Export all models
export {
  Events,
  User,
  Venue,
  Invite,
  Payment,
  EventRequest,
  Guest
}; 
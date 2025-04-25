// Import models
import Events from './Event.js';
import User from './User.js';
import Venue from './Venue.js';
import Invite from './Invite.js';
import Payment from './Payment.js';
import EventRequest from './EventRequest.js';
import Guest from './Guest.js';

// Define associations
// User to Events (one-to-many)
User.hasMany(Events, { foreignKey: 'organizerEmail', sourceKey: 'email' });
Events.belongsTo(User, { foreignKey: 'organizerEmail', targetKey: 'email' });

// Venue to Events (one-to-many)
Venue.hasMany(Events, { foreignKey: 'venueId', as: 'Events' });
Events.belongsTo(Venue, { foreignKey: 'venueId' });

// User to EventRequest (one-to-many)
User.hasMany(EventRequest, { foreignKey: 'clientEmail', sourceKey: 'email' });
EventRequest.belongsTo(User, { foreignKey: 'clientEmail', targetKey: 'email', as: 'client' });

// Admin (User) to EventRequest (one-to-many)
User.hasMany(EventRequest, { foreignKey: 'reviewerId', as: 'reviewedRequests' });
EventRequest.belongsTo(User, { foreignKey: 'reviewerId', as: 'reviewer' });

// Venue to EventRequest (one-to-many)
Venue.hasMany(EventRequest, { foreignKey: 'venueId' });
EventRequest.belongsTo(Venue, { foreignKey: 'venueId', as: 'venue' });

// EventRequest to Guest (one-to-many)
EventRequest.hasMany(Guest, { foreignKey: 'eventRequestId' });
Guest.belongsTo(EventRequest, { foreignKey: 'eventRequestId' });

// EventRequest to Payment (one-to-many)
EventRequest.hasMany(Payment, { foreignKey: 'eventRequestId' });
Payment.belongsTo(EventRequest, { foreignKey: 'eventRequestId' });

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
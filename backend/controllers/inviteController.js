import { Invite, Events, Venue, User, Payment } from '../models/index.js';

// Create a new invite
export const createInvite = async (req, res) => {
  try {
    const { eventId, email, message } = req.body;
    
    if (!eventId || !email) {
      return res.status(400).json({ message: 'Event ID and email are required' });
    }

    // Check if event exists
    const event = await Events.findByPk(eventId);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    // Check venue capacity if event has a venue
    if (event.venueId) {
      const venue = await Venue.findByPk(event.venueId);
      if (venue && venue.availableCapacity <= 0) {
        return res.status(400).json({ message: 'Venue is at full capacity' });
      }
    }

    // Check if invitation already exists for this email and event
    const existingInvite = await Invite.findOne({
      where: { 
        eventId: eventId,
        email: email
      }
    });

    if (existingInvite) {
      return res.status(400).json({ 
        message: 'Invitation already sent to this email for this event',
        inviteCode: existingInvite.code
      });
    }

    // Create the invite
    const invite = await Invite.create({
      eventId,
      email,
      sentBy: req.user.email,
      sentDate: new Date()
    });

    // Return the invite with its code
    res.status(201).json({
      message: 'Invitation sent successfully',
      inviteCode: invite.code,
      invite
    });

  } catch (error) {
    console.error('Error creating invite:', error);
    res.status(500).json({
      message: 'Failed to create invitation',
      error: error.message
    });
  }
};

// Get invites for an event
export const getEventInvites = async (req, res) => {
  try {
    const { eventId } = req.params;
    
    // Check if user is authorized (event organizer or admin)
    const event = await Events.findByPk(eventId);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    // Only event organizer or admin can view invites
    if (event.organizerEmail !== req.user.email && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Unauthorized to view these invites' });
    }

    const invites = await Invite.findAll({
      where: { eventId },
      include: [
        {
          model: Payment,
          as: 'payment',
          attributes: ['id', 'status', 'amount', 'paymentDate', 'adminApproved']
        }
      ]
    });

    // Calculate statistics
    const stats = {
      total: invites.length,
      accepted: invites.filter(invite => invite.status === 'accepted').length,
      declined: invites.filter(invite => invite.status === 'declined').length,
      pending: invites.filter(invite => invite.status === 'pending').length,
      paidCount: invites.filter(invite => invite.paid).length,
      totalRevenue: invites.reduce((sum, invite) => {
        if (invite.payment && invite.payment.status === 'completed') {
          return sum + invite.payment.amount;
        }
        return sum;
      }, 0)
    };

    res.status(200).json({
      invites,
      stats
    });

  } catch (error) {
    console.error('Error getting invites:', error);
    res.status(500).json({
      message: 'Failed to get invitations',
      error: error.message
    });
  }
};

// Verify an invite code
export const verifyInvite = async (req, res) => {
  try {
    const { code } = req.body;
    
    if (!code) {
      return res.status(400).json({ message: 'Invite code is required' });
    }

    // Find the invite with the code
    const invite = await Invite.findOne({
      where: { code },
      include: [
        {
          model: Events,
          as: 'event',
          include: [
            {
              model: Venue,
              as: 'venue'
            }
          ]
        }
      ]
    });

    if (!invite) {
      return res.status(404).json({ message: 'Invalid invite code' });
    }

    // Return invite details with event information
    res.status(200).json({
      message: 'Invite code valid',
      invite,
      event: invite.event
    });

  } catch (error) {
    console.error('Error verifying invite:', error);
    res.status(500).json({
      message: 'Failed to verify invitation',
      error: error.message
    });
  }
};

// Accept or decline an invite
export const respondToInvite = async (req, res) => {
  try {
    const { code, response } = req.body;
    
    if (!code || !response || !['accepted', 'declined'].includes(response)) {
      return res.status(400).json({ message: 'Valid invite code and response (accepted/declined) are required' });
    }

    // Find the invite
    const invite = await Invite.findOne({
      where: { code },
      include: [
        {
          model: Events,
          as: 'event',
          include: [
            {
              model: Venue,
              as: 'venue'
            }
          ]
        }
      ]
    });

    if (!invite) {
      return res.status(404).json({ message: 'Invalid invite code' });
    }

    // Check if venue has capacity if accepting
    if (response === 'accepted' && invite.event.venueId) {
      const venue = invite.event.venue;
      
      if (venue && venue.availableCapacity <= 0) {
        return res.status(400).json({ message: 'Cannot accept invitation. Venue is at full capacity.' });
      }

      // Update venue capacity
      await Venue.update(
        { availableCapacity: venue.availableCapacity - 1 },
        { where: { id: venue.id } }
      );

      // Update event registered count
      await Events.update(
        { 
          registered: invite.event.registered + 1,
          availableCapacity: invite.event.availableCapacity ? invite.event.availableCapacity - 1 : null
        },
        { where: { id: invite.event.id } }
      );
    }

    // Update the invite status
    await Invite.update(
      {
        status: response,
        responseDate: new Date()
      },
      { where: { code } }
    );

    res.status(200).json({
      message: `Invitation ${response} successfully`,
      requiresPayment: invite.event.price > 0,
      paymentAmount: invite.event.price
    });

  } catch (error) {
    console.error('Error responding to invite:', error);
    res.status(500).json({
      message: 'Failed to respond to invitation',
      error: error.message
    });
  }
};

// Get user's invites
export const getUserInvites = async (req, res) => {
  try {
    const { email } = req.params;
    
    // Check if user is authorized (self or admin)
    if (email !== req.user.email && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Unauthorized to view these invites' });
    }

    const invites = await Invite.findAll({
      where: { email },
      include: [
        {
          model: Events,
          as: 'event',
          include: [
            {
              model: Venue,
              as: 'venue'
            }
          ]
        },
        {
          model: Payment,
          as: 'payment'
        }
      ]
    });

    res.status(200).json(invites);

  } catch (error) {
    console.error('Error getting user invites:', error);
    res.status(500).json({
      message: 'Failed to get user invitations',
      error: error.message
    });
  }
}; 
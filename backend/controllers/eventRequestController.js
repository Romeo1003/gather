import { EventRequest, Venue, User, Guest, Payment } from '../models/index.js';
import { Op } from 'sequelize';

// Create a new event request
export const createEventRequest = async (req, res) => {
  try {
    const {
      eventType,
      title,
      description,
      estimatedGuests,
      budget,
      startDate,
      endDate,
      venueId,
      specialRequests
    } = req.body;

    // Validate venue exists
    const venueExists = await Venue.findByPk(venueId);
    if (!venueExists) {
      return res.status(404).json({ message: 'Venue not found' });
    }

    // Create event request
    const eventRequest = await EventRequest.create({
      clientEmail: req.user.email,
      eventType,
      title,
      description,
      estimatedGuests,
      budget,
      startDate,
      endDate,
      venueId,
      specialRequests,
      notificationSent: false
    });

    if (eventRequest) {
      // Return the created event request with venue details
      const eventRequestWithVenue = await EventRequest.findByPk(eventRequest.id, {
        include: [
          {
            model: Venue,
            as: 'venue'
          }
        ]
      });

      res.status(201).json({
        success: true,
        message: 'Event request created successfully',
        eventRequest: eventRequestWithVenue
      });
    } else {
      res.status(400).json({ message: 'Invalid event request data' });
    }
  } catch (error) {
    console.error('Error creating event request:', error);
    res.status(500).json({
      message: 'Failed to create event request',
      error: error.message
    });
  }
};

// Get all event requests for admin
export const getAllEventRequests = async (req, res) => {
  try {
    // Ensure user is admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to access all event requests' });
    }

    const eventRequests = await EventRequest.findAll({
      include: [
        {
          model: User,
          as: 'client',
          attributes: ['name', 'email']
        },
        {
          model: Venue,
          as: 'venue',
          attributes: ['name', 'location', 'capacity']
        },
        {
          model: User,
          as: 'reviewer',
          attributes: ['name', 'email']
        }
      ],
      order: [['createdAt', 'DESC']]
    });

    res.status(200).json(eventRequests);
  } catch (error) {
    console.error('Error getting all event requests:', error);
    res.status(500).json({
      message: 'Failed to get event requests',
      error: error.message
    });
  }
};

// Get event requests for a client
export const getClientEventRequests = async (req, res) => {
  try {
    const clientEmail = req.user.email;
    
    const eventRequests = await EventRequest.findAll({
      where: { clientEmail },
      include: [
        {
          model: Venue,
          as: 'venue'
        },
        {
          model: User,
          as: 'reviewer',
          attributes: ['name', 'email']
        }
      ],
      order: [['requestDate', 'DESC']]
    });

    res.status(200).json(eventRequests);
  } catch (error) {
    console.error('Error getting client event requests:', error);
    res.status(500).json({
      message: 'Failed to get client event requests',
      error: error.message
    });
  }
};

// Get event request details
export const getEventRequestDetails = async (req, res) => {
  try {
    const { id } = req.params;
    const eventRequest = await EventRequest.findById(id)
      .populate('venueId', 'name location imageUrl capacity amenities')
      .populate('userId', 'name');

    if (!eventRequest) {
      return res.status(404).json({ error: 'Event request not found' });
    }

    // Check if user owns this request or is admin
    if (eventRequest.userId._id.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Not authorized to access this event request' });
    }

    res.status(200).json({
      success: true,
      eventRequest
    });
  } catch (error) {
    console.error('Error fetching event request details:', error);
    res.status(500).json({ error: 'Failed to fetch event request details' });
  }
};

// Update event request status (admin only)
export const updateEventRequestStatus = asyncHandler(async (req, res) => {
  const { status, adminNotes, cost } = req.body;
  const eventRequest = await EventRequest.findById(req.params.id);

  if (eventRequest) {
    eventRequest.status = status || eventRequest.status;
    
    if (adminNotes !== undefined) {
      eventRequest.adminNotes = adminNotes;
    }
    
    // Update cost if provided
    if (cost) {
      eventRequest.cost.venueCharge = cost.venueCharge || eventRequest.cost.venueCharge;
      eventRequest.cost.serviceCharge = cost.serviceCharge || eventRequest.cost.serviceCharge;
      eventRequest.cost.additionalCharges = cost.additionalCharges || eventRequest.cost.additionalCharges;
      eventRequest.cost.discount = cost.discount || eventRequest.cost.discount;
      eventRequest.cost.tax = cost.tax || eventRequest.cost.tax;
      
      // Calculate total
      eventRequest.calculateTotalCost();
    }

    const updatedEventRequest = await eventRequest.save();
    res.json(updatedEventRequest);
  } else {
    res.status(404);
    throw new Error('Event request not found');
  }
});

// Process payment for event request
export const processPayment = asyncHandler(async (req, res) => {
  const { paymentMethod, transactionId } = req.body;
  const eventRequest = await EventRequest.findById(req.params.id);

  if (eventRequest) {
    // Check if the request belongs to the logged-in user
    if (eventRequest.user.toString() !== req.user._id.toString()) {
      res.status(403);
      throw new Error('Not authorized to pay for this event request');
    }

    // Only allow payment if status is payment_pending
    if (eventRequest.status !== 'payment_pending') {
      res.status(400);
      throw new Error('This event request is not ready for payment');
    }

    // Update payment info
    eventRequest.paymentInfo.isPaid = true;
    eventRequest.paymentInfo.paidAt = Date.now();
    eventRequest.paymentInfo.method = paymentMethod;
    eventRequest.paymentInfo.transactionId = transactionId;
    eventRequest.status = 'paid';

    const updatedEventRequest = await eventRequest.save();
    res.json(updatedEventRequest);
  } else {
    res.status(404);
    throw new Error('Event request not found');
  }
});

// Admin approve payment
export const approvePayment = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Ensure user is admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Only admins can approve payments' });
    }

    const eventRequest = await EventRequest.findByPk(id, {
      include: [
        {
          model: Venue,
          as: 'venue'
        },
        {
          model: User,
          as: 'client',
          attributes: ['name', 'email']
        }
      ]
    });

    if (!eventRequest) {
      return res.status(404).json({ message: 'Event request not found' });
    }

    // Check if payment is pending
    if (eventRequest.paymentStatus !== 'pending') {
      return res.status(400).json({ message: 'No pending payment to approve for this event request' });
    }

    // Update payment status
    await EventRequest.update(
      {
        paymentStatus: 'completed',
        status: 'approved' // Auto-approve the event request upon payment approval
      },
      { where: { id } }
    );

    // Get the updated event request
    const updatedEventRequest = await EventRequest.findByPk(id, {
      include: [
        {
          model: Venue,
          as: 'venue'
        },
        {
          model: User,
          as: 'client',
          attributes: ['name', 'email']
        }
      ]
    });

    // In a real app, send confirmation email to the client

    res.status(200).json({
      message: 'Payment approved successfully. Event request has been automatically approved.',
      eventRequest: updatedEventRequest
    });
  } catch (error) {
    console.error('Error approving payment:', error);
    res.status(500).json({
      message: 'Failed to approve payment',
      error: error.message
    });
  }
};

// Add guests to an event request
export const addGuests = async (req, res) => {
  try {
    const { id } = req.params;
    const { guests } = req.body;
    
    if (!Array.isArray(guests) || guests.length === 0) {
      return res.status(400).json({ message: 'Guests array is required' });
    }

    // Find the event request
    const eventRequest = await EventRequest.findByPk(id);

    if (!eventRequest) {
      return res.status(404).json({ message: 'Event request not found' });
    }

    // Check authorization
    if (eventRequest.clientEmail !== req.user.email) {
      return res.status(403).json({ message: 'Not authorized to add guests to this event request' });
    }

    // Check if payment is completed for the event request
    if (eventRequest.paymentStatus !== 'completed') {
      return res.status(400).json({ message: 'Payment must be completed before adding guests' });
    }

    // Process each guest
    const guestRecords = [];
    for (const guest of guests) {
      if (!guest.name || !guest.phone) {
        return res.status(400).json({ message: 'Name and phone are required for each guest' });
      }

      // Create guest record
      const guestRecord = await Guest.create({
        name: guest.name,
        phone: guest.phone,
        email: guest.email,
        eventRequestId: id,
        notes: guest.notes
      });

      guestRecords.push(guestRecord);
    }

    res.status(201).json({
      message: 'Guests added successfully',
      guests: guestRecords
    });
  } catch (error) {
    console.error('Error adding guests:', error);
    res.status(500).json({
      message: 'Failed to add guests',
      error: error.message
    });
  }
};

// Get guests for an event request
export const getEventGuests = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Find the event request
    const eventRequest = await EventRequest.findByPk(id);

    if (!eventRequest) {
      return res.status(404).json({ message: 'Event request not found' });
    }

    // Check authorization
    if (req.user.role !== 'admin' && eventRequest.clientEmail !== req.user.email) {
      return res.status(403).json({ message: 'Not authorized to view guests for this event request' });
    }

    // Check if client has opted to share guest list with admin
    if (req.user.role === 'admin' && !eventRequest.shareGuestList) {
      return res.status(200).json({
        estimatedGuests: eventRequest.estimatedGuests,
        shareGuestList: false,
        message: 'Client has opted not to share the guest list',
        guestCount: await Guest.count({ where: { eventRequestId: id } })
      });
    }

    // Get the guests
    const guests = await Guest.findAll({
      where: { eventRequestId: id },
      order: [['createdAt', 'ASC']]
    });

    res.status(200).json({
      estimatedGuests: eventRequest.estimatedGuests,
      shareGuestList: eventRequest.shareGuestList,
      guestCount: guests.length,
      guests
    });
  } catch (error) {
    console.error('Error getting event guests:', error);
    res.status(500).json({
      message: 'Failed to get event guests',
      error: error.message
    });
  }
};

// Send invites to guests
export const sendInvites = async (req, res) => {
  try {
    const { id } = req.params;
    const { emails } = req.body;

    if (!emails || !Array.isArray(emails) || emails.length === 0) {
      return res.status(400).json({ error: 'Valid email list is required' });
    }

    const eventRequest = await EventRequest.findById(id);

    if (!eventRequest) {
      return res.status(404).json({ error: 'Event request not found' });
    }

    // Check if user owns this request
    if (eventRequest.userId.toString() !== req.user.id) {
      return res.status(403).json({ error: 'Not authorized to send invites for this event request' });
    }

    // Check if the request is in a valid state for sending invites
    if (eventRequest.status !== 'approved' || eventRequest.paymentStatus !== 'paid') {
      return res.status(400).json({ error: 'Invites can only be sent for approved and paid event requests' });
    }

    // Get event details for the invitation
    const event = {
      title: eventRequest.title,
      date: eventRequest.startDate,
      venue: await Venue.findById(eventRequest.venueId).select('name location'),
      inviteCode: eventRequest.inviteCode
    };

    // Send emails (this would be handled by your email service)
    // This is a simulated implementation
    try {
      for (const email of emails) {
        await sendEmail({
          to: email,
          subject: `You're Invited to ${event.title}!`,
          text: `You have been invited to ${event.title} at ${event.venue.name} on ${event.date.toLocaleDateString()}. 
                Use the invite code ${event.inviteCode} to RSVP.`
        });
      }
    } catch (emailError) {
      console.error('Failed to send invites:', emailError);
      return res.status(500).json({ error: 'Failed to send some invites' });
    }

    eventRequest.invitesSent = true;
    await eventRequest.save();

    res.status(200).json({
      success: true,
      message: `Invites sent to ${emails.length} guests successfully`
    });
  } catch (error) {
    console.error('Error sending invites:', error);
    res.status(500).json({ error: 'Failed to send invites' });
  }
};

export const verifyInviteCode = async (req, res) => {
  try {
    const { code } = req.params;

    if (!code) {
      return res.status(400).json({ error: 'Invite code is required' });
    }

    const eventRequest = await EventRequest.findOne({ inviteCode: code })
      .populate('venueId', 'name location imageUrl')
      .populate('userId', 'name');

    if (!eventRequest) {
      return res.status(404).json({ error: 'Invalid invite code' });
    }

    // Check if event is still valid (not canceled)
    if (eventRequest.status === 'canceled') {
      return res.status(400).json({ error: 'This event has been canceled' });
    }

    res.status(200).json({
      success: true,
      event: {
        id: eventRequest._id,
        title: eventRequest.title,
        description: eventRequest.description,
        host: eventRequest.userId.name,
        venue: eventRequest.venueId,
        startDate: eventRequest.startDate,
        endDate: eventRequest.endDate,
        eventType: eventRequest.eventType
      }
    });
  } catch (error) {
    console.error('Error verifying invite code:', error);
    res.status(500).json({ error: 'Failed to verify invite code' });
  }
};

export const getEventRequestStats = asyncHandler(async (req, res) => {
  // Count requests by status
  const statusCounts = await EventRequest.aggregate([
    {
      $group: {
        _id: '$status',
        count: { $sum: 1 }
      }
    }
  ]);

  // Count requests by event type
  const typeCounts = await EventRequest.aggregate([
    {
      $group: {
        _id: '$eventType',
        count: { $sum: 1 }
      }
    }
  ]);

  // Calculate revenue from paid events
  const revenue = await EventRequest.aggregate([
    {
      $match: { 'paymentInfo.isPaid': true }
    },
    {
      $group: {
        _id: null,
        totalRevenue: { $sum: '$cost.total' },
        count: { $sum: 1 }
      }
    }
  ]);

  // Get most popular venues
  const popularVenues = await EventRequest.aggregate([
    {
      $group: {
        _id: '$venue',
        count: { $sum: 1 }
      }
    },
    {
      $sort: { count: -1 }
    },
    {
      $limit: 5
    },
    {
      $lookup: {
        from: 'venues',
        localField: '_id',
        foreignField: '_id',
        as: 'venueDetails'
      }
    },
    {
      $project: {
        venueName: { $arrayElemAt: ['$venueDetails.name', 0] },
        count: 1
      }
    }
  ]);

  res.json({
    statusCounts,
    typeCounts,
    revenue: revenue.length > 0 ? revenue[0] : { totalRevenue: 0, count: 0 },
    popularVenues
  });
}); 
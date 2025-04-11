import { Payment, Invite, Events, User } from '../models/index.js';

// Process a payment for an invite
export const processPayment = async (req, res) => {
  try {
    const { inviteCode, paymentMethod, amount } = req.body;
    
    if (!inviteCode || !paymentMethod) {
      return res.status(400).json({ message: 'Invite code and payment method are required' });
    }

    // Find the invite
    const invite = await Invite.findOne({
      where: { code: inviteCode },
      include: [
        {
          model: Events,
          as: 'event'
        }
      ]
    });

    if (!invite) {
      return res.status(404).json({ message: 'Invalid invite code' });
    }

    // Verify invite status
    if (invite.status !== 'accepted') {
      return res.status(400).json({ message: 'Invitation must be accepted before payment' });
    }

    // Verify amount matches event price
    if (amount !== invite.event.price) {
      return res.status(400).json({ 
        message: 'Payment amount does not match event price',
        expectedAmount: invite.event.price
      });
    }

    // Check if payment already exists
    const existingPayment = await Payment.findOne({
      where: { inviteId: invite.id }
    });

    if (existingPayment) {
      return res.status(400).json({ 
        message: 'Payment already exists for this invitation',
        paymentStatus: existingPayment.status
      });
    }

    // Create mock transaction ID
    const transactionId = `TXN-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`;

    // Create the payment record
    const payment = await Payment.create({
      inviteId: invite.id,
      amount,
      paymentMethod,
      transactionId,
      status: 'completed', // In a real app, this would depend on payment gateway response
      paidBy: req.user.email,
      paymentDate: new Date(),
      adminApproved: false // Requires admin approval
    });

    // Update the invite paid status
    await Invite.update(
      { paid: true, paymentDate: new Date(), paymentAmount: amount, paymentReference: transactionId },
      { where: { id: invite.id } }
    );

    // Find admins to notify (in a real app, this would trigger notifications)
    const admins = await User.findAll({
      where: { role: 'admin' }
    });

    res.status(200).json({
      message: 'Payment processed successfully',
      payment,
      requiresApproval: true,
      notifiedAdmins: admins.length
    });

  } catch (error) {
    console.error('Error processing payment:', error);
    res.status(500).json({
      message: 'Failed to process payment',
      error: error.message
    });
  }
};

// Get payment details
export const getPaymentDetails = async (req, res) => {
  try {
    const { id } = req.params;
    
    const payment = await Payment.findByPk(id, {
      include: [
        {
          model: Invite,
          as: 'invite',
          include: [
            {
              model: Events,
              as: 'event'
            }
          ]
        },
        {
          model: User,
          as: 'payingUser',
          attributes: ['name', 'email']
        },
        {
          model: User,
          as: 'approvingAdmin',
          attributes: ['name', 'email']
        }
      ]
    });

    if (!payment) {
      return res.status(404).json({ message: 'Payment not found' });
    }

    // Check authorization - admin, paying user, or event organizer
    const isAdmin = req.user.role === 'admin';
    const isPayer = payment.paidBy === req.user.email;
    const isOrganizer = payment.invite.event.organizerEmail === req.user.email;

    if (!isAdmin && !isPayer && !isOrganizer) {
      return res.status(403).json({ message: 'Unauthorized to view this payment' });
    }

    res.status(200).json(payment);

  } catch (error) {
    console.error('Error getting payment details:', error);
    res.status(500).json({
      message: 'Failed to get payment details',
      error: error.message
    });
  }
};

// Admin approves payment
export const approvePayment = async (req, res) => {
  try {
    const { id } = req.params;
    const { notes } = req.body;
    
    // Verify user is admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Only admins can approve payments' });
    }

    const payment = await Payment.findByPk(id, {
      include: [
        {
          model: Invite,
          as: 'invite',
          include: [
            {
              model: Events,
              as: 'event'
            }
          ]
        }
      ]
    });

    if (!payment) {
      return res.status(404).json({ message: 'Payment not found' });
    }

    if (payment.adminApproved) {
      return res.status(400).json({ message: 'Payment already approved' });
    }

    // Update payment
    await Payment.update(
      {
        adminApproved: true,
        approvedBy: req.user.email,
        approvalDate: new Date(),
        notes: notes || 'Payment approved'
      },
      { where: { id } }
    );

    // In a real app, send confirmation email to user
    
    res.status(200).json({
      message: 'Payment approved successfully',
      eventName: payment.invite.event.title,
      attendeeName: payment.invite.email
    });

  } catch (error) {
    console.error('Error approving payment:', error);
    res.status(500).json({
      message: 'Failed to approve payment',
      error: error.message
    });
  }
};

// Get pending payments for admin
export const getPendingPayments = async (req, res) => {
  try {
    // Verify user is admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Only admins can view pending payments' });
    }

    const pendingPayments = await Payment.findAll({
      where: { adminApproved: false },
      include: [
        {
          model: Invite,
          as: 'invite',
          include: [
            {
              model: Events,
              as: 'event'
            }
          ]
        },
        {
          model: User,
          as: 'payingUser',
          attributes: ['name', 'email']
        }
      ]
    });

    res.status(200).json({
      count: pendingPayments.length,
      payments: pendingPayments
    });

  } catch (error) {
    console.error('Error getting pending payments:', error);
    res.status(500).json({
      message: 'Failed to get pending payments',
      error: error.message
    });
  }
}; 
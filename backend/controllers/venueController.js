import { Venue, Events } from '../models/index.js';

// Create a new venue
export const createVenue = async (req, res) => {
  try {
    const { name, location, capacity, services, description, pricePerPerson, image } = req.body;
    
    // Basic validation
    if (!name || !location || !capacity) {
      return res.status(400).json({ message: 'Name, location, and capacity are required' });
    }

    // Validate capacity range
    if (capacity < 100 || capacity > 350) {
      return res.status(400).json({ message: 'Capacity must be between 100 and 350' });
    }

    // Create venue with available capacity equal to total capacity
    const venue = await Venue.create({
      name,
      location,
      capacity,
      availableCapacity: capacity,
      services: services || [],
      description,
      pricePerPerson: pricePerPerson || 0,
      image
    });

    res.status(201).json({
      message: 'Venue created successfully',
      venue
    });

  } catch (error) {
    console.error('Error creating venue:', error);
    res.status(500).json({
      message: 'Failed to create venue',
      error: error.message
    });
  }
};

// Get all venues
export const getAllVenues = async (req, res) => {
  try {
    const venues = await Venue.findAll({
      include: [
        {
          model: Events,
          as: 'events',
          attributes: ['id', 'title', 'startDate', 'endDate']
        }
      ]
    });

    res.status(200).json(venues);

  } catch (error) {
    console.error('Error getting venues:', error);
    res.status(500).json({
      message: 'Failed to get venues',
      error: error.message
    });
  }
};

// Get venue by ID
export const getVenueById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const venue = await Venue.findByPk(id, {
      include: [
        {
          model: Events,
          as: 'events',
          attributes: ['id', 'title', 'startDate', 'endDate', 'registered']
        }
      ]
    });

    if (!venue) {
      return res.status(404).json({ message: 'Venue not found' });
    }

    res.status(200).json(venue);

  } catch (error) {
    console.error('Error getting venue:', error);
    res.status(500).json({
      message: 'Failed to get venue',
      error: error.message
    });
  }
};

// Update venue
export const updateVenue = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, location, capacity, services, description, pricePerPerson, image } = req.body;
    
    // Find venue
    const venue = await Venue.findByPk(id);
    if (!venue) {
      return res.status(404).json({ message: 'Venue not found' });
    }

    // Validate capacity if changing
    if (capacity !== undefined) {
      if (capacity < 100 || capacity > 350) {
        return res.status(400).json({ message: 'Capacity must be between 100 and 350' });
      }
      
      // Calculate difference in total capacity
      const capacityDifference = capacity - venue.capacity;
      
      // Update available capacity proportionally
      const newAvailableCapacity = venue.availableCapacity + capacityDifference;
      
      // Update venue with new capacity and available capacity
      await Venue.update(
        {
          name: name || venue.name,
          location: location || venue.location,
          capacity,
          availableCapacity: newAvailableCapacity < 0 ? 0 : newAvailableCapacity,
          services: services !== undefined ? services : venue.services,
          description: description !== undefined ? description : venue.description,
          pricePerPerson: pricePerPerson !== undefined ? pricePerPerson : venue.pricePerPerson,
          image: image || venue.image
        },
        { where: { id } }
      );
    } else {
      // Update venue without changing capacity
      await Venue.update(
        {
          name: name || venue.name,
          location: location || venue.location,
          services: services !== undefined ? services : venue.services,
          description: description !== undefined ? description : venue.description,
          pricePerPerson: pricePerPerson !== undefined ? pricePerPerson : venue.pricePerPerson,
          image: image || venue.image
        },
        { where: { id } }
      );
    }

    // Get updated venue
    const updatedVenue = await Venue.findByPk(id);

    res.status(200).json({
      message: 'Venue updated successfully',
      venue: updatedVenue
    });

  } catch (error) {
    console.error('Error updating venue:', error);
    res.status(500).json({
      message: 'Failed to update venue',
      error: error.message
    });
  }
};

// Delete venue
export const deleteVenue = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Check if venue exists
    const venue = await Venue.findByPk(id);
    if (!venue) {
      return res.status(404).json({ message: 'Venue not found' });
    }

    // Check if venue has events
    const events = await Events.findAll({ where: { venueId: id } });
    if (events.length > 0) {
      return res.status(400).json({ 
        message: 'Cannot delete venue with associated events',
        eventsCount: events.length
      });
    }

    // Delete venue
    await Venue.destroy({ where: { id } });

    res.status(200).json({
      message: 'Venue deleted successfully'
    });

  } catch (error) {
    console.error('Error deleting venue:', error);
    res.status(500).json({
      message: 'Failed to delete venue',
      error: error.message
    });
  }
}; 
import { Venue } from '../models/index.js';

const seedVenues = async () => {
  try {
    // Delete existing venues
    await Venue.destroy({ where: {} });
    
    // Create sample venues
    const venues = [
      {
        name: 'Grand Ballroom',
        location: 'Downtown Conference Center, New York',
        capacity: 300,
        availableCapacity: 300,
        description: 'An elegant ballroom with high ceilings, crystal chandeliers, and hardwood floors. Perfect for formal events and large gatherings.',
        services: ['Catering', 'Audio/Visual', 'Stage Setup', 'Valet Parking'],
        pricePerPerson: 85,
        image: 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
      },
      {
        name: 'Garden Terrace',
        location: 'Botanical Gardens, San Francisco',
        capacity: 150,
        availableCapacity: 150,
        description: 'A beautiful outdoor venue surrounded by lush gardens and water features. Ideal for weddings and summer events.',
        services: ['Catering', 'Tent Setup', 'Outdoor Lighting', 'Garden Furniture'],
        pricePerPerson: 65,
        image: 'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
      },
      {
        name: 'Tech Hub',
        location: 'Innovation Center, Austin',
        capacity: 120,
        availableCapacity: 120, 
        description: 'A modern venue with state-of-the-art technology and flexible seating arrangements. Perfect for conferences and tech events.',
        services: ['High-Speed Internet', 'Video Conferencing', 'Technical Support', 'Catering'],
        pricePerPerson: 45,
        image: 'https://images.unsplash.com/photo-1497366754035-f200968a6e72?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
      },
      {
        name: 'Skyline Loft',
        location: 'Downtown High-Rise, Chicago',
        capacity: 180,
        availableCapacity: 180,
        description: 'A modern loft space with panoramic city views. Features floor-to-ceiling windows and contemporary design.',
        services: ['Catering', 'Bar Service', 'Sound System', 'Lighting'],
        pricePerPerson: 75,
        image: 'https://images.unsplash.com/photo-1525518392674-39ba1febe311?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
      },
      {
        name: 'Beachfront Pavilion',
        location: 'Seaside Resort, Miami',
        capacity: 200,
        availableCapacity: 200,
        description: 'An open-air pavilion with direct beach access and stunning ocean views. Perfect for tropical themed events.',
        services: ['Beach Setup', 'Catering', 'Bar Service', 'Sound System'],
        pricePerPerson: 90,
        image: 'https://images.unsplash.com/photo-1540541338287-41700207dee6?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
      }
    ];
    
    // Insert venues into database
    for (const venue of venues) {
      await Venue.create(venue);
    }
    
    console.log('✅ Venues seeded successfully');
  } catch (error) {
    console.error('❌ Error seeding venues:', error);
  }
};

// Run the seed function if this file is executed directly
if (process.argv[1].includes('venueSeeder.js')) {
  seedVenues()
    .then(() => process.exit(0))
    .catch(error => {
      console.error('Failed to seed venues:', error);
      process.exit(1);
    });
}

export default seedVenues; 
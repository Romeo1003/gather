import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const Events = sequelize.define(
  "Events",
  {
    id: {
      type: DataTypes.STRING(6),
      primaryKey: true,
      allowNull: false,
      field: "id",
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
      field: "title",
    },
    description: {
      type: DataTypes.STRING,
      allowNull: false,
      field: "description",
    },
    startDate: {
      type: DataTypes.DATE,
      allowNull: false,
      field: "start_date",
    },
    endDate: {
      type: DataTypes.DATE,
      allowNull: false,
      field: "end_date",
    },
    time: {
      type: DataTypes.STRING,
      allowNull: true,
      field: "time",
    },
    registered: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0,
      field: "registered",
    },
    image: {
      type: DataTypes.STRING,
      allowNull: true,
      field: "image",
    },
    price: {
      type: DataTypes.FLOAT,
      allowNull: true,
      defaultValue: 0,
      field: "price",
    },
    location: {
      type: DataTypes.STRING,
      allowNull: false,
      field: "location",
    },
    venueId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      field: "venue_id",
    },
    capacity: {
      type: DataTypes.INTEGER,
      allowNull: true,
      field: "capacity",
    },
    availableCapacity: {
      type: DataTypes.INTEGER,
      allowNull: true,
      field: "available_capacity",
    },
    status: {
      type: DataTypes.ENUM('draft', 'published', 'cancelled'),
      defaultValue: 'draft',
      field: "status",
    },
    requiredServices: {
      type: DataTypes.TEXT,
      allowNull: true,
      field: "required_services",
      get() {
        const rawValue = this.getDataValue('requiredServices');
        return rawValue ? JSON.parse(rawValue) : [];
      },
      set(value) {
        this.setDataValue('requiredServices', JSON.stringify(value));
      }
    },
    organizerEmail: {
      type: DataTypes.STRING,
      allowNull: true,
      field: "organizer_email",
    },
  },
  {
    timestamps: true,
    hooks: {
      beforeValidate: (event) => {
        if (!event.id) {
          event.id = generateEventId();
        }
      }
    }
  }
);

// Function to generate 6-digit alphanumeric ID
function generateEventId() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < 6; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

export default Events;
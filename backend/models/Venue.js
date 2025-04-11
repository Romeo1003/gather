import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const Venue = sequelize.define("Venue", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  location: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  capacity: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      min: 100,
      max: 350
    }
  },
  availableCapacity: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  services: {
    type: DataTypes.TEXT,
    allowNull: true,
    get() {
      const rawValue = this.getDataValue('services');
      return rawValue ? JSON.parse(rawValue) : [];
    },
    set(value) {
      this.setDataValue('services', JSON.stringify(value));
    }
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  pricePerPerson: {
    type: DataTypes.FLOAT,
    allowNull: false,
    defaultValue: 0,
  },
  image: {
    type: DataTypes.STRING(255),
    allowNull: true,
  }
}, {
  timestamps: true,
  hooks: {
    beforeValidate: (venue) => {
      if (venue.isNewRecord && venue.capacity && !venue.availableCapacity) {
        venue.availableCapacity = venue.capacity;
      }
    }
  }
});

export default Venue; 
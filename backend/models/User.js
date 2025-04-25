import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";
import bcrypt from "bcrypt";

export const User = sequelize.define("User", {
	id: {
		type: DataTypes.INTEGER,
		autoIncrement: true,
		primaryKey: true,
	},
	name: {
		type: DataTypes.STRING,
		allowNull: false,
	},
	email: {
		type: DataTypes.STRING,
		allowNull: false,
		unique: true,
		set(value) {
			this.setDataValue('email', value.toLowerCase());
		},
	},
	password: {
		type: DataTypes.STRING,
		allowNull: false,
	},
	creation_date: {
		type: DataTypes.DATE,
		defaultValue: DataTypes.NOW,
	},
	profile_visibility: {
		type: DataTypes.ENUM("public", "private"),
		defaultValue: "public",
	},
	role: {
		type: DataTypes.ENUM('admin', 'customer'),
		defaultValue: 'customer',
	},
}, {
	timestamps: true,
	hooks: {
		beforeCreate: async (user) => {
			if (user.password) {
				const salt = await bcrypt.genSalt(10);
				user.password = await bcrypt.hash(user.password, salt);
			}
		},
		beforeUpdate: async (user) => {
			if (user.changed('password')) {
				const salt = await bcrypt.genSalt(10);
				user.password = await bcrypt.hash(user.password, salt);
			}
		}
	}
});

export default User;

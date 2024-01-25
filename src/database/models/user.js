'use strict';
import { compare, hash } from 'bcrypt';
import { Model } from 'sequelize';
import { tokenHelper } from '@/helpers';
export default (sequelize, DataTypes) => {
	class User extends Model {
		static associate(models) {}

		generateToken() {
			const data = {
				id: this.id,
				email: this.email,
				name: this.name,
				isAdmin: this.isAdmin,
				avatar: this.avatar,
			};
			return tokenHelper.generateToken(data);
		}

		validatePassword(plainPassword) {
			return compare(plainPassword, this.password);
		}
	}
	User.init(
		{
			id: {
				allowNull: false,
				autoIncrement: true,
				primaryKey: true,
				type: DataTypes.INTEGER,
				field: 'id',
			},
			email: {
				unique: true,
				allowNull: false,
				type: DataTypes.STRING,
				field: 'email',
			},
			password: {
				type: DataTypes.STRING,
				field: 'password',
			},
			provider: {
				allowNull: false,
				type: DataTypes.STRING,
				field: 'provider',
			},
			socialId: {
				type: DataTypes.STRING,
				field: 'social_id',
			},
			name: {
				type: DataTypes.STRING,
				field: 'name',
			},
			address: {
				type: DataTypes.STRING,
				field: 'address',
			},
			isAdmin: {
				defaultValue: false,
				type: DataTypes.BOOLEAN,
				field: 'is_admin',
			},
			avatar: {
				type: DataTypes.STRING,
				field: 'avatar',
			},
			createdAt: {
				allowNull: false,
				defaultValue: sequelize.literal('CURRENT_TIMESTAMP'),
				type: DataTypes.DATE,
				field: 'created_at',
			},
			updatedAt: {
				allowNull: false,
				defaultValue: sequelize.literal('CURRENT_TIMESTAMP'),
				type: DataTypes.DATE,
				field: 'updated_at',
			},
			deletedAt: {
				allowNull: true,
				type: DataTypes.DATE,
				field: 'deleted_at',
			},
		},
		{
			sequelize,
			modelName: 'User',
			paranoid: true,
			tableName: 'users',
		}
	);

	User.addHook('beforeSave', async (instance) => {
		if (instance.changed('password')) {
			instance.password = await hash(instance.password, 10);
		}
	});

	return User;
};

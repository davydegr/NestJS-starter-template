'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('packingListItem', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
      },
      name: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      packingListId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'packingList',
          key: 'id',
        },
      },
      itemId: {
        type: Sequelize.UUID,
        allowNull: true,
        references: {
          model: 'item',
          key: 'id',
        },
      },
      isChecked: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        default: false,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      deletedAt: {
        type: Sequelize.DATE,
        allowNull: true,
      },
    })
  },
  down: async (queryInterface) => {
    await queryInterface.dropTable('packingListItem')
  },
}

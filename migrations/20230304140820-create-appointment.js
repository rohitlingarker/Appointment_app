'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Appointments', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      eventName: {
        type: Sequelize.STRING,
        allowNull:false,
        validate:{
          len:{
            args:1,
            msg:"Event Name required for and appointment"
          }
        }
      },
      description: {
        type: Sequelize.TEXT,
        defaultValue:"No Description"

      },
      date: {
        type: Sequelize.DATEONLY,
        allowNull:false
      },
      startTime: {
        type: Sequelize.TIME,
        allowNull:false
      },
      endTime: {
        type: Sequelize.TIME,
        allowNull:false,
        validate:{
          shouldBeAfterStartTime(value) {
            if (value>this.startTime) {
              throw new Error('End time cannot be before Start Time');
            }
          }
        }
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATEONLY
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Appointments');
  }
};
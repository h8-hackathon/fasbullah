'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */
    
    await queryInterface.bulkInsert('Credentials', [
      {
        UserId: 1,
        email: 'test1@gmail.com',
        password: 'password',
        role: 'User',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        UserId: 2,
        email: 'test2@gmail.com',
        password: 'password',
        role: 'User',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        UserId: 3,
        email: 'test3@gmail.com',
        password: 'password',
        role: 'User',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ], {})
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */

    await queryInterface.bulkDelete('Credentials', null, {})
  }
};

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
    

    await queryInterface.bulkInsert('Posts', [
      {
        UserId: 1,
        post: 'Hello World',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        UserId: 2,
        post: 'Hello World 2',
        imageURL: 'https://www.google.com/images/branding/googlelogo/2x/googlelogo_color_272x92dp.png',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        UserId: 3,
        post: 'Hello World 3',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        UserId: 2,
        post: 'Hello World 2 - 2',
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

    await queryInterface.bulkDelete('Posts', null, {})
  }
};

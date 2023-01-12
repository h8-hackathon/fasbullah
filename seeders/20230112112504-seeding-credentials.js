'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up (queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */
    
    return queryInterface.bulkInsert('Credentials', [
      {
        UserId: 1,
        email: 'test1@gmail.com',
        password: '$2a$10$.X1OuSZzWbd03H81p2V66.hLxkvJZYBgYi3HuWy.4bFRK2zd6bIG6',
        role: 'User',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        UserId: 2,
        email: 'test2@gmail.com',
        password: '$2a$10$.X1OuSZzWbd03H81p2V66.hLxkvJZYBgYi3HuWy.4bFRK2zd6bIG6',
        role: 'User',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        UserId: 3,
        email: 'test3@gmail.com',
        password: '$2a$10$.X1OuSZzWbd03H81p2V66.hLxkvJZYBgYi3HuWy.4bFRK2zd6bIG6',
        role: 'User',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ], {})
  },

  down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */

    return queryInterface.bulkDelete('Credentials', null, {})
  }
};

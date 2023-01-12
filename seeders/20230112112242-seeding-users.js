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
    await queryInterface.bulkInsert('Users', [
      {
        name: 'John Doe',
        profilePicture: 'https://i.postimg.cc/4yw2JvYm/default-propic.jpg',
        coverPhoto: 'https://i.postimg.cc/nVkns67Q/giga-1.jpg',
        bio: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quod.',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Jane Doe',
        profilePicture: 'https://i.postimg.cc/4yw2JvYm/default-propic.jpg',
        coverPhoto: 'https://i.postimg.cc/nVkns67Q/giga-1.jpg',
        bio: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quod.',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'John Smith',
        profilePicture: 'https://i.postimg.cc/4yw2JvYm/default-propic.jpg',
        coverPhoto: 'https://i.postimg.cc/nVkns67Q/giga-1.jpg',
        bio: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quod.',
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
    await queryInterface.bulkDelete('Users', null, {})
  }
};

'use strict';

const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {

  /**
   * Book instance that takes in title, author, genre, and year of publication for adding to sequelize database.
   */
  class Book extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };

  /**
   * The book model has properties title, author, genre, and year. The title and author properties are validated 
   * using Sequelize validation methods to ensure that they are not left blank when a user is adding a new book to
   * the library app.
   */
  Book.init({
    title: {
     type: DataTypes.STRING,
     allowNull: false,
     validate: {
      notNull: {
        msg: "You must provide a book title.",
      },
      notEmpty: {
        msg: "You must provide a book title."
      }
     }
     
    },
    author: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
       notNull: {
         msg: "You must provide an author name.",
       },
       notEmpty: {
        msg: "You must provide an author name."
        }
      }
    },
    genre: DataTypes.STRING,
    year: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Book',
  });
  return Book;
};
/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('titles', {
    empNo: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      references: {
        model: 'employees',
        key: 'emp_no'
      },
      field: 'emp_no'
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
      primaryKey: true,
      field: 'title'
    },
    fromDate: {
      type: DataTypes.DATE,
      allowNull: false,
      primaryKey: true,
      field: 'from_date'
    },
    toDate: {
      type: DataTypes.DATE,
      allowNull: true,
      field: 'to_date'
    }
  }, {
    tableName: 'titles'
  });
};

/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('salaries', {
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
    salary: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      field: 'salary'
    },
    fromDate: {
      type: DataTypes.DATE,
      allowNull: false,
      primaryKey: true,
      field: 'from_date'
    },
    toDate: {
      type: DataTypes.DATE,
      allowNull: false,
      field: 'to_date'
    }
  }, {
    tableName: 'salaries'
  });
};

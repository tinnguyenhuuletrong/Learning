/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('employees', {
    empNo: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      field: 'emp_no'
    },
    birthDate: {
      type: DataTypes.DATE,
      allowNull: false,
      field: 'birth_date'
    },
    firstName: {
      type: DataTypes.STRING,
      allowNull: false,
      field: 'first_name'
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: false,
      field: 'last_name'
    },
    gender: {
      type: DataTypes.ENUM('M','F'),
      allowNull: false,
      field: 'gender'
    },
    hireDate: {
      type: DataTypes.DATE,
      allowNull: false,
      field: 'hire_date'
    }
  }, {
    tableName: 'employees'
  });
};

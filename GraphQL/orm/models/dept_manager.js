/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('deptManager', {
    deptNo: {
      type: DataTypes.CHAR(4),
      allowNull: false,
      primaryKey: true,
      references: {
        model: 'departments',
        key: 'dept_no'
      },
      field: 'dept_no'
    },
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
    fromDate: {
      type: DataTypes.DATE,
      allowNull: false,
      field: 'from_date'
    },
    toDate: {
      type: DataTypes.DATE,
      allowNull: false,
      field: 'to_date'
    }
  }, {
    tableName: 'dept_manager'
  });
};

/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('departments', {
    deptNo: {
      type: DataTypes.CHAR(4),
      allowNull: false,
      primaryKey: true,
      field: 'dept_no'
    },
    deptName: {
      type: DataTypes.STRING,
      allowNull: false,
      field: 'dept_name'
    }
  }, {
    tableName: 'departments'
  });
};

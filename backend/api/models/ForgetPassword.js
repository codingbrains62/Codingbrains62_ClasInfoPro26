module.exports = {
  tableName: 'forget_password',
  attributes: {
    id: { type: 'number', autoIncrement: true },

    userid: {
      type: 'number',
      required: true
    },

    tokan: {
      type: 'string',
      required: true
    },

    tokan_status: {
      type: 'number',
      defaultsTo: 1 // 1 = active, 0 = used
    },

    browser: {
      type: 'string',
      allowNull: true
    },

    expiresAt: {
      type: 'number',
      columnType: 'bigint'
    }
  }
};
const model = require('../../server/models');
model.sequelize.sync().then(() => {});
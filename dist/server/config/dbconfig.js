var model = require('../../server/models');
model.sequelize.sync().then(function () { });

// https://www.youtube.com/user/googlecloudplatform/search?query=%28DataVis+DevTalk%3A+S01%29

var cc = DataStudioApp.createCommunityConnector();

// https://developers.google.com/datastudio/connector/reference#isadminuser
function isAdminUser() {
  return false;
}

// https://developers.google.com/datastudio/connector/reference#getconfig
function getConfig(request) {
  var config = cc.getConfig();
  return config.build();
}

// https://developers.google.com/datastudio/connector/reference#getschema
function getSchema(request) {
  var fields = cc.getFields();
  var types = cc.FieldType;
  
  var service_name = fields.newDimension()
      .setId('ServiceName')
      .setName('Service')
      .setDescription('Name of the service')
      .setType(types.TEXT);
  
  var service_step_count = fields.newMetric()
      .setId('ServiceStepCount')
      .setName('Service Step Count')
      .setDescription('The number of steps in the service')
      .setType(types.NUMBER);
  
  fields.setDefaultMetric(service_step_count.getId());
  fields.setDefaultDimension(service_name.getId());

  return { 'schema': fields.build() };
}

// https://developers.google.com/datastudio/connector/reference#getdata
function getData(request) {
  return {
    'schema': [
      {
        name: 'ServiceName',
        dataType: 'STRING'
      },
      {
        name: 'ServiceStepCount',
        dataType: 'NUMBER'
      }
    ],
    'rows': [
      {
        'values': ['Test service 1', 4]
      },
      {
        'values': ['Test service 2', 10]
      }
    ]
  };
}
